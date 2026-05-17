// Movie Page
import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import MediaRow from '../components/MediaRow'
import HeroSection from '../components/HeroSection'
import { fetchTrendingMovies, fetchTopRatedMovies, fetchNowPlayingMovies, fetchBollywood } from '../utils/tmdb'

export const MoviePage = () => {
  const [trending, setTrending] = useState([])
  const [topRated, setTopRated] = useState([])
  const [nowPlaying, setNowPlaying] = useState([])
  const [bollywood, setBollywood] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([fetchTrendingMovies(), fetchTopRatedMovies(), fetchNowPlayingMovies(), fetchBollywood()])
      .then(([t, r, n, b]) => {
        setTrending(t.slice(0,15)); setTopRated(r.slice(0,15))
        setNowPlaying(n.slice(0,15)); setBollywood(b.slice(0,15))
        setLoading(false)
      })
  }, [])

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen">
      <Navbar />
      <div className="pt-[60px] md:pt-[68px]">
        <HeroSection items={trending.filter(i => i.backdrop).slice(0,6)} title="Movie World" subtitle="Trending, top-rated and blockbuster movies" />
        <div className="relative -mt-16 z-20">
          <div className="px-4 sm:px-8 lg:px-16 pb-10">
            <div className="flex items-center gap-3 mb-4"><h2 className="text-xl sm:text-2xl font-bold">🔥 Trending Now</h2><span className="bg-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full text-white animate-pulse">LIVE</span></div>
            <MediaRow items={trending} isLoading={loading} />
          </div>
          <div className="px-4 sm:px-8 lg:px-16 pb-10">
            <div className="flex items-center gap-3 mb-4"><h2 className="text-xl sm:text-2xl font-bold">🎬 Now in Theaters</h2><span className="bg-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full text-white">IN THEATERS</span></div>
            <MediaRow items={nowPlaying} isLoading={loading} />
          </div>
          <div className="px-4 sm:px-8 lg:px-16 pb-10">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">⭐ Top Rated</h2>
            <MediaRow items={topRated} isLoading={loading} />
          </div>
          <div className="px-4 sm:px-8 lg:px-16 pb-16">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">🇮🇳 Bollywood</h2>
            <MediaRow items={bollywood} isLoading={loading} />
          </div>
        </div>
      </div>
    </div>
  )
}
