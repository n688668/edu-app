<script setup lang="ts">
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { useUser } from '@/composables/useUser'
import { auth, db, provider, signInWithPopup } from '~/utils/firebase'

const route = useRoute()

const user = useUser()

const showLogout = ref(false)

function handleClickOutside(event: MouseEvent) {
  const logoutMenu = document.querySelector('.absolute')
  if (logoutMenu && !logoutMenu.contains(event.target as Node)) {
    showLogout.value = false
  }
}

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
  }
  catch (err) {
    console.error('Login error', err)
  }
}

async function logout() {
  await auth.signOut()
  user.value = null
}

const titleRef = ref<HTMLElement | null>(null)

onMounted(() => {
  setInterval(() => {
    const el = titleRef.value
    if (el) {
      el.classList.add('animate-wiggle-once')
      setTimeout(() => {
        el.classList.remove('animate-wiggle-once')
      }, 1000) // chạy hiệu ứng trong 1 giây
    }
  }, 60000) // mỗi 60 giây (1 phút)

  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <header class="flex items-center justify-between p-4 bg-pink-200 rounded-b-xl shadow-md">
    <!-- Cột trái: BackButton -->
    <div class="flex items-center" :class="route.path !== '/' ? 'w-full' : ''">
      <BackButton v-if="route.path !== '/'" />
    </div>
    <!-- Cột giữa: Tiêu đề căn giữa -->
    <div v-if="route.path === '/'" class="w-2/4 flex justify-center">
      <h1
        ref="titleRef"
        class="text-xl md:text-3xl font-bold text-purple-800 select-none"
        @click="navigateTo({ path: '/' })"
      >
        🎓 Bé Học Vui 🌟
      </h1>
    </div>
    <!-- Cột phải: Đăng nhập/avatar -->
    <div v-if="route.path === '/'" class="w-2/4 flex justify-end items-center">
      <button
        v-if="!user"
        class="bg-white text-pink-600 font-semibold px-4 py-2 rounded-xl shadow hover:bg-pink-100 transition"
        @click="login"
      >
        Đăng nhập với Google
      </button>
      <div v-else class="relative flex items-center gap-3">
        <div class="flex items-center gap-3 cursor-pointer" @click.stop="showLogout = !showLogout">
          <img
            :src="user.photoURL"
            class="w-8 h-8 rounded-full"
            alt="Avatar"
          >
          <span class="text-sm text-purple-700">{{ user.displayName }}</span>
        </div>
        <div v-if="showLogout" class="absolute top-6 right-0 mt-4 w-32 py-2 bg-white shadow-lg rounded-lg">
          <button
            class="text-red-500 text-sm hover:underline w-full text-left px-4"
            @click="logout"
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
@keyframes wiggle-once {
  0% { transform: rotate(0deg); }
  20% { transform: rotate(-3deg); }
  40% { transform: rotate(3deg); }
  60% { transform: rotate(-2deg); }
  80% { transform: rotate(2deg); }
  100% { transform: rotate(0deg); }
}

.animate-wiggle-once {
  animation: wiggle-once 1s ease-in-out;
}
</style>
