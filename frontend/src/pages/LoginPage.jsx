import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function LoginPage() {
  const { login, user } = useAuth()
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    if (loading) return
    setError('')
    setLoading(true)
    const res = await login(email, password)
    if (res?.ok) {
      const u = res.user || user
      if ((u?.rol) === 'ADMINISTRADOR') nav('/admin/dashboard')
      else nav('/')
    }
    else {
      const m = res?.message
      
      if (m && /inactivo|bloquead|inhabilit/i.test(m)) setError('Tu cuenta ha sido inhabilitada')
      else setError(m || 'Credenciales inválidas')
      setLoading(false)
    }
    
  }

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-6 col-lg-4">
        <h1 className="h4 mb-3 text-center">Iniciar sesión</h1>
        {error && <div className="alert alert-danger py-2 mb-3">{error}</div>}
        <form className="card p-3" onSubmit={onSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" value={email} onChange={(e)=>setEmail(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input type="password" className="form-control" value={password} onChange={(e)=>setPassword(e.target.value)} required />
          </div>
          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-dorado" disabled={loading}>
              {loading ? 'Ingresando...' : 'Entrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}