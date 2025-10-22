import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { login as loginService } from '../services/auth.js'
import { api, baseURL } from '../services/http.js'

const AuthContext = createContext(null)
// Sin localStorage: la sesión vive en el backend vía cookie de sesión

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Consultar sesión al montar
    (async () => {
      try {
        const { data } = await api.get('/session', { withCredentials: true })
        if (data?.id_usuario) {
          setUser({ id: data.id_usuario, nombre: data.nombre, email: data.email, rol: data.rol })
        }
      } catch {}
    })()
  }, [])

  const login = async (email, password) => {
    try {
      const data = await loginService(email, password)
      if (data?.exito) {
        const u = { id: data.id_usuario, nombre: data.nombre, email: data.email, rol: data.rol }
        setUser(u)
        return true
      }
      return false
    } catch (err) {
      return false
    }
  }

  const logout = () => {
  setUser(null)
  api.post('/logout', {}, { withCredentials: true }).catch(()=>{})
  }

  const value = useMemo(() => ({ user, isAuthenticated: !!user, login, logout }), [user])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}