const isProd = process.env.NODE_ENV === 'production'

export function logDev(message, payload) {
  if (isProd) return
  // eslint-disable-next-line no-console
  console.debug(message, payload)
}

export function logError(message, payload) {
  if (!isProd) {
    // eslint-disable-next-line no-console
    console.error(message, payload)
  } else {
    // eslint-disable-next-line no-console
    console.error(message)
  }
}

