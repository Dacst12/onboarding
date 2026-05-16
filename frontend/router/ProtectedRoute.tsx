import { Navigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import type { Role } from '../types/user'

interface ProtectedRouteProps {
  children: React.ReactNode
  roles?: Role[]
}

const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
  // const { user, token } = useAuthStore()

  // if (!token) {
  //   return <Navigate to="/login" replace />
  // }

  // if (roles && user && !roles.includes(user.role)) {
  //   return <Navigate to="/403" replace />
  // }

  return <>{children}</>
}

export default ProtectedRoute
