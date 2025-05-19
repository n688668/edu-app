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
  apiKey: 'AIzaSyClkrO_PRS_g5HIXjJBLQe9wp0qCK22ee0',
  authDomain: 'my-edu-app-aab27.firebaseapp.com',
  projectId: 'my-edu-app-aab27',
  storageBucket: 'my-edu-app-aab27.firebasestorage.app',
  messagingSenderId: '402908792532',
  appId: '1:402908792532:web:e55d3a9bc165bce5631d41',
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
