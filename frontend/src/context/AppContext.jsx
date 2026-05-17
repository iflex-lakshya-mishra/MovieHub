import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup, signInWithRedirect,
    signOut,
    updateProfile,
} from 'firebase/auth'
import {
    addDoc,
    arrayRemove,
    arrayUnion,
    collection,
    deleteDoc,
    doc, getDoc,
    onSnapshot, query,
    serverTimestamp,
    setDoc, updateDoc,
    where,
} from 'firebase/firestore'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { auth, db, googleProvider } from '../utils/firebase'

const isPopupBlockedError = (err) => {
  const code = err?.code || ''
  return code === 'auth/popup-blocked' || code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request'
}

const AppContext = createContext(null)
const LS = {
  get: (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d } catch { return d } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} },
}

export function AppProvider({ children }) {
  const [user,        setUser]        = useState(null)
  const [userDoc,     setUserDoc]     = useState(null)
  const [favorites,   setFavorites]   = useState([])
  const [watchlist,   setWatchlist]   = useState([])
  const [lists,       setLists]       = useState([])
  const [authLoading, setAuthLoading] = useState(true)
  const [theme,       setTheme]       = useState(() => LS.get('mh_theme', 'dark'))

  useEffect(() => { document.documentElement.setAttribute('data-theme', theme); LS.set('mh_theme', theme) }, [theme])

  const syncUserDoc = useCallback(async (fbUser) => {
    const ref  = doc(db, 'users', fbUser.uid)
    const snap = await getDoc(ref)
    if (!snap.exists()) {
      await setDoc(ref, {
        uid:       fbUser.uid,
        username:  fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
        email:     fbUser.email || '',
        avatar:    fbUser.photoURL || `https://api.dicebear.com/7.x/thumbs/svg?seed=${fbUser.uid}`,
        favorites: [],
        watchlist: [],
        createdAt: serverTimestamp(),
      })
    }
    const data = (await getDoc(ref)).data()
    setUserDoc(data)
    setFavorites(data.favorites || [])
    setWatchlist(data.watchlist || [])
  }, [])

  useEffect(() => {
    let unsubLists = () => {}
    const unsubAuth = onAuthStateChanged(auth, async (fbUser) => {
      setUser(fbUser)
      if (fbUser) {
        await syncUserDoc(fbUser)
        const q = query(collection(db, 'lists'), where('ownerId', '==', fbUser.uid))
        unsubLists = onSnapshot(q, snap => setLists(snap.docs.map(d => ({ id: d.id, ...d.data() }))))
      } else {
        setUserDoc(null); setFavorites([]); setWatchlist([]); setLists([])
      }
      setAuthLoading(false)
    })
    return () => { unsubAuth(); unsubLists() }
  }, [syncUserDoc])

  // Auth
  const loginWithGoogle    = useCallback(async () => {
    try {
      return await signInWithPopup(auth, googleProvider)
    } catch (err) {
      if (isPopupBlockedError(err)) {
        await signInWithRedirect(auth, googleProvider)
        return null
      }
      throw err
    }
  }, [])
  const loginWithEmail     = useCallback((email, pw) => signInWithEmailAndPassword(auth, email, pw), [])
  const registerWithEmail  = useCallback(async (username, email, pw) => {
    const { user: u } = await createUserWithEmailAndPassword(auth, email, pw)
    await updateProfile(u, { displayName: username, photoURL: `https://api.dicebear.com/7.x/thumbs/svg?seed=${username}` })
    await syncUserDoc({ ...u, displayName: username })
  }, [syncUserDoc])
  const logout       = useCallback(() => signOut(auth), [])
  const updateAvatar = useCallback(async (avatar) => {
    if (!user) return
    await updateDoc(doc(db, 'users', user.uid), { avatar })
    setUserDoc(p => ({ ...p, avatar }))
  }, [user])

  // Favorites
  const toggleFav = useCallback(async (item) => {
    if (!user) return
    const ref    = doc(db, 'users', user.uid)
    const exists = favorites.some(f => f.tmdbId === item.tmdbId)
    if (exists) {
      const rem = favorites.find(f => f.tmdbId === item.tmdbId)
      await updateDoc(ref, { favorites: arrayRemove(rem) })
      setFavorites(p => p.filter(f => f.tmdbId !== item.tmdbId))
    } else {
      const add = { ...item, savedAt: Date.now() }
      await updateDoc(ref, { favorites: arrayUnion(add) })
      setFavorites(p => [...p, add])
    }
  }, [user, favorites])
  const isFav = useCallback((item) => favorites.some(f => f.tmdbId === item.tmdbId), [favorites])

  // Watchlist
  const toggleWatchlist = useCallback(async (item) => {
    if (!user) return
    const ref    = doc(db, 'users', user.uid)
    const exists = watchlist.some(f => f.tmdbId === item.tmdbId)
    if (exists) {
      const rem = watchlist.find(f => f.tmdbId === item.tmdbId)
      await updateDoc(ref, { watchlist: arrayRemove(rem) })
      setWatchlist(p => p.filter(f => f.tmdbId !== item.tmdbId))
    } else {
      const add = { ...item, savedAt: Date.now() }
      await updateDoc(ref, { watchlist: arrayUnion(add) })
      setWatchlist(p => [...p, add])
    }
  }, [user, watchlist])
  const inWatchlist = useCallback((item) => watchlist.some(f => f.tmdbId === item.tmdbId), [watchlist])

  // Lists
  const createList = useCallback(async ({ name, description = '', isPublic = false }) => {
    if (!user) return
    const ref = await addDoc(collection(db, 'lists'), {
      ownerId: user.uid, ownerName: userDoc?.username || 'User',
      name, description, isPublic, items: [], createdAt: serverTimestamp(),
    })
    return ref.id
  }, [user, userDoc])

  const deleteList = useCallback((listId) => deleteDoc(doc(db, 'lists', listId)), [])

  const addToList = useCallback(async (listId, item) => {
    const snap = await getDoc(doc(db, 'lists', listId))
    if (!snap.exists()) return
    const exists = (snap.data().items || []).some(i => i.tmdbId === item.tmdbId)
    if (!exists) await updateDoc(doc(db, 'lists', listId), { items: arrayUnion({ ...item, addedAt: Date.now() }) })
  }, [])

  const removeFromList = useCallback(async (listId, item) => {
    const snap = await getDoc(doc(db, 'lists', listId))
    if (!snap.exists()) return
    const toRem = (snap.data().items || []).find(i => i.tmdbId === item.tmdbId)
    if (toRem) await updateDoc(doc(db, 'lists', listId), { items: arrayRemove(toRem) })
  }, [])

  const toggleListVisibility = useCallback(async (listId) => {
    const snap = await getDoc(doc(db, 'lists', listId))
    if (snap.exists()) await updateDoc(doc(db, 'lists', listId), { isPublic: !snap.data().isPublic })
  }, [])

  return (
    <AppContext.Provider value={{
      user, userDoc, authLoading,
      loginWithGoogle, loginWithEmail, registerWithEmail, logout, updateAvatar,
      favorites, toggleFav, isFav,
      watchlist, toggleWatchlist, inWatchlist,
      lists, createList, deleteList, addToList, removeFromList, toggleListVisibility,
      theme, setTheme,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be inside AppProvider')
  return ctx
}
