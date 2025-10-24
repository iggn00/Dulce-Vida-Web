import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function ProtectedRoute({ requiredRoles, allowedEmails }) {
  const { isAuthenticated, initialized, user } = useAuth()
  
  if (!initialized) return null
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (requiredRoles && Array.isArray(requiredRoles)) {
    const rol = user?.rol
    if (!rol || !requiredRoles.includes(rol)) {
      return <Navigate to="/" replace />
    }
  }
  if (allowedEmails && Array.isArray(allowedEmails)) {
    const email = user?.email
    if (!email || !allowedEmails.some(e => e.toLowerCase() === email.toLowerCase())) {
      return <Navigate to="/" replace />
    }
  }
  return <Outlet />
}