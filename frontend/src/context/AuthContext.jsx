import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { login as loginService } from '../services/auth.js'

const AuthContext = createContext(null)
const LS_KEY = 'dv_auth'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const raw = localStorage.getItem(LS_KEY)
    if (raw) {
      try { setUser(JSON.parse(raw)) } catch {}
    }
  }, [])

  const login = async (email, password) => {
    try {
      const data = await loginService(email, password)
      if (data?.exito) {
        const u = { id: data.id_usuario, nombre: data.nombre, email: data.email, rol: data.rol }
        setUser(u)
        localStorage.setItem(LS_KEY, JSON.stringify(u))
        return true
      }
      return false
    } catch (err) {
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(LS_KEY)
  }

  const value = useMemo(() => ({ user, isAuthenticated: !!user, login, logout }), [user])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}