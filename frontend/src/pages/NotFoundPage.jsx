import React from 'react'
import Navbar from '../components/Navbar'
import EmptyState from '../components/EmptyState'
import { Link } from 'react-router-dom'

const NotFoundPage = () => {
  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen">
      <Navbar />
      <div className="pt-[60px] md:pt-[68px]">
        <EmptyState
          icon="🧭"
          title="Page not found"
          description="The route you requested doesn’t exist."
          action={
            <Link
              to="/home"
              className="inline-flex items-center justify-center rounded-full bg-red-600 hover:bg-red-500 px-6 py-2.5 font-semibold transition"
            >
              Go Home
            </Link>
          }
        />
      </div>
    </div>
  )
}

export default NotFoundPage

