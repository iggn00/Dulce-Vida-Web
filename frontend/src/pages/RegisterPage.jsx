import { useState } from 'react'
import { api } from '../services/http'

export default function RegisterPage() {
  const [form, setForm] = useState({ nombre: '', email: '', password: '', rol: 'USUARIO' })
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(''); setMsg(''); setLoading(true)
    try {
      await api.post('/usuarios', form)
      setMsg('Usuario creado correctamente.')
      setForm({ nombre: '', email: '', password: '', rol: 'ADMINISTRADOR' })
    } catch (e) {
      const resp = e?.response?.data
      setError(resp?.errores ? resp.errores.join(', ') : (resp?.mensaje || 'Error creando usuario'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-6 col-lg-5">
        <h1 className="h4 mb-3">Registrar usuario</h1>
        {msg && <div className="alert alert-success py-2 mb-3">{msg}</div>}
        {error && <div className="alert alert-danger py-2 mb-3">{error}</div>}
        <form className="card p-3" onSubmit={onSubmit}>
          <div className="mb-3"><label className="form-label">Nombre</label><input className="form-control" value={form.nombre} onChange={(e)=>setForm({...form, nombre: e.target.value})} required /></div>
          <div className="mb-3"><label className="form-label">Email</label><input type="email" className="form-control" value={form.email} onChange={(e)=>setForm({...form, email: e.target.value})} required /></div>
          <div className="mb-3"><label className="form-label">Contraseña</label><input type="password" className="form-control" value={form.password} onChange={(e)=>setForm({...form, password: e.target.value})} required minLength={8} /></div>
          <div className="mb-3"><label className="form-label">Rol</label><select className="form-select" value={form.rol} onChange={(e)=>setForm({...form, rol: e.target.value})}><option>USUARIO</option><option>ADMINISTRADOR</option></select></div>
          <div className="d-flex justify-content-end gap-2"><button className="btn btn-dorado" type="submit" disabled={loading}>Registrar</button></div>
        </form>
      </div>
    </div>
  )
}
