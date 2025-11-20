import axios from 'axios'

export const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080'
export const api = axios.create({ baseURL: baseURL + '/api' })
export const authApi = axios.create({ baseURL: baseURL + '/auth' })

export function getStoredToken() {
  try { return localStorage.getItem('dv.auth.token') || null } catch { return null }
}

function attachAuth(config) {
  const token = getStoredToken()
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = 'Bearer ' + token
  }
  return config
}

api.interceptors.request.use(attachAuth)
authApi.interceptors.request.use(attachAuth)

api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('Error API:', err?.response?.data || err.message)
    return Promise.reject(err)
  }
)