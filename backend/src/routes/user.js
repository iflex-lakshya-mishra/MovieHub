import express from 'express'
import User from '../models/User.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

// GET /api/user/me
router.get('/me', protect, (req, res) => res.json(req.user))

// PUT /api/user/avatar
router.put('/avatar', protect, async (req, res) => {
  try {
    req.user.avatar = req.body.avatar || req.user.avatar
    await req.user.save()
    res.json(req.user.toPublic())
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// GET /api/user/favorites
router.get('/favorites', protect, (req, res) => res.json(req.user.favorites))

// POST /api/user/favorites  { item }
router.post('/favorites', protect, async (req, res) => {
  try {
    const item = req.body.item
    const exists = req.user.favorites.some(f => f.tmdbId === item.tmdbId)
    if (!exists) req.user.favorites.push(item)
    await req.user.save()
    res.json(req.user.favorites)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// DELETE /api/user/favorites/:tmdbId
router.delete('/favorites/:tmdbId', protect, async (req, res) => {
  try {
    req.user.favorites = req.user.favorites.filter(f => String(f.tmdbId) !== req.params.tmdbId)
    await req.user.save()
    res.json(req.user.favorites)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// GET /api/user/watchlist
router.get('/watchlist', protect, (req, res) => res.json(req.user.watchlist))

// POST /api/user/watchlist
router.post('/watchlist', protect, async (req, res) => {
  try {
    const item = req.body.item
    const exists = req.user.watchlist.some(f => f.tmdbId === item.tmdbId)
    if (!exists) req.user.watchlist.push(item)
    await req.user.save()
    res.json(req.user.watchlist)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// DELETE /api/user/watchlist/:tmdbId
router.delete('/watchlist/:tmdbId', protect, async (req, res) => {
  try {
    req.user.watchlist = req.user.watchlist.filter(f => String(f.tmdbId) !== req.params.tmdbId)
    await req.user.save()
    res.json(req.user.watchlist)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

export default router
