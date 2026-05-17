import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ErrorPage from '../components/ErrorPage'
import LoadingSpinner from '../components/LoadingSpinner'
import MediaRow from '../components/MediaRow'
import Navbar from '../components/Navbar'
import { classifyTmdbError } from '../utils/apiError'
import { fetchPerson, IMG, normalise } from '../utils/tmdb'

const PersonPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [person, setPerson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showFull, setShowFull] = useState(false)

  const loadPerson = useCallback(async () => {
    window.scrollTo(0, 0)
    setLoading(true)
    setError(null)
    setPerson(null)
    try {
      const d = await fetchPerson(id)
      setPerson(d)
    } catch (err) {
      setError(classifyTmdbError(err))
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    loadPerson()
  }, [loadPerson])

  if (loading) return (
    <div className="bg-[#0a0a0a] min-h-screen flex items-center justify-center">
      <LoadingSpinner size={48} label="Loading..." />
    </div>
  )
  if (error) return <ErrorPage title={error.title} message={error.message} onRetry={loadPerson} />
  if (!person) return (
    <div className="bg-[#0a0a0a] min-h-screen flex items-center justify-center text-white">
      <div className="text-center"><p className="text-xl mb-4">Person not found</p>
        <button onClick={() => navigate(-1)} className="bg-red-600 px-5 py-2 rounded-full font-semibold">← Back</button>
      </div>
    </div>
  )

  const movies = (person.movie_credits?.cast || []).filter(m => m.poster_path).sort((a,b) => (b.vote_count||0)-(a.vote_count||0)).slice(0, 15).map(m => normalise({ ...m, media_type: 'movie' }))
  const shows = (person.tv_credits?.cast || []).filter(m => m.poster_path).sort((a,b) => (b.vote_count||0)-(a.vote_count||0)).slice(0, 15).map(m => normalise({ ...m, media_type: 'tv' }))
  const bio = person.biography || 'No biography available.'
  const age = person.birthday ? Math.floor((Date.now() - new Date(person.birthday)) / 31557600000) : null

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen">
      <Navbar />
      <div className="pt-[80px] md:pt-[88px] max-w-6xl mx-auto px-4 sm:px-8 pb-20">
        <button onClick={() => navigate(-1)} className="mb-6 text-sm text-gray-400 hover:text-white transition flex items-center gap-1">
          ← Back
        </button>

        {/* Profile section */}
        <div className="flex flex-col sm:flex-row gap-8 mb-10">
          <div className="shrink-0 mx-auto sm:mx-0">
            {person.profile_path
              ? <img src={`${IMG.w500}${person.profile_path}`} alt={person.name} className="w-40 sm:w-52 rounded-2xl shadow-2xl ring-2 ring-white/10" />
              : <div className="w-40 sm:w-52 aspect-[2/3] bg-gray-800 rounded-2xl flex items-center justify-center text-6xl">👤</div>
            }
          </div>

          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl font-black mb-2">{person.name}</h1>

            <div className="flex flex-wrap gap-3 mb-4 text-sm text-gray-400">
              {person.known_for_department && <span className="bg-white/10 px-3 py-1 rounded-full">{person.known_for_department}</span>}
              {person.place_of_birth && <span>📍 {person.place_of_birth}</span>}
              {person.birthday && <span>🎂 {person.birthday}{age ? ` (Age ${age})` : ''}</span>}
              {person.deathday && <span>✝️ {person.deathday}</span>}
            </div>

            <div className="max-w-2xl">
              <p className={`text-gray-300 text-sm leading-relaxed ${!showFull && bio.length > 400 ? 'line-clamp-4' : ''}`}>{bio}</p>
              {bio.length > 400 && (
                <button onClick={() => setShowFull(p => !p)} className="text-red-400 hover:text-red-300 text-xs mt-2 transition">
                  {showFull ? 'Show less ↑' : 'Read more ↓'}
                </button>
              )}
            </div>

            {/* External links */}
            <div className="flex gap-3 mt-4">
              {person.imdb_id && (
                <a href={`https://www.imdb.com/name/${person.imdb_id}`} target="_blank" rel="noopener noreferrer"
                  className="bg-yellow-500 text-black text-xs font-bold px-3 py-1.5 rounded-full hover:bg-yellow-400 transition">
                  IMDb ↗
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Known for images */}
        {person.images?.profiles?.length > 0 && (
          <div className="mb-10">
            <h3 className="text-lg font-bold mb-3">📸 Photos</h3>
            <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
              {person.images.profiles.slice(0, 12).map((img, i) => (
                <img key={i} src={`${IMG.w185}${img.file_path}`} alt={person.name}
                  className="h-32 sm:h-40 w-auto rounded-xl object-cover shrink-0 ring-1 ring-white/10 hover:ring-red-500 transition cursor-pointer" />
              ))}
            </div>
          </div>
        )}

        {movies.length > 0 && (
          <div className="mb-10">
            <h3 className="text-xl font-bold mb-4">🎬 Movies</h3>
            <MediaRow items={movies} />
          </div>
        )}
        {shows.length > 0 && (
          <div className="mb-10">
            <h3 className="text-xl font-bold mb-4">📺 TV Shows</h3>
            <MediaRow items={shows} />
          </div>
        )}
      </div>
    </div>
  )
}

export default PersonPage
