import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

import authRoutes     from './routes/auth.js'
import userRoutes     from './routes/user.js'
import listRoutes     from './routes/lists.js'

dotenv.config()

const app = express()

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }))
app.use(express.json())

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth',  authRoutes)
app.use('/api/user',  userRoutes)
app.use('/api/lists', listRoutes)

app.get('/api/health', (_, res) => res.json({ status: 'ok', app: 'MovieHub API' }))

// ── DB + Start ────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected')
    app.listen(PORT, () => console.log(`🚀 MovieHub API running on port ${PORT}`))
  })
  .catch(err => {
    console.error('❌ MongoDB error:', err.message)
    console.log('💡 Running without DB — auth endpoints disabled')
    app.listen(PORT, () => console.log(`🚀 MovieHub API (no-db) on port ${PORT}`))
  })
