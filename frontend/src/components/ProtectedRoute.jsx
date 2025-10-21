import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function ProtectedRoute({ requiredRoles }) {
  const { isAuthenticated, user } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (requiredRoles && Array.isArray(requiredRoles)) {
    const rol = user?.rol
    if (!rol || !requiredRoles.includes(rol)) {
      return <Navigate to="/" replace />
    }
  }
  return <Outlet />
}