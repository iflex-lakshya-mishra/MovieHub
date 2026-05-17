import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import MediaRow from '../components/MediaRow'
import HeroSection from '../components/HeroSection'
import {
  fetchTrendingMovies, fetchTrendingTV, fetchTrendingAnime,
  fetchTopRatedMovies, fetchBollywood, fetchKDrama
} from '../utils/tmdb'

const Section = ({ title, badge, items, loading }) => (
  <div className="px-4 sm:px-8 lg:px-16 mt-2 pb-10">
    <div className="flex items-center gap-3 mb-4">
      <h2 className="text-xl sm:text-2xl font-bold text-white">{title}</h2>
      {badge && <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badge.color} text-white animate-pulse`}>{badge.text}</span>}
    </div>
    <MediaRow items={items} isLoading={loading} />
  </div>
)

const Home = () => {
  const [data, setData] = useState({ movies: [], tv: [], anime: [], topRated: [], bollywood: [], kdrama: [] })
  const [hero, setHero] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const [movies, tv, anime, topRated, bollywood, kdrama] = await Promise.all([
        fetchTrendingMovies(),
        fetchTrendingTV(),
        fetchTrendingAnime(),
        fetchTopRatedMovies(),
        fetchBollywood(),
        fetchKDrama(),
      ])
      setData({ movies: movies.slice(0,15), tv: tv.slice(0,15), anime: anime.slice(0,15), topRated: topRated.slice(0,15), bollywood: bollywood.slice(0,15), kdrama: kdrama.slice(0,15) })
      // Hero: mix of trending movies + tv with backdrops
      setHero([...movies, ...tv].filter(i => i.backdrop).slice(0, 8))
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen">
      <Navbar />
      <div className="pt-[60px] md:pt-[68px]">
        <HeroSection items={hero} title="MovieHub" subtitle="Watch trending anime, movies & web series" />

        <div className="relative -mt-16 z-20">
          <Section title="🔥 Trending Movies" badge={{ text: 'LIVE', color: 'bg-red-600' }} items={data.movies} loading={loading} />
          <Section title="📺 Trending Series" badge={{ text: 'LIVE', color: 'bg-red-600' }} items={data.tv} loading={loading} />
          <Section title="🌸 Trending Anime" badge={{ text: 'LIVE', color: 'bg-red-600' }} items={data.anime} loading={loading} />
          <Section title="⭐ Top Rated All Time" items={data.topRated} loading={loading} />
          <Section title="🇮🇳 Bollywood Hits" items={data.bollywood} loading={loading} />
          <Section title="🇰🇷 K-Drama" items={data.kdrama} loading={loading} />
        </div>
      </div>
    </div>
  )
}

export default Home
