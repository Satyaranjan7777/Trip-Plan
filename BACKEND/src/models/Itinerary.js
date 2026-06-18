const mongoose = require('mongoose')

const ItinerarySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, required: true },
    originalFileName: { type: String },
    extractedText: { type: String },
    itinerary: {
      tripTitle: { type: String },
      destination: { type: String },
      startDate: { type: String },
      endDate: { type: String },
      days: [
        {
          day: { type: Number },
          date: { type: String },
          activities: { type: [String], default: [] },
          accommodation: { type: String },
          transport: { type: String },
        },
      ],
      tips: { type: [String], default: [] },
    },
    shareToken: { type: String, unique: true, index: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Itinerary', ItinerarySchema)


