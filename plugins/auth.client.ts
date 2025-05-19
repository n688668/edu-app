import { useUser } from '@/composables/useUser'
import { auth, onAuthStateChanged } from '~/utils/firebase'

export default defineNuxtPlugin(() => {
  const user = useUser()

  onAuthStateChanged(auth, (firebaseUser) => {
    user.value = firebaseUser
  })
})
