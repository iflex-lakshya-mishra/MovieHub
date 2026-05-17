export function classifyTmdbError(err) {
  // TMDB util may throw a structured error, but also handle unknown cases.
  const status = err?.status
  const code = err?.code

  if (code === 'TIMEOUT') return { title: 'Server unavailable', message: 'TMDB timed out. Please retry.' }
  if (status === 401 || status === 403) return { title: 'Server unavailable', message: 'TMDB authentication failed. Check your API key.' }
  if (status === 404) return { title: 'No movies found', message: 'No results were returned for this request.' }
  if (status === 429) return { title: 'Server unavailable', message: 'Server rate limit exceeded. Please try again shortly.' }
  if (status >= 500) return { title: 'Server unavailable', message: 'Server unavailable. Please try later.' }

  // network failures
  if (code === 'NETWORK' || err?.name === 'TypeError') {
    return { title: 'Server unavailable', message: 'Please check your internet connection and try again.' }
  }

  return { title: 'Something went wrong', message: err?.message || 'Something went wrong' }
}

