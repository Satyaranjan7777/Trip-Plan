const express = require('express')
const {
  generateItinerary,
  getItineraryById,
  getMyItineraries,
  getSharedItinerary,
} = require('../controllers/itineraryController')
const { authMiddleware } = require('../middleware/authMiddleware')
const { uploadSingleFile } = require('../middleware/uploadMiddleware')

const router = express.Router()

// POST /api/upload (protected)
router.post('/upload', authMiddleware, uploadSingleFile, generateItinerary)

// GET /api/itinerary (protected)
router.get('/itinerary', authMiddleware, getMyItineraries)

// GET /api/itinerary/:id (protected)
router.get('/itinerary/:id', authMiddleware, getItineraryById)

// GET /api/itinerary/share/:shareToken (PUBLIC)
router.get('/itinerary/share/:shareToken', getSharedItinerary)


module.exports = router



