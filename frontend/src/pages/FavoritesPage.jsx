import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import MediaCard from '../components/MediaCard'
import { useApp } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const FavoritesPage = () => {
  const { user, favorites } = useApp()
  const navigate = useNavigate()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!user) {
    return (
      <div className="bg-[#0a0a0a] min-h-screen flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-xl mb-4">Login to view your favorites</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-red-600 hover:bg-red-500 px-6 py-2.5 rounded-full font-semibold transition"
          >
            Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen">
      <Navbar />
      <div className="pt-[80px] md:pt-[88px] max-w-6xl mx-auto px-4 sm:px-8 pb-20">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-black">Favorites</h1>
          <div className="text-sm text-gray-400">{favorites.length} saved</div>
        </div>

        {!mounted ? (
          <div className="text-gray-500">Loading…</div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-5xl mb-4">😍</p>
            <p className="text-lg font-semibold mb-2">No favorites yet</p>
            <p className="text-sm">Tap the heart on any movie or show to save it here</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-4">
            {favorites.map((item, i) => (
              <MediaCard key={`${item.tmdbId || item.imdbID || 'fav'}-${i}`} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default FavoritesPage

