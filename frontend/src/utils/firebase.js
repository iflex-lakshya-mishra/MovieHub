import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey:            "AIzaSyD947rhzis8J3atRWIUAPAOuTFZFf_bCqc",
  authDomain:        "myplan-com.firebaseapp.com",
  projectId:         "myplan-com",
  storageBucket:     "myplan-com.firebasestorage.app",
  messagingSenderId: "194218064243",
  appId:             "1:194218064243:web:db5918048b3bf125422d06",
  measurementId:     "G-5CE82240FB"
}

const app = initializeApp(firebaseConfig)
export const auth           = getAuth(app)
export const db             = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()
