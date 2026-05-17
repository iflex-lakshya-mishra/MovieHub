import React, { useRef } from 'react'
import MediaCard from './MediaCard'

const SKELETON_COUNT = 8

const MediaRow = ({ items = [], isLoading = false, showActions = true }) => {
  const ref = useRef(null)
  const scroll = (dir) => ref.current?.scrollBy({ left: dir * 420, behavior: 'smooth' })

  return (
    <div className="relative group/row">
      {/* Scroll buttons */}
      <button onClick={() => scroll(-1)}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10 w-8 h-16 bg-black/80 hover:bg-black border border-white/10 rounded-lg text-white text-xs opacity-0 group-hover/row:opacity-100 transition-opacity hidden sm:flex items-center justify-center shadow-xl">‹</button>
      <button onClick={() => scroll(1)}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10 w-8 h-16 bg-black/80 hover:bg-black border border-white/10 rounded-lg text-white text-xs opacity-0 group-hover/row:opacity-100 transition-opacity hidden sm:flex items-center justify-center shadow-xl">›</button>

      <div ref={ref}
        className="flex gap-3 sm:gap-4 overflow-x-auto pb-3 hide-scrollbar"
        onWheel={e => { if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) { e.preventDefault(); ref.current.scrollLeft += e.deltaY } }}
      >
        {isLoading
          ? Array(SKELETON_COUNT).fill(0).map((_, i) => (
            <div key={i} className="w-36 sm:w-44 md:w-48 shrink-0 animate-pulse">
              <div className="aspect-[2/3] bg-white/8 rounded-xl" />
              <div className="h-3 bg-white/8 rounded mt-2 mx-1" />
              <div className="h-2.5 bg-white/5 rounded mt-1 w-1/2 mx-1" />
            </div>
          ))
          : items.map((item, i) => (
            <MediaCard key={item.tmdbId || item.imdbID || i} item={item} showActions={showActions} />
          ))
        }
      </div>
    </div>
  )
}

export default MediaRow
