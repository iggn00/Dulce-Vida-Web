import { useEffect, useState } from 'react'
import Modal from '../../components/admin/Modal.jsx'
import { api } from '../../services/http'

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([])
  const [q, setQ] = useState('')
  const [form, setForm] = useState({ nombre: '', email: '', password: '', rol: 'USUARIO', estado: 'activo' })
  const [formCreate, setFormCreate] = useState({ nombre: '', email: '', password: '', rol: 'USUARIO', estado: 'activo' })
  const [editId, setEditId] = useState(null)
  const [showEdit, setShowEdit] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const validarUsuario = (f) => {
    const errs = []
    if (!f.nombre?.trim()) errs.push('Nombre es obligatorio')
    if (f.nombre && f.nombre.length > 100) errs.push('Nombre no debe superar 100 caracteres')
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/
    if (!emailRegex.test(f.email || '')) errs.push('Email inválido')
    if (f.email && f.email.length > 100) errs.push('Email no debe superar 100 caracteres')
    if (!editId && (!f.password || f.password.length < 8)) errs.push('Contraseña debe tener al menos 8 caracteres')
  const rolesPermitidos = ['ADMINISTRADOR', 'USUARIO']
    if (!rolesPermitidos.includes(f.rol)) errs.push('Rol inválido')
    if (!['activo','inactivo'].includes(f.estado)) errs.push('Estado inválido')
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

  const toggleEstado = async (u) => {
    setLoading(true)
    setError('')
    try {
      const next = (u.estado === 'activo') ? 'inactivo' : 'activo'
      // Intento 1: endpoint PATCH dedicado
      await api.patch(`/usuarios/${u.idUsuario}/estado`, { estado: next })
      await cargar()
    } catch (e) {
      // Fallback: si el backend aún no tiene el PATCH, usar PUT con payload completo
      const status = e?.response?.status
      if (status === 404 || status === 405) {
        try {
          const next = (u.estado === 'activo') ? 'inactivo' : 'activo'
          // Algunos servidores antiguos validan password en PUT; reutilizamos la actual si viene en el listado
          const payload = { nombre: u.nombre, email: u.email, rol: u.rol, estado: next }
          if (u.password) payload.password = u.password
          await api.put(`/usuarios/${u.idUsuario}`, payload)
          await cargar()
        } catch (ee) {
          const resp2 = ee?.response?.data
          setError(resp2?.errores ? resp2.errores.join(', ') : (resp2?.mensaje || 'No se pudo cambiar el estado'))
        }
      } else {
        const resp = e?.response?.data
        setError(resp?.errores ? resp.errores.join(', ') : (resp?.mensaje || 'Error cambiando estado'))
      }
    } finally {
      setLoading(false)
    }
  }

  const crear = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const errs = validarUsuario(formCreate)
    if (errs.length) {
      setError(errs.join(', '))
      setLoading(false)
      return
    }
    try {
      await api.post('/usuarios', formCreate)
      setFormCreate({ nombre: '', email: '', password: '', rol: 'USUARIO', estado: 'activo' })
      setShowCreate(false)
      cargar()
    } catch (e) {
      const resp = e?.response?.data
      setError(resp?.errores ? resp.errores.join(', ') : (resp?.mensaje || 'Error creando usuario'))
    } finally {
      setLoading(false)
    }
  }

  const guardarEdicion = async (e) => {
    e.preventDefault()
    if (!editId) return
    setError('')
    setLoading(true)
    const errs = validarUsuario(form)
    if (errs.length) {
      setError(errs.join(', '))
      setLoading(false)
      return
    }
    try {
      const payload = { nombre: form.nombre, email: form.email, rol: form.rol, estado: form.estado }
      if (form.password) payload.password = form.password
      await api.put(`/usuarios/${editId}`, payload)
      setEditId(null)
      setShowEdit(false)
      cargar()
    } catch (e) {
      const resp = e?.response?.data
      setError(resp?.errores ? resp.errores.join(', ') : (resp?.mensaje || 'Error actualizando usuario'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page admin-content">
      <div className="toolbar">
        <div style={{display:'flex',gap:'.5rem',flexWrap:'wrap'}}>
          <button className="btn btn-primary" type="button" onClick={()=>{ setFormCreate({ nombre:'', email:'', password:'', rol:'USUARIO', estado:'activo' }); setError(''); setShowCreate(true) }}>+ Crear usuario</button>
        </div>
        <input placeholder="Buscar por nombre o email" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      {error && (
        <div className="card" style={{background:'#ffe8e8',border:'1px solid #f5c2c7',color:'#842029',padding:'0.75rem 1rem',marginBottom:'1rem'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <span>{error}</span>
            <button className="btn" onClick={()=>setError('')}>Cerrar</button>
          </div>
        </div>
      )}

      <div className="card table-card admin-animate-in">
          <h3 className="m-0">Listado</h3>
          {loading ? <p>Cargando...</p> : (
            <div className="table-responsive table-viewport" style={{overflowX:'auto'}}>
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map(u => (
                  <tr key={u.idUsuario}>
                    <td>{u.idUsuario}</td>
                    <td>{u.nombre}</td>
                    <td><a href={`mailto:${u.email}`}>{u.email}</a></td>
                    <td><span className="badge-soft">{u.rol}</span></td>
                    <td>{u.estado === 'activo' ? <span className="text-success">activo</span> : <span className="text-danger">inactivo</span>}</td>
                    <td className="d-flex gap-2">
                      <button className="btn btn-primary" disabled={loading} onClick={()=>{ setEditId(u.idUsuario); setForm({ nombre: u.nombre, email: u.email, password: '', rol: u.rol, estado: u.estado || 'activo' }); setShowEdit(true) }}>Editar</button>
                      {u.estado === 'activo' && (
                        <button className="btn btn-danger" disabled={loading} onClick={()=> toggleEstado(u)}>Inhabilitar</button>
                      )}
                      {u.estado !== 'activo' && (
                        <button className="btn btn-success" disabled={loading} onClick={()=> toggleEstado(u)}>Habilitar</button>
                      )}
                      <button className="btn btn-outline-danger" disabled={loading} onClick={()=> eliminar(u.idUsuario)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          )}
        </div>

      {/* Modal de edición de usuario */}
      <Modal title="Editar usuario" open={showEdit} onClose={()=>{ setShowEdit(false); setEditId(null) }}
        footer={(
          <>
            <button className="btn" type="button" onClick={()=>{ setShowEdit(false); setEditId(null) }}>Cancelar</button>
            <button className="btn btn-primary" type="submit" form="form-edit-user" disabled={loading}>Guardar cambios</button>
          </>
        )}
      >
        <form id="form-edit-user" className="form-grid" onSubmit={guardarEdicion}>
          <label>Nombre<input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required /></label>
          <label>Email<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></label>
          <label>Contraseña<input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Dejar en blanco para no cambiar" /></label>
          <label>Rol<select value={form.rol} onChange={(e) => setForm({ ...form, rol: e.target.value })}>
            <option>USUARIO</option>
            <option>ADMINISTRADOR</option>
          </select></label>
          <label>Estado<select value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })}>
            <option value="activo">activo</option>
            <option value="inactivo">inactivo</option>
          </select></label>
          {error && <div className="error">{error}</div>}
        </form>
      </Modal>

      {/* Modal de creación de usuario */}
      <Modal title="Crear usuario" open={showCreate} onClose={()=> setShowCreate(false)}
        footer={(
          <>
            <button className="btn" type="button" onClick={()=> setShowCreate(false)}>Cancelar</button>
            <button className="btn btn-primary" type="submit" form="form-create-user" disabled={loading}>Crear</button>
          </>
        )}
      >
        <form id="form-create-user" className="form-grid" onSubmit={crear}>
          <label>Nombre<input value={formCreate.nombre} onChange={(e) => setFormCreate({ ...formCreate, nombre: e.target.value })} required /></label>
          <label>Email<input type="email" value={formCreate.email} onChange={(e) => setFormCreate({ ...formCreate, email: e.target.value })} required /></label>
          <label>Contraseña<input type="password" value={formCreate.password} onChange={(e) => setFormCreate({ ...formCreate, password: e.target.value })} required placeholder="Mínimo 8 caracteres" /></label>
          <label>Rol<select value={formCreate.rol} onChange={(e) => setFormCreate({ ...formCreate, rol: e.target.value })}>
            <option>USUARIO</option>
            <option>ADMINISTRADOR</option>
          </select></label>
          <label>Estado<select value={formCreate.estado} onChange={(e) => setFormCreate({ ...formCreate, estado: e.target.value })}>
            <option value="activo">activo</option>
            <option value="inactivo">inactivo</option>
          </select></label>
          {error && <div className="error">{error}</div>}
        </form>
      </Modal>
    </div>
  )
}