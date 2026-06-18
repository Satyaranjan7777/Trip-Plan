const mongoose = require('mongoose')

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/trrip-ai-itinerary'

  // eslint-disable-next-line no-console

  await mongoose.connect(uri)
  // eslint-disable-next-line no-console
  console.log('MONGODB connected')
}

module.exports = { connectDB }

