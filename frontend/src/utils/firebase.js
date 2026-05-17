import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyD947rhzis8J3atRWIUAPAOuTFZFf_bCqc",
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "myplan-com.firebaseapp.com",
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID || "myplan-com",
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "myplan-com.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || import.meta.env.VITE_FIREBASE_MESSAGING_ID || "194218064243",
  appId:             import.meta.env.VITE_FIREBASE_APP_ID || "1:194218064243:web:db5918048b3bf125422d06",
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-5CE82240FB"
}

const app = initializeApp(firebaseConfig)
export const auth           = getAuth(app)
export const db             = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()
