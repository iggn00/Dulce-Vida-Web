import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { login as loginService } from '../services/auth.js'
import { api, authApi, getStoredToken, getStoredRefreshToken, storeTokens } from '../services/http.js'

export const AuthContext = createContext(null)


export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    
    try {
      const raw = localStorage.getItem('dv.auth.user')
      return raw ? JSON.parse(raw) : null
    } catch { return null }
  })
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    const token = getStoredToken()
    if (!token) { setInitialized(true); return }
    (async () => {
      try {
        const { data } = await authApi.get('/session', { headers: { Authorization: 'Bearer ' + token } })
        if (data?.id_usuario) {
          const u = { id: data.id_usuario, nombre: data.nombre, email: data.email, rol: data.rol }
          setUser(u)
          try { localStorage.setItem('dv.auth.user', JSON.stringify(u)) } catch {}
        } else {
          setUser(null)
          try { localStorage.removeItem('dv.auth.user') } catch {}
        }
      } catch {
        setUser(null)
        try { localStorage.removeItem('dv.auth.user') } catch {}
      } finally {
        setInitialized(true)
      }
    })()
  }, [])

  const login = async (email, password) => {
    try {
      const data = await loginService(email, password)
      // Considerar login exitoso si viene id_usuario, email y rol
      if (data?.id_usuario && data?.email && data?.rol) {
        // Guardar token si viene
        if (data.token) {
          storeTokens(data.token, data.refreshToken)
        }
        const u = { id: data.id_usuario, nombre: data.nombre, email: data.email, rol: data.rol }
        setUser(u)
        try { localStorage.setItem('dv.auth.user', JSON.stringify(u)) } catch {}
        return { ok: true, user: u }
      }
      // Compatibilidad: si viene exito y token
      if (data?.exito) {
        storeTokens(data.token, data.refreshToken)
        const u = { id: data.id_usuario, nombre: data.nombre, email: data.email, rol: data.rol }
        setUser(u)
        try { localStorage.setItem('dv.auth.user', JSON.stringify(u)) } catch {}
        return { ok: true, user: u }
      }
      return { ok: false, message: data?.mensaje || 'Credenciales inválidas' }
    } catch (err) {
      const resp = err?.response
      const msg = resp?.data?.mensaje || (resp?.status === 401 ? 'Credenciales inválidas' : 'Error al iniciar sesión')
      return { ok: false, message: msg }
    }
  }

  const logout = () => {
    setUser(null)
    try { localStorage.removeItem('dv.auth.user') } catch {}
    try { localStorage.removeItem('dv.auth.token') } catch {}
    try { localStorage.removeItem('dv.auth.refresh') } catch {}
  }

  const value = useMemo(() => ({ user, isAuthenticated: !!user, initialized, login, logout }), [user, initialized])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}