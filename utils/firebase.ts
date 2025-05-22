// ~/utils/firebase.ts
import { initializeApp } from 'firebase/app'
import {
  browserLocalPersistence,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  setPersistence,
  signInWithPopup,
  signOut,
} from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyBhLuJLNoIvDT7JaUEn0GFvEwlCnTKN5kA',
  authDomain: 'nuxtabc.firebaseapp.com',
  projectId: 'nuxtabc',
  storageBucket: 'nuxtabc.firebasestorage.app',
  messagingSenderId: '1011579411756',
  appId: '1:1011579411756:web:436aab34073b6321ae6089',
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const provider = new GoogleAuthProvider()

setPersistence(auth, browserLocalPersistence)

export {
  app,
  auth,
  db,
  onAuthStateChanged,
  provider,
  signInWithPopup,
  signOut,
}
