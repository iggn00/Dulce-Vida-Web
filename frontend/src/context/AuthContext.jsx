import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { login as loginService } from '../services/auth.js'
import { api, authApi } from '../services/http.js'

export const AuthContext = createContext(null)


export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    (async () => {
      let ok = false;
      try {
        const { data } = await authApi.get('/session')
        if (data?.id_usuario) {
          const u = { id: data.id_usuario, nombre: data.nombre, email: data.email, rol: data.rol }
          setUser(u)
          ok = true;
        }
      } catch (err) {
        if (err?.response?.status === 401) {
          // Intentar refresh
          try {
            const res = await authApi.post('/refresh')
            if (res.data?.exito) {
              // Reintentar sesión
              try {
                const { data } = await authApi.get('/session')
                if (data?.id_usuario) {
                  const u = { id: data.id_usuario, nombre: data.nombre, email: data.email, rol: data.rol }
                  setUser(u)
                  ok = true;
                }
              } catch {
                setUser(null)
              }
            } else {
              setUser(null)
            }
          } catch {
            setUser(null)
          }
        } else {
          setUser(null)
        }
      }
      if (!ok) setUser(null)
      setInitialized(true)
    })()
  }, [])

  const login = async (email, password) => {
    try {
      const data = await loginService(email, password)
      if (data?.id_usuario && data?.email && data?.rol) {
        const u = { id: data.id_usuario, nombre: data.nombre, email: data.email, rol: data.rol }
        setUser(u)
        return { ok: true, user: u }
      }
      if (data?.exito) {
        const u = { id: data.id_usuario, nombre: data.nombre, email: data.email, rol: data.rol }
        setUser(u)
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
  }

  const value = useMemo(() => ({ user, isAuthenticated: !!user, initialized, login, logout }), [user, initialized])
  if (!initialized) {
    return <div style={{width:'100vw',height:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}><span>Cargando...</span></div>
  }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}