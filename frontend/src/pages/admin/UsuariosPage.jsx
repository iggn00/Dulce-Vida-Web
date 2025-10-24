import { useEffect, useMemo, useState } from 'react'
import Modal from '../../components/admin/Modal.jsx'
import { api } from '../../services/http'
import { regionesComunas } from '../../assets/chile-regiones-comunas'

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([])
  const [q, setQ] = useState('')
  const [form, setForm] = useState({ nombre: '', email: '', password: '', rol: 'USUARIO', estado: 'activo', rutCompleto: '', region: '', comuna: '' })
  const [formCreate, setFormCreate] = useState({ nombre: '', email: '', password: '', rol: 'USUARIO', estado: 'activo', rutCompleto: '', region: '', comuna: '' })
  const [editId, setEditId] = useState(null)
  const [showEdit, setShowEdit] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Listas derivadas para selects
  const regiones = useMemo(() => regionesComunas.map(r => r.region), [])
  const comunasEdit = useMemo(() => {
    const r = regionesComunas.find(x => x.region === form.region)
    return r ? r.comunas : []
  }, [form.region])
  const comunasCreate = useMemo(() => {
    const r = regionesComunas.find(x => x.region === formCreate.region)
    return r ? r.comunas : []
  }, [formCreate.region])

  // Formateo de RUT: 8 dígitos + DV (1-9 o K), inserta guion automáticamente
  const formatRutInput = (value, prev = '', inputType = '') => {
    if (!value) return ''
    let raw = value.toUpperCase().replace(/[^0-9K-]/g, '')
    let body = ''
    let dv = ''
    for (const ch of raw) {
      if (/\d/.test(ch)) {
        if (body.length < 8 && dv === '') body += ch
      } else if (body.length === 8 && dv === '' && /[1-9K]/.test(ch)) {
        dv = ch
      }
    }
    if (body.length === 0) return ''
    if (body.length < 8) return body
    if (dv) return `${body}-${dv}`
    // Si es borrado, no mostrar guion fantasma
    if (inputType && inputType.includes('delete')) return body
    return `${body}-`
  }

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
    
    const rutOk = /^\d{8}-[1-9K]$/i.test((f.rutCompleto || '').toUpperCase().trim())
    if (!rutOk) errs.push('RUT inválido (formato: 12345678-K)')
    if (!f.region) errs.push('Región es obligatoria')
    if (!f.comuna) errs.push('Comuna es obligatoria')
    if (f.region) {
      const r = regionesComunas.find(x => x.region === f.region)
      if (!r) errs.push('Región no válida')
      else if (f.comuna && !r.comunas.includes(f.comuna)) errs.push('Comuna no pertenece a la región seleccionada')
    }
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
      
      await api.patch(`/usuarios/${u.idUsuario}/estado`, { estado: next })
      await cargar()
    } catch (e) {
      
      const status = e?.response?.status
      if (status === 404 || status === 405) {
        try {
          const next = (u.estado === 'activo') ? 'inactivo' : 'activo'
          
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
      // Parsear RUT
      const [rut, dv] = formCreate.rutCompleto.toUpperCase().trim().split('-')
      const payload = {
        nombre: formCreate.nombre,
        email: formCreate.email,
        password: formCreate.password,
        rol: formCreate.rol,
        estado: formCreate.estado,
        rut, dv,
        region: formCreate.region,
        comuna: formCreate.comuna
      }
      await api.post('/usuarios', payload)
      setFormCreate({ nombre: '', email: '', password: '', rol: 'USUARIO', estado: 'activo', rutCompleto: '', region: '', comuna: '' })
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
      const [rut, dv] = form.rutCompleto.toUpperCase().trim().split('-')
      const payload = { nombre: form.nombre, email: form.email, rol: form.rol, estado: form.estado, rut, dv, region: form.region, comuna: form.comuna }
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
          <button className="btn btn-primary" type="button" onClick={()=>{ setFormCreate({ nombre:'', email:'', password:'', rol:'USUARIO', estado:'activo', rutCompleto:'', region:'', comuna:'' }); setError(''); setShowCreate(true) }}>+ Crear usuario</button>
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
                  <th>RUT</th>
                  <th>Región</th>
                  <th>Comuna</th>
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
                    <td>{u.rut && u.dv ? `${u.rut}-${u.dv}` : ''}</td>
                    <td>{u.region || ''}</td>
                    <td>{u.comuna || ''}</td>
                    <td><span className="badge-soft">{u.rol}</span></td>
                    <td>{u.estado === 'activo' ? <span className="text-success">activo</span> : <span className="text-danger">inactivo</span>}</td>
                    <td className="d-flex gap-2">
                      <button className="btn btn-primary" disabled={loading} onClick={()=>{ setEditId(u.idUsuario); setForm({ nombre: u.nombre, email: u.email, password: '', rol: u.rol, estado: u.estado || 'activo', rutCompleto: (u.rut && u.dv) ? `${u.rut}-${(u.dv+'').toUpperCase()}` : '', region: u.region || '', comuna: u.comuna || '' }); setShowEdit(true) }}>Editar</button>
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

      {}
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
          <label>RUT (con guion)
            <input placeholder="12345678-K" value={form.rutCompleto}
              onChange={(e)=> setForm({ ...form, rutCompleto: formatRutInput(e.target.value, form.rutCompleto, e.nativeEvent?.inputType) })}
              required />
          </label>
          <label>Región
            <select value={form.region} onChange={(e)=> setForm({ ...form, region: e.target.value, comuna: '' })} required>
              <option value="">Seleccione región</option>
              {regiones.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </label>
          <label>Comuna
            <select value={form.comuna} onChange={(e)=> setForm({ ...form, comuna: e.target.value })} required disabled={!form.region}>
              <option value="">Seleccione comuna</option>
              {comunasEdit.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
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
          <label>RUT (con guion)
            <input placeholder="12345678-K" value={formCreate.rutCompleto}
              onChange={(e)=> setFormCreate({ ...formCreate, rutCompleto: formatRutInput(e.target.value, formCreate.rutCompleto, e.nativeEvent?.inputType) })}
              required />
          </label>
          <label>Región
            <select value={formCreate.region} onChange={(e)=> setFormCreate({ ...formCreate, region: e.target.value, comuna: '' })} required>
              <option value="">Seleccione región</option>
              {regiones.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </label>
          <label>Comuna
            <select value={formCreate.comuna} onChange={(e)=> setFormCreate({ ...formCreate, comuna: e.target.value })} required disabled={!formCreate.region}>
              <option value="">Seleccione comuna</option>
              {comunasCreate.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
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