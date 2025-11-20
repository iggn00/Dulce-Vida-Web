import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function ProtectedRoute({ requiredRoles, allowedEmails }) {
  const { isAuthenticated, initialized, user } = useAuth()
  if (!initialized) return null
  if (!isAuthenticated) return <Navigate to="/login" replace />
  const rol = user?.rol?.toUpperCase()
  if (requiredRoles && Array.isArray(requiredRoles)) {
    const rolesNorm = requiredRoles.map(r => r.toUpperCase())
    if (!rol || !rolesNorm.includes(rol)) return <Navigate to="/" replace />
  }
  if (allowedEmails && Array.isArray(allowedEmails)) {
    const email = (user?.email || '').toLowerCase()
    if (!email || !allowedEmails.some(e => e.toLowerCase() === email)) return <Navigate to="/" replace />
  }
  return <Outlet />
}