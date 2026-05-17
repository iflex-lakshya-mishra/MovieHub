// Movie Page
import { useCallback, useEffect, useState } from 'react'
import EmptyState from '../components/EmptyState'
import ErrorPage from '../components/ErrorPage'
import HeroSection from '../components/HeroSection'
import MediaRow from '../components/MediaRow'
import Navbar from '../components/Navbar'
import RetryButton from '../components/RetryButton'
import { classifyTmdbError } from '../utils/apiError'
import { fetchBollywood, fetchNowPlayingMovies, fetchTopRatedMovies, fetchTrendingMovies } from '../utils/tmdb'

export const MoviePage = () => {
  const [trending, setTrending] = useState([])
  const [topRated, setTopRated] = useState([])
  const [nowPlaying, setNowPlaying] = useState([])
  const [bollywood, setBollywood] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadMovies = useCallback(async () => {
    setLoading(true)
    setError(null)
    const settled = await Promise.allSettled([
      fetchTrendingMovies(),
      fetchTopRatedMovies(),
      fetchNowPlayingMovies(),
      fetchBollywood(),
    ])

    const values = settled.map(result => (result.status === 'fulfilled' ? result.value : []))
    setTrending(values[0].slice(0, 15))
    setTopRated(values[1].slice(0, 15))
    setNowPlaying(values[2].slice(0, 15))
    setBollywood(values[3].slice(0, 15))

    const hasAnyItems = values.some(items => items.length > 0)
    const firstFailure = settled.find(result => result.status === 'rejected')?.reason
    if (!hasAnyItems && firstFailure) setError(classifyTmdbError(firstFailure))
    setLoading(false)
  }, [])

  useEffect(() => {
    loadMovies()
  }, [loadMovies])

  const hasAnyItems = trending.length || topRated.length || nowPlaying.length || bollywood.length

  if (error && !hasAnyItems) {
    return (
      <div className="bg-[#0a0a0a] text-white min-h-screen">
        <Navbar />
        <div className="pt-[80px] md:pt-[88px] px-4 sm:px-8 lg:px-16 pb-20">
          <ErrorPage title={error.title} message={error.message} onRetry={loadMovies} />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen">
      <Navbar />
      <div className="pt-[60px] md:pt-[68px]">
        <HeroSection items={trending.filter(i => i.backdrop).slice(0,6)} loading={loading} title="Movie World" subtitle="Trending, top-rated and blockbuster movies" />
        <div className="relative -mt-16 z-20">
          {!loading && !hasAnyItems ? (
            <div className="px-4 sm:px-8 lg:px-16 pb-20">
              <EmptyState
                title="No movies found"
                description="TMDB returned no movie data right now. Try again shortly."
                action={<RetryButton onRetry={loadMovies} label="Retry" />}
              />
            </div>
          ) : (
            <>
              <div className="px-4 sm:px-8 lg:px-16 pb-10">
                <div className="flex items-center gap-3 mb-4"><h2 className="text-xl sm:text-2xl font-bold">🔥 Trending Now</h2><span className="bg-gradient-to-r from-emerald-500 to-teal-500 text-[10px] font-bold px-2 py-0.5 rounded-full text-white animate-pulse">LIVE</span></div>
                <MediaRow items={trending} isLoading={loading} />
              </div>
              <div className="px-4 sm:px-8 lg:px-16 pb-10">
                <div className="flex items-center gap-3 mb-4"><h2 className="text-xl sm:text-2xl font-bold">🎬 Now in Theaters</h2><span className="bg-gradient-to-r from-amber-500 to-orange-500 text-[10px] font-bold px-2 py-0.5 rounded-full text-white">IN THEATERS</span></div>
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
            </>
          )}
        </div>
      </div>
    </div>
  )
}
