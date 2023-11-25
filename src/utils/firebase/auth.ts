import { useState, useEffect } from 'react'
import { auth, signIn } from './core'
import { User, signOut } from 'firebase/auth'

export default function useFirebaseAuth() {
  const [authUser, setAuthUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const clear = () => {
    setAuthUser(null)
    setLoading(true)
  }

  const signInWithEmailAndPassword = (email: string, password: string) => signIn(auth, email, password)

  const logout = () => signOut(auth).then(clear)

  const authStateChanged = async (authState: User | null) => {
    if (!authState) {
      setAuthUser(null)
      setLoading(false)
      return
    }

    setLoading(true)
    setAuthUser(authState)
    setLoading(false)
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(authStateChanged)
    return () => unsubscribe()
  }, [])

  return {
    authUser,
    loading,
    signInWithEmailAndPassword,
    logout,
  }
}
