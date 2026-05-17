const KEY = '8265bd1679663a7ea12ac168da84d2e8'
const BASE = 'https://api.themoviedb.org/3'

// w342 posters (fast), w780 backdrop (orig bahut bada tha)
export const IMG = {
  w92:  'https://image.tmdb.org/t/p/w92',
  w185: 'https://image.tmdb.org/t/p/w185',
  w342: 'https://image.tmdb.org/t/p/w342',
  w500: 'https://image.tmdb.org/t/p/w500',
  w780: 'https://image.tmdb.org/t/p/w780',
  orig: 'https://image.tmdb.org/t/p/original',
}

// localStorage cache — reload pe bhi fast
const LS_PREFIX = 'ofx_api_'
const LS_TTL = 60 * 60 * 1000

function lsGet(key) {
  try {
    const raw = localStorage.getItem(LS_PREFIX + key)
    if (!raw) return null
    const { data, ts } = JSON.parse(raw)
    if (Date.now() - ts > LS_TTL) { localStorage.removeItem(LS_PREFIX + key); return null }
    return data
  } catch { return null }
}
function lsSet(key, data) {
  try { localStorage.setItem(LS_PREFIX + key, JSON.stringify({ data, ts: Date.now() })) } catch {}
}

const memCache = new Map()

async function tmdb(path, params = {}) {
  const url = `${BASE}${path}?api_key=${KEY}&language=en-US&${new URLSearchParams(params)}`
  const cacheKey = path + JSON.stringify(params)
  if (memCache.has(url)) return memCache.get(url)
  const cached = lsGet(cacheKey)
  if (cached) { memCache.set(url, cached); return cached }
  try {
    const r = await fetch(url)
    if (!r.ok) return null
    const d = await r.json()
    memCache.set(url, d)
    lsSet(cacheKey, d)
    return d
  } catch { return null }
}

export const fetchTrending = async (type = 'all', window = 'week') => {
  const d = await tmdb(`/trending/${type}/${window}`)
  return (d?.results || []).map(normalise)
}
export const fetchTrendingMovies = () => fetchTrending('movie')
export const fetchTrendingTV    = () => fetchTrending('tv')
export const fetchTrendingAnime = async () => {
  const d = await tmdb('/discover/tv', { with_genres: '16', with_origin_country: 'JP', sort_by: 'popularity.desc', page: 1 })
  return (d?.results || []).slice(0, 15).map(normalise)
}
export const fetchTopRatedMovies   = async () => { const d = await tmdb('/movie/top_rated');   return (d?.results || []).map(normalise) }
export const fetchNowPlayingMovies = async () => { const d = await tmdb('/movie/now_playing'); return (d?.results || []).map(normalise) }
export const fetchTopRatedTV       = async () => { const d = await tmdb('/tv/top_rated');      return (d?.results || []).map(normalise) }
export const fetchBollywood = async () => {
  const d = await tmdb('/discover/movie', { with_original_language: 'hi', sort_by: 'popularity.desc', page: 1 })
  return (d?.results || []).slice(0, 15).map(normalise)
}
export const fetchKDrama = async () => {
  const d = await tmdb('/discover/tv', { with_origin_country: 'KR', sort_by: 'popularity.desc', page: 1 })
  return (d?.results || []).slice(0, 15).map(normalise)
}

export const fetchDetails = async (id, type) => {
  return tmdb(`/${type}/${id}`, { append_to_response: 'videos,credits,similar,recommendations,external_ids,watch/providers' })
}

export const resolveByImdbId = async (imdbId) => {
  const d = await tmdb('/find/' + imdbId, { external_source: 'imdb_id' })
  const item = d?.movie_results?.[0] || d?.tv_results?.[0]
  return item ? { id: item.id, media_type: item.title ? 'movie' : 'tv' } : null
}

// FIX: ek hi API call se poster + backdrop dono milte hain
export const fetchPosterByImdb = async ({ imdbID, title }) => {
  if (imdbID) {
    const d = await tmdb('/find/' + imdbID, { external_source: 'imdb_id' })
    const item = d?.movie_results?.[0] || d?.tv_results?.[0]
    if (item) return {
      tmdbId:     item.id,
      media_type: item.title ? 'movie' : 'tv',
      poster:     item.poster_path   ? IMG.w342 + item.poster_path   : null,
      backdrop:   item.backdrop_path ? IMG.w780 + item.backdrop_path : null,
      rating:     item.vote_average?.toFixed(1),
      year:       (item.release_date || item.first_air_date || '').slice(0, 4),
    }
  }
  if (title) {
    const d = await tmdb('/search/multi', { query: title })
    const r = d?.results?.[0]
    if (r) return {
      tmdbId:     r.id,
      media_type: r.media_type,
      poster:     r.poster_path   ? IMG.w342 + r.poster_path   : null,
      backdrop:   r.backdrop_path ? IMG.w780 + r.backdrop_path : null,
      rating:     r.vote_average?.toFixed(1),
      year:       (r.release_date || r.first_air_date || '').slice(0, 4),
    }
  }
  return {}
}

// Batch fetch — sab items ek saath
export const fetchPostersInBatch = async (items, type = 'tv') => {
  const results = await Promise.allSettled(items.map(item => fetchPosterByImdb(item)))
  return items.map((item, i) => {
    const extra = results[i].status === 'fulfilled' ? results[i].value : {}
    return { ...item, ...extra, media_type: extra.media_type || type }
  })
}

export const fetchPerson  = async (id) => tmdb(`/person/${id}`, { append_to_response: 'movie_credits,tv_credits,images' })
export const searchPeople = async (q)  => { const d = await tmdb('/search/person', { query: q }); return d?.results || [] }

export const searchMulti = async (query, page = 1) => {
  const d = await tmdb('/search/multi', { query, page })
  return {
    results:    (d?.results || []).filter(r => ['movie','tv'].includes(r.media_type)).map(normalise),
    totalPages: d?.total_pages || 1,
  }
}

export const getProviders = (details, region = 'IN') => {
  const p = details?.['watch/providers']?.results
  return p?.[region] || p?.['US'] || null
}

export function normalise(r) {
  return {
    tmdbId:     r.id,
    imdbID:     r.imdb_id || null,
    title:      r.title || r.name || 'Unknown',
    poster:     r.poster_path   ? IMG.w342 + r.poster_path   : null,
    backdrop:   r.backdrop_path ? IMG.w780 + r.backdrop_path : null,
    media_type: r.media_type || (r.title ? 'movie' : 'tv'),
    rating:     r.vote_average?.toFixed(1),
    year:       (r.release_date || r.first_air_date || '').slice(0, 4),
    overview:   r.overview,
    genres:     r.genre_ids || [],
  }
}
