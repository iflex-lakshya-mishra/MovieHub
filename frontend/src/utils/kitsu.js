const KITSU_BASE = 'https://kitsu.io/api/edge'
const TIMEOUT_MS = 12000

const memCache = new Map()

function createKitsuError(code, status, message, cause) {
  const err = new Error(message)
  err.code = code
  err.status = status
  if (cause) err.cause = cause
  return err
}

async function kitsuFetch(path, params = {}) {
  const query = new URLSearchParams(params).toString()
  const url = `${KITSU_BASE}${path}${query ? '?' + query : ''}`
  
  if (memCache.has(url)) return memCache.get(url)

  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const r = await fetch(url, { signal: controller.signal })
    if (!r.ok) {
      if (r.status === 401 || r.status === 403) throw createKitsuError('AUTH', r.status, 'Kitsu authentication failed.')
      if (r.status === 404) throw createKitsuError('NOT_FOUND', r.status, 'Kitsu resource not found.')
      if (r.status === 429) throw createKitsuError('RATE_LIMIT', r.status, 'Kitsu rate limit exceeded.')
      throw createKitsuError('HTTP', r.status, `Kitsu request failed with status ${r.status}.`)
    }
    const d = await r.json()
    memCache.set(url, d)
    return d
  } catch (err) {
    if (err?.name === 'AbortError') throw createKitsuError('TIMEOUT', 0, 'Kitsu request timed out.')
    if (err?.code) throw err
    throw createKitsuError('NETWORK', 0, 'Kitsu request failed. Check your connection.', err)
  } finally {
    window.clearTimeout(timeoutId)
  }
}

function normalizeKitsuAnime(anime) {
  if (!anime?.attributes) return null
  const attr = anime.attributes
  
  // Extract poster URL - Kitsu returns poster as an object with url property
  const posterUrl = attr.posterImage?.original || attr.posterImage?.medium || attr.posterImage?.url || ''
  const backdropUrl = attr.coverImage?.original || attr.coverImage?.url || posterUrl || ''
  
  // Ensure URLs are absolute and properly formatted
  const cleanPoster = posterUrl ? (posterUrl.startsWith('http') ? posterUrl : `https:${posterUrl}`) : ''
  const cleanBackdrop = backdropUrl ? (backdropUrl.startsWith('http') ? backdropUrl : `https:${backdropUrl}`) : cleanPoster
  
  return {
    id: anime.id,
    tmdbId: anime.id,
    title: attr.titles?.en || attr.canonicalTitle || 'Unknown',
    poster: cleanPoster,
    backdrop: cleanBackdrop,
    description: attr.synopsis || '',
    rating: attr.averageRating ? parseFloat(attr.averageRating) / 10 : null,
    mediaType: 'tv',
    genre: (attr.genres || []).join(', '),
  }
}

// Kitsu trending anime with better filtering
export const fetchTrendingAnimeKitsu = async () => {
  try {
    const data = await kitsuFetch('/anime', {
      'page[limit]': 25,
      'filter[status]': 'current,finished',
      'sort': '-userCount',
      'include': 'genres',
      'fields[anime]': 'canonicalTitle,titles,synopsis,posterImage,coverImage,averageRating,genres,youtubeVideoId',
    })
    return (data?.data || [])
      .map(normalizeKitsuAnime)
      .filter(a => a?.poster && a?.title)
      .slice(0, 15)
  } catch (err) {
    throw err
  }
}

// Classic anime all time
export const fetchClassicAnimeKitsu = async () => {
  try {
    const data = await kitsuFetch('/anime', {
      'page[limit]': 25,
      'filter[status]': 'finished',
      'sort': '-averageRating',
      'fields[anime]': 'canonicalTitle,titles,synopsis,posterImage,coverImage,averageRating,genres',
    })
    return (data?.data || [])
      .map(normalizeKitsuAnime)
      .filter(a => a?.poster && a?.title)
      .slice(0, 15)
  } catch (err) {
    throw err
  }
}

// Popular anime now
export const fetchPopularAnimeKitsu = async () => {
  try {
    const data = await kitsuFetch('/anime', {
      'page[limit]': 25,
      'filter[status]': 'current',
      'sort': '-userCount',
      'fields[anime]': 'canonicalTitle,titles,synopsis,posterImage,coverImage,averageRating,genres',
    })
    return (data?.data || [])
      .map(normalizeKitsuAnime)
      .filter(a => a?.poster && a?.title)
      .slice(0, 15)
  } catch (err) {
    throw err
  }
}
