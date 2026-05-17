import React from 'react'

const LoadingSpinner = ({ size = 40, className = '', label = 'Loading…' }) => {
  return (
    <div
      className={`flex items-center justify-center ${className}`}
      role="status"
      aria-live="polite"
    >
      <div
        className="rounded-full border-4 border-red-500 border-t-transparent animate-spin"
        style={{ width: size, height: size }}
      />
      {label ? (
        <span className="sr-only">{label}</span>
      ) : null}
    </div>
  )
}

export default LoadingSpinner

