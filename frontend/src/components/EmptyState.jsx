import React from 'react'

const EmptyState = ({
  title = 'No movies found',
  description = 'Try changing your search or filters.',
  icon = '🍿',
  action,
  className = '',
}) => {
  return (
    <div className={`w-full py-16 text-center ${className}`}> 
      <div className="text-5xl mb-4">{icon}</div>
      <h2 className="text-lg sm:text-xl font-bold text-white/90">{title}</h2>
      <p className="text-sm text-gray-400 mt-2 max-w-xl mx-auto">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  )
}

export default EmptyState

