import LoadingSpinner from './LoadingSpinner'
import RetryButton from './RetryButton'

const ErrorPage = ({
  title = 'Something went wrong',
  message = null,
  details = null,
  onRetry,
  loading = false,
}) => {
  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 sm:p-8 shadow-2xl">
        <div className="mb-4">
          <div className="text-4xl mb-2">⚠️</div>
          <h1 className="text-2xl font-black">{title}</h1>
        </div>

        {message ? (
          <p className="text-sm text-gray-300 leading-relaxed">{message}</p>
        ) : (
          <p className="text-sm text-gray-300 leading-relaxed">
            Something went wrong.
          </p>
        )}

        {details ? (
          <pre className="mt-4 text-xs text-gray-500 whitespace-pre-wrap break-words bg-black/20 border border-white/5 rounded-xl p-3">
            {details}
          </pre>
        ) : null}

        <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:items-center">
          {loading ? <LoadingSpinner /> : <RetryButton onRetry={onRetry} />}
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center rounded-full px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 text-sm font-semibold transition"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  )
}

export default ErrorPage

