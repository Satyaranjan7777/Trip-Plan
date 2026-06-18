const fs = require('fs/promises')
const pdfParseMod = require('pdf-parse')
const Tesseract = require('tesseract.js')

// pdf-parse has multiple export shapes depending on version.
// In your environment, the module is an object (not a function) and PDF parsing is done via `new PDFParse(buffer).parse()`.
const pdfParse = async (buffer) => {
  // Old/new shapes: either a callable module or { pdfParse } or class `PDFParse`.
  if (typeof pdfParseMod === 'function') {
    return pdfParseMod(buffer)
  }
  if (typeof pdfParseMod.pdfParse === 'function') {
    return pdfParseMod.pdfParse(buffer)
  }
  if (pdfParseMod?.PDFParse) {
    // Some versions expose a class-like PDFParse without a `parse()` method.
    // In this case, `new PDFParse(buffer)` returns an object with a `doc` that resolves to parsed content.
    const parser = new pdfParseMod.PDFParse(buffer)
    // pdf-parse typically exposes `doc` (a Promise) on the instance.
    if (parser?.doc && typeof parser.doc.then === 'function') {
      const doc = await parser.doc
      return doc?.text || ''
    }
    // Fallback: if the instance itself has the parsed text.
    return parser?.text || ''
  }
  throw new Error('Unsupported pdf-parse module format')
}

const extractTextFromUploadedFile = async (filePath, mimetype) => {
  if (!filePath) {
    throw new Error('filePath is required')
  }

  const mime = mimetype || ''
  let extracted

  if (mime === 'application/pdf') {
    const dataBuffer = await fs.readFile(filePath)
    const parsed = await pdfParse(dataBuffer)
    extracted = parsed?.text || ''
  } else if (mime === 'image/jpeg' || mime === 'image/png') {
    const { data } = await Tesseract.recognize(filePath, 'eng')
    extracted = data?.text || ''
  } else {
    // Fallback: try OCR anyway
    const { data } = await Tesseract.recognize(filePath, 'eng')
    extracted = data?.text || ''
  }

  console.log('[extractText] extracted text length:', (extracted || '').length)
  return extracted || ''
}

module.exports = { extractTextFromUploadedFile }

