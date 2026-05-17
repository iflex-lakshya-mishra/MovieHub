export function classifyTmdbError(err) {
  // TMDB util may throw a structured error, but also handle unknown cases.
  const status = err?.status
  const code = err?.code

  if (code === 'TIMEOUT') return { title: 'Something went wrong', message: 'Server timeout. Please try again.' }
  if (status === 401 || status === 403) return { title: 'Unauthorized access', message: 'You are not allowed to access this resource.' }
  if (status === 404) return { title: 'Server unavailable', message: 'The requested resource was not found.' }
  if (status === 429) return { title: 'Server unavailable', message: 'Server rate limit exceeded. Please try again shortly.' }
  if (status >= 500) return { title: 'Server unavailable', message: 'Server unavailable. Please try later.' }

  // network failures
  if (code === 'NETWORK' || err?.name === 'TypeError') {
    return { title: 'Check your internet connection', message: 'Please check your internet connection and try again.' }
  }

  return { title: 'Something went wrong', message: err?.message || 'Something went wrong' }
}

