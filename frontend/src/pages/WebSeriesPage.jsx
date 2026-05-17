import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import MediaRow from '../components/MediaRow'
import HeroSection from '../components/HeroSection'
import { fetchTrendingTV, fetchTopRatedTV, fetchKDrama, fetchPosterByImdb } from '../utils/tmdb'

const internationalShows = [
  { imdbID: 'tt6468322', title: 'Money Heist' },
  { imdbID: 'tt5753856', title: 'Dark' },
  { imdbID: 'tt0903747', title: 'Breaking Bad' },
  { imdbID: 'tt0944947', title: 'Game of Thrones' },
  { imdbID: 'tt8111088', title: 'The Mandalorian' },
  { imdbID: 'tt1475582', title: 'Sherlock' },
  { imdbID: 'tt4574334', title: 'Stranger Things' },
  { imdbID: 'tt5180504', title: 'The Witcher' },
]

const WebSeriesPage = () => {
  const [trending, setTrending] = useState([])
  const [topRated, setTopRated] = useState([])
  const [kdrama, setKdrama] = useState([])
  const [intl, setIntl] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      fetchTrendingTV(),
      fetchTopRatedTV(),
      fetchKDrama(),
      Promise.all(internationalShows.map(async item => {
        const extra = await fetchPosterByImdb(item)
        return { ...item, ...extra, media_type: 'tv' }
      }))
    ]).then(([t, r, kd, il]) => {
      setTrending(t.slice(0,15)); setTopRated(r.slice(0,15))
      setKdrama(kd.slice(0,15)); setIntl(il)
      setLoading(false)
    })
  }, [])

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen">
      <Navbar />
      <div className="pt-[60px] md:pt-[68px]">
        <HeroSection items={trending.filter(i => i.backdrop).slice(0,6)} title="Web Series" subtitle="Trending shows, K-Dramas, and global picks" />
        <div className="relative -mt-16 z-20">
          {[
            { title: '🔥 Trending Series', items: trending, badge: { text: 'LIVE', color: 'bg-red-600' } },
            { title: '⭐ Top Rated', items: topRated },
            { title: '🇰🇷 K-Drama', items: kdrama },
            { title: '🌍 International Picks', items: intl },
          ].map(({ title, items, badge }) => (
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

export default WebSeriesPage
