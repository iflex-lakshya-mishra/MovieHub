import { useCallback, useEffect, useState } from 'react'
import EmptyState from '../components/EmptyState'
import ErrorPage from '../components/ErrorPage'
import HeroSection from '../components/HeroSection'
import MediaRow from '../components/MediaRow'
import Navbar from '../components/Navbar'
import RetryButton from '../components/RetryButton'
import { classifyTmdbError } from '../utils/apiError'
import { fetchKDrama, fetchPosterByImdb, fetchTopRatedTV, fetchTrendingTV } from '../utils/tmdb'

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
  const [error, setError] = useState(null)

  const loadSeries = useCallback(async () => {
    setLoading(true)
    setError(null)
    const settled = await Promise.allSettled([
      fetchTrendingTV(),
      fetchTopRatedTV(),
      fetchKDrama(),
      Promise.allSettled(internationalShows.map(async item => {
        const extra = await fetchPosterByImdb(item)
        return { ...item, ...extra, media_type: 'tv' }
      })).then(results => results.map(result => (result.status === 'fulfilled' ? result.value : null)).filter(Boolean)),
    ])

    const values = settled.map(result => (result.status === 'fulfilled' ? result.value : []))
    setTrending(values[0].slice(0, 15))
    setTopRated(values[1].slice(0, 15))
    setKdrama(values[2].slice(0, 15))
    setIntl(values[3])

    const hasAnyItems = values.some(items => items.length > 0)
    const firstFailure = settled.find(result => result.status === 'rejected')?.reason
    if (!hasAnyItems && firstFailure) setError(classifyTmdbError(firstFailure))
    setLoading(false)
  }, [])

  useEffect(() => {
    loadSeries()
  }, [loadSeries])

  const hasAnyItems = trending.length || topRated.length || kdrama.length || intl.length
  const sections = [
    { title: '🔥 Trending Series', items: trending, badge: { text: 'LIVE', color: 'bg-gradient-to-r from-cyan-500 to-blue-500' } },
    { title: '⭐ Top Rated', items: topRated },
    { title: '🇰🇷 K-Drama', items: kdrama, badge: { text: 'POPULAR', color: 'bg-gradient-to-r from-rose-500 to-pink-500' } },
    { title: '🌍 International Picks', items: intl, badge: { text: 'GLOBAL', color: 'bg-gradient-to-r from-indigo-500 to-violet-500' } },
  ]

  if (error && !hasAnyItems) {
    return (
      <div className="bg-[#0a0a0a] text-white min-h-screen">
        <Navbar />
        <div className="pt-[80px] md:pt-[88px] px-4 sm:px-8 lg:px-16 pb-20">
          <ErrorPage title={error.title} message={error.message} onRetry={loadSeries} />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen">
      <Navbar />
      <div className="pt-[60px] md:pt-[68px]">
        <HeroSection items={trending.filter(i => i.backdrop).slice(0,6)} loading={loading} title="Web Series" subtitle="Trending shows, K-Dramas, and global picks" />
        <div className="relative -mt-16 z-20">
          {!loading && !hasAnyItems ? (
            <div className="px-4 sm:px-8 lg:px-16 pb-20">
              <EmptyState
                title="No movies found"
                description="TMDB returned no series data right now. Try again shortly."
                action={<RetryButton onRetry={loadSeries} label="Retry" />}
              />
            </div>
          ) : (
            sections.map(({ title, items, badge }) => (
            <div key={title} className="px-4 sm:px-8 lg:px-16 pb-10">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xl sm:text-2xl font-bold">{title}</h2>
                {badge && <span className={`${badge.color} text-[10px] font-bold px-2 py-0.5 rounded-full text-white animate-pulse`}>{badge.text}</span>}
              </div>
              <MediaRow items={items} isLoading={loading} />
            </div>
          ))
          )}
        </div>
      </div>
    </div>
  )
}

export default WebSeriesPage
