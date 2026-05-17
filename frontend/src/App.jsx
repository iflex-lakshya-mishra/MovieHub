import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import LoadingSpinner from './components/LoadingSpinner'
import { AppProvider, useApp } from './context/AppContext'

const AboutPage = lazy(() => import('./pages/AboutPage'))
const AnimePage = lazy(() => import('./pages/AnimePage'))
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'))
const Home = lazy(() => import('./pages/Home'))
const ListsPage = lazy(() => import('./pages/ListsPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const MediaDetail = lazy(() => import('./pages/MediaDetail'))
const MoviePage = lazy(() => import('./pages/MoviePage').then(mod => ({ default: mod.MoviePage })))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))
const PersonPage = lazy(() => import('./pages/PersonPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const WebSeriesPage = lazy(() => import('./pages/WebSeriesPage'))

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
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center"><LoadingSpinner label="Loading..." /></div>}>
      <Routes>
        <Route path="/"            element={<Navigate to="/home" replace />} />
        <Route path="/home"        element={<Home />} />
        <Route path="/movie"       element={<MoviePage />} />
        <Route path="/movies"      element={<MoviePage />} />
        <Route path="/anime"       element={<AnimePage />} />
        <Route path="/webseries"   element={<WebSeriesPage />} />
        <Route path="/detail/:mediaType/:tmdbId" element={<MediaDetail />} />
        <Route path="/detail/resolve/:imdbID"    element={<MediaDetail />} />
        <Route path="/person/:id"  element={<PersonPage />} />
        <Route path="/about"       element={<AboutPage />} />
        <Route path="/login"       element={<LoginPage />} />
        <Route path="/signup"      element={<Navigate to="/login" replace state={{ tab: 'register' }} />} />
        {/* Protected routes — login required */}
        <Route path="/lists"       element={<ProtectedRoute><ListsPage /></ProtectedRoute>} />
        <Route path="/favorites"   element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
        <Route path="/profile"     element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

        {/* Route-level protection: custom 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  </AppProvider>
)

export default App

