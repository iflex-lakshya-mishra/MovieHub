import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useApp } from '../context/AppContext'

const AVATARS = [
  'https://api.dicebear.com/7.x/thumbs/svg?seed=otaku1',
  'https://api.dicebear.com/7.x/thumbs/svg?seed=ninja2',
  'https://api.dicebear.com/7.x/thumbs/svg?seed=anime3',
  'https://api.dicebear.com/7.x/thumbs/svg?seed=sakura4',
  'https://api.dicebear.com/7.x/thumbs/svg?seed=dragon5',
  'https://api.dicebear.com/7.x/thumbs/svg?seed=ramen6',
  'https://api.dicebear.com/7.x/thumbs/svg?seed=katana7',
  'https://api.dicebear.com/7.x/thumbs/svg?seed=mochi8',
]

const ProfilePage = () => {
  const { user, logout, updateAvatar, favorites, watchlist, lists } = useApp()
  const navigate = useNavigate()
  const [pickingAvatar, setPickingAvatar] = useState(false)

  if (!user) return (
    <div className="bg-[#0a0a0a] min-h-screen flex items-center justify-center text-white">
      <div className="text-center">
        <p className="text-xl mb-4">You're not logged in</p>
        <button onClick={() => navigate('/login')} className="bg-red-600 hover:bg-red-500 px-6 py-2.5 rounded-full font-semibold transition">Login</button>
      </div>
    </div>
  )

  const joined = new Date(user.joined).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

  const stats = [
    { label: 'Favorites', value: favorites.length, icon: '❤️', link: '/lists' },
    { label: 'Watchlist', value: watchlist.length, icon: '🔖', link: '/lists' },
    { label: 'Lists', value: lists.length, icon: '📋', link: '/lists' },
  ]

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen">
      <Navbar />
      <div className="pt-[80px] md:pt-[88px] max-w-2xl mx-auto px-4 sm:px-8 pb-20">

        {/* Profile card */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative">
              <img src={user.avatar} alt={user.username} className="w-24 h-24 rounded-full ring-2 ring-red-500 bg-gray-800" />
              <button onClick={() => setPickingAvatar(p => !p)}
                className="absolute -bottom-1 -right-1 w-7 h-7 bg-red-600 hover:bg-red-500 rounded-full text-xs flex items-center justify-center shadow-lg transition">
                ✏️
              </button>
            </div>
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-2xl font-black mb-1">{user.username}</h1>
              <p className="text-gray-400 text-sm">Joined {joined}</p>
            </div>
          </div>

          {/* Avatar picker */}
          {pickingAvatar && (
            <div className="mt-5 pt-5 border-t border-white/10">
              <p className="text-sm font-semibold text-gray-300 mb-3">Choose Avatar</p>
              <div className="flex gap-3 flex-wrap">
                {AVATARS.map(av => (
                  <button key={av} onClick={() => { updateAvatar(av); setPickingAvatar(false) }}
                    className={`w-12 h-12 rounded-full overflow-hidden transition-all ${user.avatar === av ? 'ring-2 ring-red-500 scale-110' : 'ring-1 ring-white/20 hover:ring-white/50'}`}>
                    <img src={av} alt="" className="w-full h-full" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {stats.map(s => (
            <button key={s.label} onClick={() => navigate(s.link)}
              className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center hover:bg-white/10 transition">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-2xl font-black">{s.value}</div>
              <div className="text-xs text-gray-400">{s.label}</div>
            </button>
          ))}
        </div>

        {/* Quick links */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden mb-6">
          {[
            { label: '❤️ My Favorites', to: '/lists' },
            { label: '🔖 My Watchlist', to: '/lists' },
            { label: '📋 My Lists', to: '/lists' },
          ].map(l => (
            <button key={l.to + l.label} onClick={() => navigate(l.to)}
              className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-white/5 transition border-b border-white/5 last:border-0 text-sm font-medium">
              {l.label}
              <span className="text-gray-500">›</span>
            </button>
          ))}
        </div>

        {/* Logout */}
        <button onClick={() => { logout(); navigate('/home') }}
          className="w-full py-3 rounded-2xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition font-semibold text-sm">
          🚪 Logout
        </button>
      </div>
    </div>
  )
}

export default ProfilePage
