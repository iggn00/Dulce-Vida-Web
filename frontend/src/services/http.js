import axios from 'axios'

export const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080'
export const api = axios.create({ baseURL: baseURL + '/api', withCredentials: true })
export const authApi = axios.create({ baseURL: baseURL + '/auth', withCredentials: true })