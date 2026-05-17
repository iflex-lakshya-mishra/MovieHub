import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import MediaRow from '../components/MediaRow'
import HeroSection from '../components/HeroSection'
import { fetchTrendingAnime, fetchPostersInBatch } from '../utils/tmdb'
import { AnimeTranding, IsekaiAnime, AnimeMovie } from '../data/animeData'

const AnimePage = () => {
  const [trending, setTrending]   = useState([])
  const [classic,  setClassic]    = useState([])
  const [isekai,   setIsekai]     = useState([])
  const [movies,   setMovies]     = useState([])
  const [loading,  setLoading]    = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      fetchTrendingAnime(),
      // batch fetch — sab ek saath, ek ek nahi
      fetchPostersInBatch(AnimeTranding, 'tv'),
      fetchPostersInBatch(IsekaiAnime,   'tv'),
      fetchPostersInBatch(AnimeMovie,    'movie'),
    ]).then(([t, cl, isk, mov]) => {
      setTrending(t.slice(0, 15))
      setClassic(cl)
      setIsekai(isk)
      setMovies(mov)
      setLoading(false)
    })
  }, [])

  const sections = [
    { title: '🔥 Trending Anime', items: trending, badge: { text: 'LIVE', color: 'bg-red-600' } },
    { title: '🏆 All Time Classics', items: classic },
    { title: '⚔️ Isekai & Fantasy', items: isekai },
    { title: '🎥 Anime Movies', items: movies },
  ]

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen">
      <Navbar />
      <div className="pt-[60px] md:pt-[68px]">
        <HeroSection items={trending.filter(i => i.backdrop).slice(0, 6)} title="Anime Universe" subtitle="Trending anime, classics, isekai & movies" />
        <div className="relative -mt-16 z-20">
          {sections.map(({ title, items, badge }) => (
            <div key={title} className="px-4 sm:px-8 lg:px-16 pb-10">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xl sm:text-2xl font-bold">{title}</h2>
                {badge && <span className={`${badge.color} text-[10px] font-bold px-2 py-0.5 rounded-full text-white animate-pulse`}>{badge.text}</span>}
              </div>
              <MediaRow items={items} isLoading={loading} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AnimePage
