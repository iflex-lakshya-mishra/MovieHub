import { useCallback, useEffect, useState } from 'react'
import EmptyState from '../components/EmptyState'
import ErrorPage from '../components/ErrorPage'
import HeroSection from '../components/HeroSection'
import MediaRow from '../components/MediaRow'
import Navbar from '../components/Navbar'
import RetryButton from '../components/RetryButton'
import { classifyTmdbError } from '../utils/apiError'
import {
    fetchClassicAnimeKitsu, fetchPopularAnimeKitsu,
    fetchTrendingAnimeKitsu
} from '../utils/kitsu'
import {
    fetchBollywood, fetchKDrama,
    fetchTopRatedMovies,
    fetchTrendingMovies, fetchTrendingTV
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
  const [data, setData] = useState({ trendingAnime: [], classicAnime: [], popularAnime: [], movies: [], tv: [], topRated: [], bollywood: [], kdrama: [] })
  const [hero, setHero] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    // Anime first from Kitsu, then TMDB for movies/series
    const settled = await Promise.allSettled([
      fetchTrendingAnimeKitsu(),
      fetchClassicAnimeKitsu(),
      fetchPopularAnimeKitsu(),
      fetchTrendingMovies(),
      fetchTrendingTV(),
      fetchTopRatedMovies(),
      fetchBollywood(),
      fetchKDrama(),
    ])

    const values = settled.map(result => (result.status === 'fulfilled' ? result.value : []))
    const nextData = {
      trendingAnime: values[0].slice(0, 15),
      classicAnime: values[1].slice(0, 15),
      popularAnime: values[2].slice(0, 15),
      movies: values[3].slice(0, 15),
      tv: values[4].slice(0, 15),
      topRated: values[5].slice(0, 15),
      bollywood: values[6].slice(0, 15),
      kdrama: values[7].slice(0, 15),
    }

    setData(nextData)
    // Hero from anime first, then movies
    setHero([...nextData.trendingAnime, ...nextData.movies, ...nextData.tv].filter(i => i.backdrop).slice(0, 8))

    const hasAnyItems = Object.values(nextData).some(items => items.length > 0)
    const firstFailure = settled.find(result => result.status === 'rejected')?.reason
    if (!hasAnyItems && firstFailure) setError(classifyTmdbError(firstFailure))
    setLoading(false)
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const hasAnyItems = Object.values(data).some(items => items.length > 0)

  if (error && !hasAnyItems) {
    return (
      <div className="bg-[#0a0a0a] text-white min-h-screen">
        <Navbar />
        <div className="pt-[80px] md:pt-[88px] px-4 sm:px-8 lg:px-16 pb-20">
          <ErrorPage title={error.title} message={error.message} onRetry={loadData} />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen">
      <Navbar />
      <div className="pt-[60px] md:pt-[68px]">
        <HeroSection items={hero} loading={loading} title="MovieHub" subtitle="Watch trending anime, movies & web series" />

        <div className="relative -mt-16 z-20">
          {!loading && !hasAnyItems ? (
            <div className="px-4 sm:px-8 lg:px-16 pb-20">
              <EmptyState
                title="No movies found"
                description="TMDB returned no content right now. Try again in a moment."
                action={<RetryButton onRetry={loadData} label="Retry" />}
              />
            </div>
          ) : (
            <>
              <Section title="🎌 Trending Anime" badge={{ text: 'LIVE', color: 'bg-gradient-to-r from-violet-500 to-purple-500' }} items={data.trendingAnime} loading={loading} />
              <Section title="🌸 Anime Classics" badge={{ text: 'BEST', color: 'bg-gradient-to-r from-cyan-500 to-blue-500' }} items={data.classicAnime} loading={loading} />
              <Section title="📺 Popular Anime" badge={{ text: 'HOT', color: 'bg-gradient-to-r from-indigo-500 to-violet-500' }} items={data.popularAnime} loading={loading} />
              <Section title="🔥 Trending Movies" badge={{ text: 'LIVE', color: 'bg-gradient-to-r from-emerald-500 to-teal-500' }} items={data.movies} loading={loading} />
              <Section title="📺 Trending Series" badge={{ text: 'LIVE', color: 'bg-gradient-to-r from-amber-500 to-orange-500' }} items={data.tv} loading={loading} />
              <Section title="⭐ Top Rated All Time" badge={{ text: 'CLASSIC', color: 'bg-gradient-to-r from-yellow-500 to-amber-500' }} items={data.topRated} loading={loading} />
              <Section title="🇮🇳 Bollywood Hits" badge={{ text: 'TRENDING', color: 'bg-gradient-to-r from-pink-500 to-rose-500' }} items={data.bollywood} loading={loading} />
              <Section title="🇰🇷 K-Drama" badge={{ text: 'POPULAR', color: 'bg-gradient-to-r from-rose-500 to-pink-500' }} items={data.kdrama} loading={loading} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home
