import { useCallback, useEffect, useState } from 'react'
import EmptyState from '../components/EmptyState'
import ErrorPage from '../components/ErrorPage'
import HeroSection from '../components/HeroSection'
import MediaRow from '../components/MediaRow'
import Navbar from '../components/Navbar'
import RetryButton from '../components/RetryButton'
import { AnimeMovie, AnimeTranding, IsekaiAnime } from '../data/animeData'
import { classifyTmdbError } from '../utils/apiError'
import { fetchPostersInBatch, fetchTrendingAnime } from '../utils/tmdb'

const AnimePage = () => {
  const [trending, setTrending]   = useState([])
  const [classic,  setClassic]    = useState([])
  const [isekai,   setIsekai]     = useState([])
  const [movies,   setMovies]     = useState([])
  const [loading,  setLoading]    = useState(true)
  const [error, setError] = useState(null)

  const loadAnime = useCallback(async () => {
    setLoading(true)
    setError(null)
    const settled = await Promise.allSettled([
      fetchTrendingAnime(),
      fetchPostersInBatch(AnimeTranding, 'tv'),
      fetchPostersInBatch(IsekaiAnime, 'tv'),
      fetchPostersInBatch(AnimeMovie, 'movie'),
    ])

    const values = settled.map(result => (result.status === 'fulfilled' ? result.value : []))
    setTrending(values[0].slice(0, 15))
    setClassic(values[1])
    setIsekai(values[2])
    setMovies(values[3])

    const hasAnyItems = values.some(items => items.length > 0)
    const firstFailure = settled.find(result => result.status === 'rejected')?.reason
    if (!hasAnyItems && firstFailure) setError(classifyTmdbError(firstFailure))
    setLoading(false)
  }, [])

  useEffect(() => {
    loadAnime()
  }, [loadAnime])

  const hasAnyItems = trending.length || classic.length || isekai.length || movies.length

  if (error && !hasAnyItems) {
    return (
      <div className="bg-[#0a0a0a] text-white min-h-screen">
        <Navbar />
        <div className="pt-[80px] md:pt-[88px] px-4 sm:px-8 lg:px-16 pb-20">
          <ErrorPage title={error.title} message={error.message} onRetry={loadAnime} />
        </div>
      </div>
    )
  }

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
        <HeroSection items={trending.filter(i => i.backdrop).slice(0, 6)} loading={loading} title="Anime Universe" subtitle="Trending anime, classics, isekai & movies" />
        <div className="relative -mt-16 z-20">
          {!loading && !hasAnyItems ? (
            <div className="px-4 sm:px-8 lg:px-16 pb-20">
              <EmptyState
                title="No movies found"
                description="TMDB returned no anime data right now. Try again shortly."
                action={<RetryButton onRetry={loadAnime} label="Retry" />}
              />
            </div>
          ) : sections.map(({ title, items, badge }) => (
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
