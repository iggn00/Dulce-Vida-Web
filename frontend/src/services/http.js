import axios from 'axios'

export const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080'
export const api = axios.create({ baseURL: baseURL + '/api' })
export const authApi = axios.create({ baseURL: baseURL + '/auth' })

export function getStoredToken() {
  try { return localStorage.getItem('dv.auth.token') || null } catch { return null }
}
export function getStoredRefreshToken() {
  try { return localStorage.getItem('dv.auth.refresh') || null } catch { return null }
}
export function storeTokens(access, refresh) {
  if (access) { try { localStorage.setItem('dv.auth.token', access) } catch {}
  }
  if (refresh) { try { localStorage.setItem('dv.auth.refresh', refresh) } catch {}
  }
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

let refreshing = null
async function attemptRefresh() {
  if (refreshing) return refreshing
  const r = getStoredRefreshToken()
  if (!r) return null
  refreshing = fetch(baseURL + '/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken: r })
  }).then(async resp => {
    refreshing = null
    if (!resp.ok) throw new Error('Refresh failed')
    const data = await resp.json()
    if (data.token) storeTokens(data.token, data.refreshToken)
    return data.token
  }).catch(err => { refreshing = null; throw err })
  return refreshing
}

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const status = err?.response?.status
    if (status === 401) {
      try {
        const newToken = await attemptRefresh()
        if (newToken) {
          // Repetir la petición original con nuevo token
          const original = err.config
          original.headers = original.headers || {}
          original.headers.Authorization = 'Bearer ' + newToken
          return axios.request(original)
        }
      } catch {/* ignore */}
    }
    console.error('Error API:', err?.response?.data || err.message)
    return Promise.reject(err)
  }
)

authApi.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('Error Auth API:', err?.response?.data || err.message)
    return Promise.reject(err)
  }
)