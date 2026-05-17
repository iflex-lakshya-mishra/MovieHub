import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const HeroSection = ({ items = [], title = 'MovieHub', subtitle = 'Watch movies, anime & web series' }) => {
  const [current, setCurrent] = useState(0)
  const [showTrailer, setShowTrailer] = useState(false)
  const navigate = useNavigate()
  const { toggleFav, isFav, toggleWatchlist, inWatchlist } = useApp()

  const item = items[current]

  useEffect(() => {
    if (items.length < 2) return
    const t = setInterval(() => setCurrent(p => (p + 1) % items.length), 7000)
    return () => clearInterval(t)
  }, [items.length])

  if (!item) return (
    <div className="w-full h-[50vh] bg-gradient-to-b from-gray-900 to-black flex items-end pb-20 px-8">
      <div>
        <h1 className="text-5xl font-black text-white mb-2">{title}</h1>
        <p className="text-gray-400">{subtitle}</p>
      </div>
    </div>
  )

  return (
    <div className="relative w-full h-[55vh] sm:h-[65vh] lg:h-[80vh] overflow-hidden">
      {/* Backdrop */}
      {item.backdrop && (
        <img key={item.tmdbId} src={item.backdrop} alt={item.title}
          className="absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-1000"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end pb-12 sm:pb-16 px-6 sm:px-12 lg:px-20 z-10 max-w-3xl">
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${item.media_type === 'movie' ? 'bg-blue-600' : 'bg-purple-600'} text-white`}>
            {item.media_type === 'movie' ? '🎬 MOVIE' : '📺 SERIES'}
          </span>
          {item.rating > 0 && <span className="text-xs text-yellow-400 font-semibold">★ {item.rating}</span>}
          {item.year && <span className="text-xs text-gray-400">{item.year}</span>}
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black text-white leading-tight mb-3 drop-shadow-2xl">
          {item.title}
        </h1>

        {item.overview && (
          <p className="text-gray-300 text-sm sm:text-base line-clamp-2 max-w-lg mb-6">{item.overview}</p>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate(`/detail/${item.media_type}/${item.tmdbId}`, { state: { item } })}
            className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-full font-bold text-sm hover:bg-gray-200 transition shadow-lg">
            ▶ Watch Details
          </button>
          <button
            onClick={() => toggleWatchlist(item)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition border ${inWatchlist(item) ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white/10 border-white/30 text-white hover:bg-white/20'}`}>
            {inWatchlist(item) ? '🔖 In Watchlist' : '➕ Watchlist'}
          </button>
          <button
            onClick={() => toggleFav(item)}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition border ${isFav(item) ? 'bg-red-600 border-red-600' : 'bg-white/10 border-white/30 hover:bg-white/20'}`}>
            {isFav(item) ? '❤️' : '🤍'}
          </button>
        </div>
      </div>

      {/* Dots */}
      {items.length > 1 && (
        <div className="absolute bottom-4 right-6 flex gap-1.5 z-20">
          {items.slice(0, 8).map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              className={`rounded-full transition-all ${i === current ? 'w-6 h-1.5 bg-red-500' : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'}`} />
          ))}
        </div>
      )}
    </div>
  )
}

export default HeroSection
