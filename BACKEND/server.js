require('dotenv').config()
const path = require('path')
const express = require('express')
const cors = require('cors')

// Ensure BACKEND/.env is loaded even if cwd differs
require('dotenv').config({ path: path.join(__dirname, '.env') })


const { connectDB } = require('./src/config/db')
const authRoutes = require('./src/routes/authRoutes')
const itineraryRoutes = require('./src/routes/itineraryRoutes')


const app = express()

app.use(cors({
  origin: [
    'https://trip-ai-satyaranjan.netlify.app',
    'http://localhost:5173',
    'http://localhost:3000',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))
app.use(express.json())

app.get('/health', (req, res) => res.json({ ok: true }))

app.use('/api/auth', authRoutes)
// Strict API: /api/upload and /api/itinerary/*
app.use('/api', itineraryRoutes)

// error handler
const { errorHandler } = require('./src/middleware/errorHandler')
app.use(errorHandler)

const PORT = process.env.PORT || 5000


connectDB()
  .then(() => {
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`[server] running on ${PORT}`)
    })
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error('[server] db connection error', err)
    process.exit(1)
  })


