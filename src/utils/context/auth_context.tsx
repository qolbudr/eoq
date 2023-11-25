import { createContext, useContext, Context, ReactNode } from 'react'
import useFirebaseAuth from '../firebase/auth'
import { User, UserCredential } from 'firebase/auth'

export const AuthUserContext = createContext<{
  authUser: User | null
  loading: boolean
  signInWithEmailAndPassword: any
  logout: () => Promise<void>
}>({
  authUser: null,
  loading: true,
  signInWithEmailAndPassword: async () => {},
  logout: async () => {}
})

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useFirebaseAuth()
  return <AuthUserContext.Provider value={auth}>{children}</AuthUserContext.Provider>
}

// custom hook to use the authUserContext and access authUser and loading
export const useAuth = () => useContext(AuthUserContext)
