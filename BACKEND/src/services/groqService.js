const { Groq } = require("groq-sdk")


function extractFirstJsonObject(text) {
  const safeText = text || ''

  // remove markdown fences if present
  const fenced = safeText.match(/```(?:json)?\s*([\s\S]*?)\s*```/i)
  if (fenced?.[1]) return fenced[1]

  // find first { and last }
  const firstBrace = safeText.indexOf('{')
  const lastBrace = safeText.lastIndexOf('}')
  if (firstBrace >= 0 && lastBrace > firstBrace && lastBrace >= 0) {
    return safeText.slice(firstBrace, lastBrace + 1)
  }

  // return as-is so JSON.parse can fail with a clean error
  return safeText
}


async function generateItineraryWithGroq({ extractedText }) {
  const apiKey = process.env.GROQ_API_KEY

  // Required debug logs (safe) - never print full API key
  console.log('[groq] API key loaded:', apiKey ? 'yes' : 'no')
  console.log('[groq] extracted text length:', extractedText?.length || 0)

  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not set in environment variables')
  }

  const groq = new Groq({ apiKey })

  const candidateModels = [
    'llama-3.1-8b-instant',
    'llama-3.3-70b-versatile',
    'llama-3.1-8b-instant',
  ]


  let lastErr


  for (const modelName of candidateModels) {
    console.log('[groq] model used:', modelName)

    try {
      const prompt = `You are a travel itinerary generator.
Analyze the extracted booking text and return ONLY valid JSON.
Do not include markdown.
Do not include explanation.
Do not wrap response in \`\`\`json.


Return exactly this structure:
{
  "tripTitle": "string",
  "destination": "string",
  "startDate": "string",
  "endDate": "string",
  "days": [
    {
      "day": 1,
      "date": "string",
      "activities": ["string"],
      "accommodation": "string",
      "transport": "string"
    }
  ],
  "tips": ["string"]
}

If some information is missing, infer a useful itinerary from available booking details.
If dates are missing, keep date fields empty strings.

Booking text:
${extractedText || ''}`


      const chatCompletion = await groq.chat.completions.create({
        model: modelName,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.2,
      })

      const responseText = chatCompletion?.choices?.[0]?.message?.content || ''
      const trimmed = (responseText || '').trim()
      const jsonString = extractFirstJsonObject(trimmed)

      let parsed
      try {
        parsed = JSON.parse(jsonString)
      } catch (e) {
        throw new Error('Groq did not return valid JSON')
      }

      const days = Array.isArray(parsed?.days) ? parsed.days : []
      const tips = Array.isArray(parsed?.tips) ? parsed.tips : []
      return {
        tripTitle: typeof parsed?.tripTitle === 'string' ? parsed.tripTitle : '',
        destination: typeof parsed?.destination === 'string' ? parsed.destination : '',
        startDate: typeof parsed?.startDate === 'string' ? parsed.startDate : '',
        endDate: typeof parsed?.endDate === 'string' ? parsed.endDate : '',
        days: days.map((d, idx) => ({
          day: typeof d?.day === 'number' ? d.day : idx + 1,
          date: typeof d?.date === 'string' ? d.date : '',
          activities: Array.isArray(d?.activities) ? d.activities : [],
          accommodation: typeof d?.accommodation === 'string' ? d.accommodation : '',
          transport: typeof d?.transport === 'string' ? d.transport : '',
        })),
        tips,
      }

    } catch (err) {
      lastErr = err
      console.error('[groq] generation error:', err?.message || String(err))
    }
  }

  throw new Error('AI itinerary generation failed. Please try again.')
}


module.exports = { generateItineraryWithGroq }



