import { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from './auth_context'

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { authUser, loading } = useAuth()
  const router = useRouter()

  // Listen for changes on loading and authUser, redirect if needed
  useEffect(() => {
    if (!loading && !authUser) return router.push('/login')

    return router.push('/stok')
  }, [authUser, loading])

  return children;
}

export default ProtectedRoute;
