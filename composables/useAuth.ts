// composables/useAuth.ts
import { signInWithPopup, signOut } from 'firebase/auth'
import { auth, provider } from '~/utils/firebase'

export function useAuth() {
  const user: any = useState('user', () => null)

  const login = async () => {
    try {
      const result = await signInWithPopup(auth, provider)
      user.value = result.user
    }
    catch (error) {
      console.error('Google login failed:', error)
    }
  }

  const logout = async () => {
    await signOut(auth)
    user.value = null
  }

  return {
    user,
    login,
    logout,
  }
}
