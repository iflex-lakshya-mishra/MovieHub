import React from 'react'
import Navbar from '../components/Navbar'

const AboutPage = () => {
  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen">
      <Navbar />
      <div className="pt-[80px] md:pt-[88px] max-w-4xl mx-auto px-4 sm:px-8 pb-20">
        <h1 className="text-3xl sm:text-4xl font-black mb-4">About MovieHub</h1>
        <p className="text-gray-300 leading-relaxed">
          MovieHub is a lightweight streaming discovery UI that helps you browse trending anime,
          movies, and web series using TMDB data.
        </p>

        <div className="mt-8 grid sm:grid-cols-2 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <h2 className="font-bold mb-2">What you can do</h2>
            <ul className="text-sm text-gray-300 space-y-2">
              <li>Browse curated sections like Trending / Top Rated.</li>
              <li>Open details pages with trailer + streaming providers.</li>
              <li>Save items to Favorites / Watchlist.</li>
              <li>Create private or public lists.</li>
            </ul>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <h2 className="font-bold mb-2">Tech</h2>
            <ul className="text-sm text-gray-300 space-y-2">
              <li>React + React Router</li>
              <li>TailwindCSS styling</li>
              <li>TMDB API for media metadata</li>
              <li>Local storage for favorites/lists/watch progress</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          Note: This project uses public APIs and stores user state locally in your browser.
        </div>
      </div>
    </div>
  )
}

export default AboutPage

