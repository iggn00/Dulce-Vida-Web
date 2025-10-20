import axios from 'axios'

const base = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export async function login(email, password) {
  const { data } = await axios.post(base + '/login', { email, password })
  return data
}