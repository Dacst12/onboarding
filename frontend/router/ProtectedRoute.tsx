import { Navigate, useLocation } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import type { Role } from '../types/user'

interface ProtectedRouteProps {
  children: React.ReactNode
  roles?: Role[]
}

const getRoleHomePath = (role: Role): string => {
  switch (role) {
    case 'admin':
      return '/admin'
    case 'mentor':
      return '/mentor'
    default:
      return '/dashboard'
  }
}

const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
  const { user, token } = useAuthStore()
  const location = useLocation()

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to={getRoleHomePath(user.role)} replace />
  }

  if (user && location.pathname === '/') {
    return <Navigate to={getRoleHomePath(user.role)} replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
