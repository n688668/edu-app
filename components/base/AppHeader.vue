<script setup lang="ts">
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { useUser } from '@/composables/useUser'
import { auth, db, provider, signInWithPopup } from '~/utils/firebase'

const user = useUser()

async function login() {
  try {
    const result = await signInWithPopup(auth, provider)
    const firebaseUser = result.user
    user.value = firebaseUser

    // Lưu user vào Firestore nếu chưa có
    const userRef = doc(db, 'users', firebaseUser.uid)
    const docSnap = await getDoc(userRef)
    if (!docSnap.exists()) {
      await setDoc(userRef, {
        uid: firebaseUser.uid,
        name: firebaseUser.displayName,
        email: firebaseUser.email,
        photoURL: firebaseUser.photoURL,
        createdAt: new Date(),
      })
    }
  } catch (err) {
    console.error('Login error', err)
  }
}

async function logout() {
  await auth.signOut()
  user.value = null
}
</script>

<template>
  <header
    class="flex justify-between items-center p-4 bg-pink-200 rounded-b-xl shadow-md"
  >
    <h1 class="text-xl font-bold text-purple-700">🎓 Bé Học Vui</h1>
    <div>
      <button
        v-if="!user"
        class="bg-white text-pink-600 font-semibold px-4 py-2 rounded-xl shadow hover:bg-pink-100 transition"
        @click="login"
      >
        Đăng nhập với Google
      </button>
      <div
        v-else
        class="flex items-center gap-3"
      >
        <img
          :src="user.photoURL"
          class="w-8 h-8 rounded-full"
          alt="Avatar"
        />
        <span class="text-sm text-purple-700">{{ user.displayName }}</span>
        <button
          class="text-red-500 text-sm hover:underline ml-2"
          @click="logout"
        >
          Đăng xuất
        </button>
      </div>
    </div>
  </header>
</template>
