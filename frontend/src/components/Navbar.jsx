import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { searchMulti } from '../utils/tmdb'
import { useApp } from '../context/AppContext'

const Navbar = () => {
  const [search, setSearch] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState(-1)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const wrapRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout, favorites, watchlist } = useApp()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const doSearch = useCallback(async (q) => {
    if (!q.trim()) { setResults([]); return }
    setLoading(true)
    const { results: r } = await searchMulti(q)
    setResults(r.slice(0, 7))
    setLoading(false)
  }, [])

  useEffect(() => {
    const t = setTimeout(() => doSearch(search), 380)
    return () => clearTimeout(t)
  }, [search, doSearch])

  useEffect(() => {
    const h = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) { setResults([]); setFocused(-1) } }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const handleSelect = (item) => {
    navigate(`/detail/${item.media_type}/${item.tmdbId}`, { state: { item } })
    setSearch(''); setResults([]); setFocused(-1)
  }

  const handleKey = (e) => {
    if (!results.length) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setFocused(p => Math.min(p + 1, results.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setFocused(p => Math.max(p - 1, 0)) }
    else if (e.key === 'Enter' && focused >= 0) { e.preventDefault(); handleSelect(results[focused]) }
    else if (e.key === 'Escape') { setResults([]); setFocused(-1) }
  }

  const navLinks = [
    { to: '/home', label: 'Home' },
    { to: '/movie', label: 'Movies' },
    { to: '/webseries', label: 'Series' },
    { to: '/anime', label: 'Anime' },
    { to: '/about', label: 'About' },
  ]

  return (
    <div ref={wrapRef} className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/95 backdrop-blur-md shadow-lg' : 'bg-gradient-to-b from-black/80 to-transparent'}`}>
      <nav className="flex items-center justify-between px-4 sm:px-8 lg:px-12 py-3 sm:py-4 max-w-screen-2xl mx-auto gap-4">
        {/* Logo */}
        <Link
          to="/home"
          className="shrink-0"
          aria-label="MovieHub"
        >
          <img
            src="/logo/logo.png"
            alt="MovieHub"
            className="w-auto object-contain transition-transform duration-200 ease-out hover:scale-[1.05] filter drop-shadow-[0_1px_0_rgba(0,0,0,0.6)]"
            style={{ height: '40px' }}
          />
          <style>{`
            @media (max-width: 767px) {
              /* Mobile navbar height: 32px */
              img[alt="MovieHub"] { height: 32px !important; }
            }
          `}</style>
        </Link>

        {/* Nav links - hidden on mobile */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(l => (
            <Link key={l.to} to={l.to}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${location.pathname === l.to ? 'bg-red-600 text-white' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right: Search + User */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search */}
          <div className="relative">
            <div className="relative flex items-center">
              <svg className="absolute left-3 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Search…"
                className="w-36 sm:w-52 lg:w-64 pl-9 pr-8 py-2 bg-white/10 border border-white/20 rounded-full text-sm text-white placeholder-gray-400 focus:outline-none focus:bg-white/15 focus:border-red-500/50 transition-all"
              />
              {loading && <div className="absolute right-3 w-3.5 h-3.5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />}
              {search && !loading && (
                <button onClick={() => { setSearch(''); setResults([]) }} className="absolute right-3 text-gray-400 hover:text-white">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              )}
            </div>

            {/* Dropdown */}
            {results.length > 0 && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-gray-900/98 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                {results.map((item, i) => (
                  <div key={item.tmdbId} onClick={() => handleSelect(item)} onMouseEnter={() => setFocused(i)}
                    className={`flex gap-3 p-2.5 cursor-pointer transition-colors ${i === focused ? 'bg-red-600/80' : 'hover:bg-white/8'}`}>
                    <div className="w-10 h-14 shrink-0 rounded-lg overflow-hidden bg-white/10">
                      {item.poster ? <img src={item.poster} alt={item.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-lg">🎬</div>}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <p className="text-sm font-semibold truncate text-white">{item.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-400">{item.year || '—'}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${item.media_type === 'movie' ? 'bg-blue-500/25 text-blue-300' : 'bg-purple-500/25 text-purple-300'}`}>
                          {item.media_type === 'movie' ? '🎬 Movie' : '📺 Series'}
                        </span>
                        {item.rating > 0 && <span className="text-[10px] text-yellow-400">★ {item.rating}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Watchlist icon */}
          <Link to="/lists" className="relative hidden sm:flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 transition">
            <span className="text-base">🔖</span>
            {watchlist.length > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold flex items-center justify-center text-white">{watchlist.length > 9 ? '9+' : watchlist.length}</span>}
          </Link>

          {/* User */}
          {user ? (
            <div className="relative">
              <button onClick={() => setMenuOpen(p => !p)} className="flex items-center gap-2 rounded-full hover:ring-2 hover:ring-red-500 transition">
                <img src={user.avatar} alt={user.username} className="w-8 h-8 rounded-full object-cover bg-gray-700" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-gray-900/98 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                  <div className="p-3 border-b border-white/10">
                    <p className="text-sm font-semibold text-white">{user.username}</p>
                    <p className="text-xs text-gray-400">{favorites.length} favorites · {watchlist.length} watchlist</p>
                  </div>
                  <div className="p-1">
                    {[
                      { to: '/profile', label: '👤 My Profile' },
                      { to: '/lists', label: '📋 My Lists' },
                      { to: '/favorites', label: '❤️ Favorites' },
                    ].map(l => (
                      <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)}
                        className="flex items-center px-3 py-2 rounded-xl text-sm text-gray-300 hover:bg-white/10 hover:text-white transition">
                        {l.label}
                      </Link>
                    ))}
                    <button onClick={() => { logout(); setMenuOpen(false) }}
                      className="w-full text-left px-3 py-2 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition">
                      🚪 Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold rounded-full transition">
              Login
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile nav */}
      <div className="flex md:hidden items-center justify-around px-4 pb-2 border-t border-white/5">
        {navLinks.map(l => (
          <Link key={l.to} to={l.to}
            className={`py-1 px-2 text-xs font-medium transition ${location.pathname === l.to ? 'text-red-400' : 'text-gray-400 hover:text-white'}`}>
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Navbar
