import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import MediaRow from '../components/MediaRow'
import { fetchDetails, resolveByImdbId, getProviders, normalise, IMG } from '../utils/tmdb'
import { useApp } from '../context/AppContext'

const Badge = ({ children, color = 'bg-white/10' }) => (
  <span className={`${color} px-3 py-1 rounded-full text-xs font-medium text-white border border-white/10`}>{children}</span>
)

const MediaDetail = () => {
  const { tmdbId, mediaType, imdbID } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const passedItem = location.state?.item

  const [details, setDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showTrailer, setShowTrailer] = useState(false)
  const [activeTab, setActiveTab] = useState('about')

  const { toggleFav, isFav, toggleWatchlist, inWatchlist, lists, addToList, user } = useApp()

  useEffect(() => {
    window.scrollTo(0, 0)
    const load = async () => {
      setLoading(true)
      let id = tmdbId, type = mediaType
      if (!id && (imdbID || passedItem?.imdbID)) {
        const found = await resolveByImdbId(imdbID || passedItem?.imdbID)
        if (found) { id = found.id; type = found.media_type }
      }
      if (!id || !type) { setLoading(false); return }
      const d = await fetchDetails(id, type)
      setDetails(d)
      setLoading(false)
    }
    load()
  }, [tmdbId, mediaType, imdbID])

  if (loading) return (
    <div className="bg-[#0a0a0a] min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white text-lg">Loading…</p>
      </div>
    </div>
  )

  if (!details) return (
    <div className="bg-[#0a0a0a] min-h-screen flex items-center justify-center text-white">
      <div className="text-center">
        <p className="text-2xl mb-4">😕 Not found</p>
        <button onClick={() => navigate(-1)} className="bg-red-600 hover:bg-red-500 text-white px-6 py-2.5 rounded-full font-semibold transition">← Go Back</button>
      </div>
    </div>
  )

  const title = details.title || details.name
  const year = (details.release_date || details.first_air_date || '').slice(0, 4)
  const type = details.title ? 'movie' : 'tv'
  const runtime = details.runtime
    ? `${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m`
    : details.episode_run_time?.[0] ? `~${details.episode_run_time[0]}min/ep` : ''
  const genres = details.genres?.map(g => g.name) || []
  const cast = details.credits?.cast?.slice(0, 12) || []
  const crew = details.credits?.crew?.filter(c => ['Director', 'Creator', 'Producer'].includes(c.job)).slice(0, 4) || []
  const videos = details.videos?.results || []
  const trailer = videos.find(v => v.type === 'Trailer' && v.site === 'YouTube') || videos.find(v => v.site === 'YouTube')
  const backdrop = details.backdrop_path ? IMG.orig + details.backdrop_path : ''
  const poster = details.poster_path ? IMG.w500 + details.poster_path : ''
  const providers = getProviders(details)
  const similar = [...(details.similar?.results || []), ...(details.recommendations?.results || [])]
    .filter(r => r.poster_path).slice(0, 15).map(normalise)
  const imdbLink = details.imdb_id ? `https://www.imdb.com/title/${details.imdb_id}/` : ''

  const thisItem = { tmdbId: details.id, title, poster: poster, media_type: type, year, rating: details.vote_average?.toFixed(1) }

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen">
      <Navbar />

      {/* Backdrop */}
      <div className="relative w-full h-[45vh] sm:h-[55vh] overflow-hidden pt-[60px] md:pt-[68px]">
        {backdrop && <img src={backdrop} alt={title} className="absolute inset-0 w-full h-full object-cover object-top" />}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-[#0a0a0a]/20" />
        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 sm:left-8 z-10 bg-black/50 backdrop-blur-sm hover:bg-black/80 border border-white/20 px-4 py-2 rounded-full text-sm font-semibold transition">
          ← Back
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 -mt-40 sm:-mt-52 relative z-10 pb-20">
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-10">
          {/* Poster */}
          {poster && (
            <div className="shrink-0 mx-auto sm:mx-0">
              <img src={poster} alt={title} className="w-36 sm:w-48 md:w-56 rounded-2xl shadow-2xl ring-2 ring-white/10" onError={e => e.currentTarget.style.display='none'} />
            </div>
          )}

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-2">{title}</h1>

            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-400 mb-4">
              {year && <span>{year}</span>}
              {runtime && <span>• {runtime}</span>}
              {type === 'tv' && details.number_of_seasons && <span>• {details.number_of_seasons} Season{details.number_of_seasons > 1 ? 's' : ''}</span>}
              {details.status && <span className="bg-green-800/40 text-green-300 border border-green-700/40 px-2 py-0.5 rounded-full text-xs">{details.status}</span>}
            </div>

            {details.vote_average > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <span className="text-yellow-400 text-2xl">★</span>
                <span className="text-2xl font-black">{details.vote_average?.toFixed(1)}</span>
                <span className="text-gray-500 text-sm">/10 · {details.vote_count?.toLocaleString()} votes</span>
              </div>
            )}

            <div className="flex flex-wrap gap-2 mb-5">
              {genres.map(g => <Badge key={g}>{g}</Badge>)}
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              {trailer && (
                <button onClick={() => setShowTrailer(true)} className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-full font-bold text-sm hover:bg-gray-200 transition">
                  ▶ Trailer
                </button>
              )}
              {imdbLink && (
                <a href={imdbLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-yellow-500 text-black px-5 py-2.5 rounded-full font-bold text-sm hover:bg-yellow-400 transition">
                  IMDb ↗
                </a>
              )}
              <button onClick={() => toggleFav(thisItem)}
                className={`px-5 py-2.5 rounded-full font-bold text-sm transition border ${isFav(thisItem) ? 'bg-red-600 border-red-600 text-white' : 'bg-white/10 border-white/20 text-white hover:bg-red-600/20'}`}>
                {isFav(thisItem) ? '❤️ Favorited' : '🤍 Favorite'}
              </button>
              <button onClick={() => toggleWatchlist(thisItem)}
                className={`px-5 py-2.5 rounded-full font-bold text-sm transition border ${inWatchlist(thisItem) ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white/10 border-white/20 text-white hover:bg-blue-600/20'}`}>
                {inWatchlist(thisItem) ? '🔖 In Watchlist' : '➕ Watchlist'}
              </button>

              {/* Add to list dropdown */}
              {user && lists.length > 0 && (
                <div className="relative group">
                  <button className="px-5 py-2.5 rounded-full font-bold text-sm bg-white/10 border border-white/20 text-white hover:bg-white/20 transition">
                    📋 Add to List ▾
                  </button>
                  <div className="absolute left-0 top-full mt-1 w-52 bg-gray-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-20 hidden group-hover:block">
                    {lists.map(l => (
                      <button key={l.id} onClick={() => addToList(l.id, thisItem)}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition flex items-center gap-2">
                        {l.isPublic ? '🌐' : '🔒'} {l.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-5 bg-white/5 rounded-xl p-1 w-fit">
              {['about', 'cast', 'watch'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-semibold capitalize transition ${activeTab === tab ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'}`}>
                  {tab === 'about' ? 'About' : tab === 'cast' ? 'Cast & Crew' : 'Where to Watch'}
                </button>
              ))}
            </div>

            {/* Tab content */}
            {activeTab === 'about' && (
              <div>
                {details.overview && <p className="text-gray-300 leading-relaxed max-w-2xl">{details.overview}</p>}
                {details.tagline && <p className="text-gray-500 italic mt-3">"{details.tagline}"</p>}
                {details.origin_country?.length > 0 && <p className="text-gray-400 text-sm mt-3">Country: {details.origin_country.join(', ')}</p>}
                {details.spoken_languages?.length > 0 && <p className="text-gray-400 text-sm mt-1">Languages: {details.spoken_languages.map(l => l.name).join(', ')}</p>}
                {crew.length > 0 && (
                  <div className="mt-4">
                    {crew.map(c => <p key={c.id + c.job} className="text-sm text-gray-400"><span className="text-white font-medium">{c.name}</span> — {c.job}</p>)}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'cast' && (
              <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
                {cast.map(actor => (
                  <button key={actor.id} onClick={() => navigate(`/person/${actor.id}`)}
                    className="shrink-0 w-20 text-center hover:opacity-80 transition group/actor">
                    <div className="w-16 h-16 mx-auto rounded-full overflow-hidden bg-white/10 mb-1.5 ring-2 ring-transparent group-hover/actor:ring-red-500 transition">
                      {actor.profile_path
                        ? <img src={`${IMG.w185}${actor.profile_path}`} alt={actor.name} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center text-2xl">👤</div>
                      }
                    </div>
                    <p className="text-xs font-semibold truncate text-white">{actor.name}</p>
                    <p className="text-[10px] text-gray-500 truncate">{actor.character}</p>
                  </button>
                ))}
              </div>
            )}

            {activeTab === 'watch' && (
              <div>
                {providers ? (
                  <>
                    {providers.flatrate?.length > 0 && (
                      <div className="mb-5">
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-3 font-bold">Streaming</p>
                        <div className="flex flex-wrap gap-3">
                          {providers.flatrate.map(p => (
                            <div key={p.provider_id} className="flex flex-col items-center gap-1">
                              <img src={`${IMG.w92}${p.logo_path}`} alt={p.provider_name} className="w-10 h-10 rounded-xl object-cover" />
                              <span className="text-[9px] text-gray-400 text-center w-14 truncate">{p.provider_name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {providers.rent?.length > 0 && (
                      <div className="mb-5">
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-3 font-bold">Rent</p>
                        <div className="flex flex-wrap gap-3">
                          {providers.rent.map(p => (
                            <div key={p.provider_id} className="flex flex-col items-center gap-1">
                              <img src={`${IMG.w92}${p.logo_path}`} alt={p.provider_name} className="w-10 h-10 rounded-xl object-cover" />
                              <span className="text-[9px] text-gray-400 text-center w-14 truncate">{p.provider_name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {providers.link && <a href={providers.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:text-blue-300 underline">View all on JustWatch ↗</a>}
                    {!providers.flatrate?.length && !providers.rent?.length && <p className="text-gray-500 text-sm">Not available for streaming in India yet.</p>}
                  </>
                ) : <p className="text-gray-500">No provider info available.</p>}
              </div>
            )}
          </div>
        </div>

        {/* Similar */}
        {similar.length > 0 && (
          <div className="mt-14">
            <h3 className="text-xl font-bold mb-4">🍿 You May Also Like</h3>
            <MediaRow items={similar} />
          </div>
        )}
      </div>

      {/* Trailer Modal */}
      {showTrailer && trailer && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" onClick={() => setShowTrailer(false)}>
          <div className="relative w-full max-w-4xl" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowTrailer(false)} className="absolute -top-10 right-0 text-white text-lg font-bold hover:text-gray-300">✕ Close</button>
            <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-2xl">
              <iframe src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`} title="Trailer" allow="autoplay; encrypted-media" allowFullScreen className="w-full h-full" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MediaDetail
