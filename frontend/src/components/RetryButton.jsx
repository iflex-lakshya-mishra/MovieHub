import React, { useState } from 'react'

const RetryButton = ({ onRetry, className = '', label = 'Retry', size = 'md', disabled = false }) => {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    if (disabled || loading) return
    try {
      setLoading(true)
      await onRetry?.()
    } finally {
      setLoading(false)
    }
  }

  const pad = size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-5 py-2.5 text-sm'

  return (
    <button
      onClick={handleClick}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-red-600 hover:bg-red-500 disabled:opacity-60 transition font-semibold shadow-lg shadow-red-900/20 ${pad} ${className}`}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-white/60 border-t-white rounded-full animate-spin" />
      ) : null}
      {label}
    </button>
  )
}

export default RetryButton

