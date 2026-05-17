import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'

import Home           from './pages/Home'
import { MoviePage }  from './pages/MoviePage'
import AnimePage      from './pages/AnimePage'
import WebSeriesPage  from './pages/WebSeriesPage'
import MediaDetail    from './pages/MediaDetail'
import PersonPage     from './pages/PersonPage'
import LoginPage      from './pages/LoginPage'
import ListsPage      from './pages/ListsPage'
import ProfilePage    from './pages/ProfilePage'
import AboutPage      from './pages/AboutPage'
import FavoritesPage  from './pages/FavoritesPage'

function ProtectedRoute({ children }) {
  const { user, authLoading } = useApp()
  if (authLoading) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
  if (!user) return <Navigate to="/login" replace />
  return children
}

const App = () => (
  <AppProvider>
    <Routes>
      <Route path="/"            element={<Navigate to="/home" replace />} />
      <Route path="/home"        element={<Home />} />
      <Route path="/movie"       element={<MoviePage />} />
      <Route path="/anime"       element={<AnimePage />} />
      <Route path="/webseries"   element={<WebSeriesPage />} />
      <Route path="/detail/:mediaType/:tmdbId" element={<MediaDetail />} />
      <Route path="/detail/resolve/:imdbID"    element={<MediaDetail />} />
      <Route path="/person/:id"  element={<PersonPage />} />
      <Route path="/about"       element={<AboutPage />} />
      <Route path="/login"       element={<LoginPage />} />
      {/* Protected routes — login required */}
      <Route path="/lists"       element={<ProtectedRoute><ListsPage /></ProtectedRoute>} />
      <Route path="/favorites"   element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
      <Route path="/profile"     element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
    </Routes>
  </AppProvider>
)

export default App
