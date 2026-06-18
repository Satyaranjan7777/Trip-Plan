const { v4: uuidv4 } = require('uuid')
const Itinerary = require('../models/Itinerary')
const { extractTextFromUploadedFile } = require('../services/extractTextService')
const { generateItineraryWithGroq } = require('../services/groqService')


const generateItinerary = async (req, res) => {

  try {
    if (!req.file) {
      return res.status(400).json({ message: 'File is required' })
    }

    // Required logging: uploaded file info
    console.log('[upload] file info:', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
    })

    const extractedText = await extractTextFromUploadedFile(req.file.path, req.file.mimetype)
    console.log('[extractText] extracted text length (controller):', (extractedText || '').length)

    const itinerary = await generateItineraryWithGroq({ extractedText })


    const shareToken = uuidv4()

    const saved = await Itinerary.create({
      userId: req.user._id,
      originalFileName: req.file.originalname,
      extractedText,
      itinerary,
      shareToken,
    })

    return res.status(201).json(saved)
  } catch (e) {
    // Required: Return clean error response instead of crashing
    return res.status(500).json({ message: e?.message || 'Failed to generate itinerary' })
  }
}

const getMyItineraries = async (req, res) => {
  try {
    const itineraries = await Itinerary.find({ userId: req.user._id }).sort({ createdAt: -1 })
    return res.json({ itineraries })
  } catch (e) {
    return res.status(500).json({ message: 'Failed to load itineraries' })
  }
}

const getItineraryById = async (req, res) => {
  try {
    const itinerary = await Itinerary.findOne({ _id: req.params.id, userId: req.user._id })
    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found' })
    }
    return res.json(itinerary)
  } catch (e) {
    return res.status(500).json({ message: 'Failed to load itinerary' })
  }
}

const getSharedItinerary = async (req, res) => {
  try {
    const itinerary = await Itinerary.findOne({ shareToken: req.params.shareToken })
    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found' })
    }
    return res.json(itinerary)
  } catch (e) {
    return res.status(500).json({ message: 'Failed to load shared itinerary' })
  }
}

module.exports = {
  generateItinerary,
  getItineraryById,
  getMyItineraries,
  getSharedItinerary,
}


