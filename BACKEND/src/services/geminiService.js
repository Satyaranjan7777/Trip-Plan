// Gemini integration has been removed.
// Keep this file as a compatibility shim so any legacy imports don't break.

const { generateItineraryWithGroq } = require('./groqService')

async function generateItineraryWithGemini({ extractedText }) {
  return generateItineraryWithGroq({ extractedText })
}

module.exports = { generateItineraryWithGemini }


