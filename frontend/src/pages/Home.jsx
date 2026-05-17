import { useCallback, useEffect, useState } from 'react'
import EmptyState from '../components/EmptyState'
import ErrorPage from '../components/ErrorPage'
import HeroSection from '../components/HeroSection'
import MediaRow from '../components/MediaRow'
import Navbar from '../components/Navbar'
import RetryButton from '../components/RetryButton'
import { classifyTmdbError } from '../utils/apiError'
import {
    fetchBollywood, fetchKDrama,
    fetchTopRatedMovies,
    fetchTrendingAnime,
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
  const [data, setData] = useState({ movies: [], tv: [], anime: [], topRated: [], bollywood: [], kdrama: [] })
  const [hero, setHero] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    const settled = await Promise.allSettled([
      fetchTrendingMovies(),
      fetchTrendingTV(),
      fetchTrendingAnime(),
      fetchTopRatedMovies(),
      fetchBollywood(),
      fetchKDrama(),
    ])

    const values = settled.map(result => (result.status === 'fulfilled' ? result.value : []))
    const nextData = {
      movies: values[0].slice(0, 15),
      tv: values[1].slice(0, 15),
      anime: values[2].slice(0, 15),
      topRated: values[3].slice(0, 15),
      bollywood: values[4].slice(0, 15),
      kdrama: values[5].slice(0, 15),
    }

    setData(nextData)
    setHero([...nextData.movies, ...nextData.tv].filter(i => i.backdrop).slice(0, 8))

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
              <Section title="🔥 Trending Movies" badge={{ text: 'LIVE', color: 'bg-red-600' }} items={data.movies} loading={loading} />
              <Section title="📺 Trending Series" badge={{ text: 'LIVE', color: 'bg-red-600' }} items={data.tv} loading={loading} />
              <Section title="🌸 Trending Anime" badge={{ text: 'LIVE', color: 'bg-red-600' }} items={data.anime} loading={loading} />
              <Section title="⭐ Top Rated All Time" items={data.topRated} loading={loading} />
              <Section title="🇮🇳 Bollywood Hits" items={data.bollywood} loading={loading} />
              <Section title="🇰🇷 K-Drama" items={data.kdrama} loading={loading} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home
