import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='300' viewBox='0 0 200 300'%3E%3Crect width='200' height='300' fill='%23374151'/%3E%3Ctext x='100' y='155' text-anchor='middle' font-size='40' fill='%236b7280'%3E🎬%3C/text%3E%3C/svg%3E"

const MediaCard = ({ item, showActions = true }) => {
  const navigate = useNavigate()
  const { isFav, toggleFav, inWatchlist, toggleWatchlist } = useApp()
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgErr,    setImgErr]    = useState(false)

  const fav = isFav(item)
  const wl  = inWatchlist(item)

  const handleClick = () => {
    if (item.tmdbId && item.media_type) {
      navigate(`/detail/${item.media_type}/${item.tmdbId}`, { state: { item } })
    } else if (item.imdbID) {
      navigate(`/detail/resolve/${item.imdbID}`, { state: { item } })
    }
  }

  return (
    <div className="w-36 sm:w-44 md:w-48 shrink-0 group cursor-pointer" onClick={handleClick}>
      <div className="relative rounded-xl overflow-hidden aspect-[2/3] bg-gray-800">

        {/* Skeleton shimmer jab tak image load na ho */}
        {!imgLoaded && !imgErr && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-pulse" />
        )}

        <img
          src={(!imgErr && item.poster) ? item.poster : PLACEHOLDER}
          alt={item.title}
          className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 group-hover:brightness-75 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImgLoaded(true)}
          onError={() => { setImgErr(true); setImgLoaded(true) }}
          loading="lazy"
          decoding="async"
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs font-bold text-white border border-white/30">▶ Details</div>
        </div>

        {/* Rating */}
        {item.rating && parseFloat(item.rating) > 0 && (
          <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm text-yellow-400 text-[10px] font-bold px-1.5 py-0.5 rounded-md">★ {item.rating}</div>
        )}

        {/* Action buttons */}
        {showActions && (
          <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={e => { e.stopPropagation(); toggleFav(item) }}
              className={`w-7 h-7 rounded-full flex items-center justify-center text-sm shadow-lg transition-all ${fav ? 'bg-red-500 scale-110' : 'bg-black/70 hover:bg-red-500/80'}`}>
              {fav ? '❤️' : '🤍'}
            </button>
            <button onClick={e => { e.stopPropagation(); toggleWatchlist(item) }}
              className={`w-7 h-7 rounded-full flex items-center justify-center text-sm shadow-lg transition-all ${wl ? 'bg-blue-500 scale-110' : 'bg-black/70 hover:bg-blue-500/80'}`}>
              {wl ? '🔖' : '➕'}
            </button>
          </div>
        )}

        {/* Media type badge */}
        <div className={`absolute bottom-2 left-2 text-[9px] font-bold px-1.5 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity ${item.media_type === 'movie' ? 'bg-blue-600/80' : 'bg-purple-600/80'} text-white`}>
          {item.media_type === 'movie' ? 'MOVIE' : 'SERIES'}
        </div>
      </div>

      <div className="mt-2 px-0.5">
        <h3 className="text-xs sm:text-sm font-semibold text-white line-clamp-2 leading-snug">{item.title}</h3>
        {item.year && <p className="text-[10px] text-gray-500 mt-0.5">{item.year}</p>}
      </div>
    </div>
  )
}

export default MediaCard
