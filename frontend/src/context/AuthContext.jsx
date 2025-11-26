import { createContext, useContext, useEffect, useMemo, useState, useRef } from 'react'
import { login as loginService } from '../services/auth.js'
import { api, authApi } from '../services/http.js' // Usamos authApi para las llamadas de auth

export const AuthContext = createContext(null)

// Variables de control para la cola de refresh
let isRefreshing = false
let failedQueue = []

function processQueue(error, token = null) {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error)
        } else {
            prom.resolve(token)
        }
    })
    failedQueue = []
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [initialized, setInitialized] = useState(false)

    // Función para renovar el token
    const handleRefresh = async () => {
        try {
            const res = await authApi.post('/refresh')
            return !!res.data?.exito
        } catch {
            return false
        }
    }

    useEffect(() => {
        let cancelled = false
        const checkSession = async () => {
            try {
                const { data } = await authApi.get('/session')
                if (data?.id_usuario) {
                    const u = { id: data.id_usuario, nombre: data.nombre, email: data.email, rol: data.rol }
                    if (!cancelled) setUser(u)
                } else {
                    if (!cancelled) setUser(null)
                }
            } catch (err) {
                if (err?.response?.status === 401) {
                    try {
                        const refreshed = await handleRefresh()
                        if (refreshed) {
                            const { data } = await authApi.get('/session')
                            if (data?.id_usuario) {
                                const u = { id: data.id_usuario, nombre: data.nombre, email: data.email, rol: data.rol }
                                if (!cancelled) setUser(u)
                                return
                            }
                        }
                    } catch {}
                }
                if (!cancelled) setUser(null)
            } finally {
                if (!cancelled) setInitialized(true)
            }
        }
        checkSession()
        return () => { cancelled = true }
    }, [])

    useEffect(() => {
        const interceptor = api.interceptors.response.use(
            response => response,
            async error => {
                const originalRequest = error.config
                if (error.response?.status === 401 && !originalRequest._retry) {
                    if (isRefreshing) {
                        return new Promise((resolve, reject) => {
                            failedQueue.push({ resolve, reject })
                        })
                    }
                    originalRequest._retry = true
                    isRefreshing = true
                    try {
                        const refreshed = await handleRefresh()
                        if (refreshed) {
                            processQueue(null)
                            return api(originalRequest)
                        } else {
                            processQueue(error, null)
                            logout()
                            return Promise.reject(error)
                        }
                    } catch (err) {
                        processQueue(err, null)
                        logout()
                        return Promise.reject(err)
                    } finally {
                        isRefreshing = false
                    }
                }
                return Promise.reject(error)
            }
        )
        return () => {
            api.interceptors.response.eject(interceptor)
        }
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

    // --- AQUÍ ESTÁ LA CORRECCIÓN DEL LOGOUT ---
    const logout = async () => {
        try {
            // 1. Pedimos al backend que destruya la cookie
            await authApi.post('/logout')
        } catch (error) {
            console.error("Error al cerrar sesión en servidor", error)
        } finally {
            // 2. Borramos el usuario del estado local (siempre, aunque falle la API)
            setUser(null)
        }
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