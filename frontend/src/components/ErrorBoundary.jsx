import React from 'react'
import ErrorPage from './ErrorPage'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null, hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    // console-safe logging: keep dev details, hide prod noise
    const isProd = process.env.NODE_ENV === 'production'
    const safe = {
      name: error?.name,
      message: error?.message,
      stack: error?.stack,
      componentStack: info?.componentStack,
    }

    if (!isProd) {
      // eslint-disable-next-line no-console
      console.error('[ErrorBoundary] Caught render crash:', safe)
    } else {
      // eslint-disable-next-line no-console
      console.error('[ErrorBoundary] Render crash (prod)')
    }
  }

  render() {
    const { hasError, error } = this.state
    if (!hasError) return this.props.children

    const onRetry = async () => {
      // Auto refresh option for stability
      window.location.reload()
    }

    return (
      <ErrorPage
        title="Something went wrong"
        message="Try retrying. If the issue persists, refresh the page."
        details={error?.stack}
        onRetry={onRetry}
      />
    )
  }
}

export default ErrorBoundary

