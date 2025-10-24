import axios from 'axios'

const base = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export async function login(email, password) {
  const { data } = await axios.post(base + '/auth/login', { email, password }, { withCredentials: true })
  return data
}

export async function register(nombre, email, password, rol, rut, dv, region, comuna) {
  const payload = { nombre, email, password, rol, rut, dv, region, comuna }
  const { data } = await axios.post(base + '/auth/register', payload, { withCredentials: true })
  return data
}