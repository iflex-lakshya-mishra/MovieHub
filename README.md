# 🎬 MovieHub

A Netflix-style movie, anime & web series discovery app built with React + Firebase.

## ✨ Features

- 🔥 Trending movies, anime, web series (TMDB API)
- 🔐 Firebase Auth — Google login + Email/Password
- ❤️ Favorites & 🔖 Watchlist — synced to cloud (Firestore)
- 📋 Custom Lists — Public & Private, shareable
- 🎭 Actor pages with full filmography
- 🎬 Trailer player + Where to Watch (streaming providers)
- 📱 PWA — installable on mobile
- 🌸 Anime section with Isekai, Movies, Classics

---

## 🚀 Setup

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/moviehub.git
cd moviehub
```

### 2. Firebase setup
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project → name it `moviehub`
3. Enable **Authentication** → Sign-in methods:
   - ✅ Email/Password
   - ✅ Google
4. Enable **Firestore Database** → Start in **test mode**
5. Go to **Project Settings** → Web App → Copy config

### 3. Frontend environment variables
```bash
cd frontend
cp .env.example .env
```
Paste your Firebase config into `.env`:
```
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=myplan-com.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=myplan-com
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_TMDB_API_KEY=your_tmdb_api_key
```

### 4. Install & run
```bash
cd frontend
npm install
npm run dev
```
App will open at `http://localhost:5173`

---

## 🌐 Deploy to Vercel (Free)

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) → Import repo
3. Set **Root Directory** to `frontend`
4. Add all `VITE_FIREBASE_*` env variables in Vercel dashboard
5. Deploy ✅

---

## 🗂 Project Structure

```
moviehub/
├── frontend/               # React app
│   ├── src/
│   │   ├── components/     # Navbar, MediaCard, HeroSection, MediaRow
│   │   ├── context/        # AppContext (Firebase Auth + Firestore)
│   │   ├── pages/          # Home, MoviePage, AnimePage, MediaDetail...
│   │   ├── utils/
│   │   │   ├── firebase.js # Firebase init
│   │   │   └── tmdb.js     # TMDB API calls + caching
│   │   └── data/           # Anime data
│   ├── public/
│   │   ├── manifest.json   # PWA manifest
│   │   └── sw.js           # Service worker
│   ├── .env.example
│   └── package.json
├── .gitignore
└── README.md
```

---

## 🔥 Firestore Rules (Production)

Update rules in Firebase Console → Firestore → Rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
    match /lists/{listId} {
      allow read: if resource.data.isPublic == true || request.auth.uid == resource.data.ownerId;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.ownerId;
    }
  }
}
```

---

## 📦 Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite, TailwindCSS v4 |
| Auth & DB | Firebase Auth + Firestore |
| Media API | TMDB API (free) |
| PWA | Service Worker + Web Manifest |
| Deploy | Vercel (free) |
