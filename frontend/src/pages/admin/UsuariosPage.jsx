import { useEffect, useState } from 'react'
import { api } from '../../services/http'

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([])
  const [q, setQ] = useState('')
  const [form, setForm] = useState({ nombre: '', email: '', password: '', rol: 'USUARIO' })
  const [editId, setEditId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const validarUsuario = (f) => {
    const errs = []
    if (!f.nombre?.trim()) errs.push('Nombre es obligatorio')
    if (f.nombre && f.nombre.length > 100) errs.push('Nombre no debe superar 100 caracteres')
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/
    if (!emailRegex.test(f.email || '')) errs.push('Email inválido')
    if (f.email && f.email.length > 100) errs.push('Email no debe superar 100 caracteres')
    if (!f.password || f.password.length < 8) errs.push('Contraseña debe tener al menos 8 caracteres')
  const rolesPermitidos = ['ADMINISTRADOR', 'USUARIO']
    if (!rolesPermitidos.includes(f.rol)) errs.push('Rol inválido')
    return errs
  }

  const cargar = async () => {
    setLoading(true)
    try {
      const { data } = q ? await api.get(`/usuarios/buscar?q=${encodeURIComponent(q)}`) : await api.get('/usuarios')
      setUsuarios(data)
    } catch (e) {
      setError('Error cargando usuarios')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { cargar() }, [q])

  const eliminar = async (id) => {
    if (!confirm('¿Seguro que deseas eliminar este usuario?')) return
    setLoading(true)
    setError('')
    try {
      await api.delete(`/usuarios/${id}`)
      cargar()
    } catch (e) {
      const resp = e?.response?.data
      setError(resp?.errores ? resp.errores.join(', ') : (resp?.mensaje || 'Error eliminando usuario'))
    } finally {
      setLoading(false)
    }
  }

  const crear = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const errs = validarUsuario(form)
    if (errs.length) {
      setError(errs.join(', '))
      setLoading(false)
      return
    }
    try {
      if (editId) {
        // Si no cambia la contraseña, no enviar password vacío para no sobreescribir
        const payload = { nombre: form.nombre, email: form.email, rol: form.rol }
        if (form.password) payload.password = form.password
        await api.put(`/usuarios/${editId}`, payload)
      } else {
        await api.post('/usuarios', form)
      }
      setForm({ nombre: '', email: '', password: '', rol: 'ADMINISTRADOR' })
      setEditId(null)
      cargar()
    } catch (e) {
      const resp = e?.response?.data
      setError(resp?.errores ? resp.errores.join(', ') : (resp?.mensaje || (editId ? 'Error actualizando usuario' : 'Error creando usuario')))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <h2>Gestión de Usuarios</h2>

      <div className="toolbar">
        <input placeholder="Buscar por nombre o email" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      <div className="grid">
        <div className="card">
          <div className="d-flex justify-content-between align-items-center">
            <h3>{editId ? 'Editar usuario' : 'Crear usuario'}</h3>
            {editId && <button className="btn" type="button" onClick={()=>{ setEditId(null); setForm({ nombre: '', email: '', password: '', rol: 'ADMINISTRADOR' }) }}>Cancelar edición</button>}
          </div>
          <form onSubmit={crear} className="form-grid">
            <label>Nombre<input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required /></label>
            <label>Email<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></label>
            <label>Contraseña<input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /></label>
            <label>Rol<select value={form.rol} onChange={(e) => setForm({ ...form, rol: e.target.value })}>
              <option>USUARIO</option>
              <option>ADMINISTRADOR</option>
            </select></label>
            <button className="btn" type="submit" disabled={loading}>Crear</button>
            {error && <div className="error">{error}</div>}
          </form>
          {editId && <div className="small text-muted mt-2">Nota: Si dejas la contraseña vacía, no se actualizará.</div>}
        </div>

        <div className="card">
          <h3>Listado</h3>
          {loading ? <p>Cargando...</p> : (
            <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map(u => (
                  <tr key={u.idUsuario}>
                    <td>{u.idUsuario}</td>
                    <td>{u.nombre}</td>
                    <td>{u.email}</td>
                    <td>{u.rol}</td>
                    <td className="d-flex gap-2">
                      <button className="btn" onClick={()=>{ setEditId(u.idUsuario); setForm({ nombre: u.nombre, email: u.email, password: '', rol: u.rol }) }}>Editar</button>
                      <button className="btn" onClick={()=> eliminar(u.idUsuario)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}