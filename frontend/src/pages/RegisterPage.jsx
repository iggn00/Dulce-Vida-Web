import { useState, useMemo } from 'react'
import { register as registerService } from '../services/auth'
import { regionesComunas } from '../assets/chile-regiones-comunas'

export default function RegisterPage() {
  const [form, setForm] = useState({ nombre: '', email: '', password: '', rol: 'USUARIO', rutCompleto: '', region: '', comuna: '' })
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const regiones = useMemo(() => regionesComunas.map(r => r.region), [])
  const comunas = useMemo(() => {
    const r = regionesComunas.find(x => x.region === form.region)
    return r ? r.comunas : []
  }, [form.region])

  const formatRutInput = (value, prev = '', inputType = '') => {
    // Reglas: 8 dígitos de cuerpo + 1 DV (1-9 o K). El guion se inserta automáticamente al escribir
    // pero si estás borrando y no hay DV, se remueve para facilitar backspace a través del guion.
    const isDeleting = inputType === 'deleteContentBackward' || inputType === 'deleteContentForward'
    const raw = (value || '').toUpperCase().replace(/[^0-9K]/g, '')
    let body = ''
    let dv = ''
    for (const ch of raw) {
      if (body.length < 8 && /[0-9]/.test(ch)) {
        body += ch
      } else if (body.length === 8 && dv === '' && /[1-9K]/.test(ch)) {
        dv = ch
      }
      // Ignorar cualquier otro carácter extra
    }
    if (body.length === 8) {
      if (dv) return `${body}-${dv}`
      // Sin DV: sólo mostrar guion si la acción no es borrar (mejora UX de borrado)
      return isDeleting ? body : `${body}-`
    }
    return body
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(''); setMsg(''); setLoading(true)
    try {
      // Validar y parsear RUT con guion: 8 dígitos + '-' + DV (DV: 1-9 o K)
      const rutCompleto = (form.rutCompleto || '').toUpperCase().trim()
      if (!/^\d{8}-[1-9K]$/.test(rutCompleto)) {
        throw new Error("RUT inválido. Debe tener 8 dígitos + DV (1-9 o K). Ej: 12345678-K")
      }
      const [rut, dv] = rutCompleto.split('-')
      if (!form.region) throw new Error('Seleccione una región')
      if (!form.comuna) throw new Error('Seleccione una comuna')

      await registerService(form.nombre, form.email, form.password, form.rol, rut, dv, form.region, form.comuna)
      setMsg('Usuario creado correctamente. Ya puedes iniciar sesión.')
      setForm({ nombre: '', email: '', password: '', rol: 'USUARIO', rutCompleto: '', region: '', comuna: '' })
    } catch (e) {
      const resp = e?.response?.data
      setError(resp?.errores ? resp.errores.join(', ') : (resp?.mensaje || e.message || 'Error creando usuario'))
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
          <div className="mb-3">
            <label className="form-label">RUT (con guion)</label>
       <input className="form-control" placeholder="12345678-K" value={form.rutCompleto}
         onChange={(e)=>setForm({...form, rutCompleto: formatRutInput(e.target.value, form.rutCompleto, e.nativeEvent?.inputType)})}
                   required />
            <div className="form-text">Ejemplo: 12345678-K o 12345678-9</div>
          </div>
          <div className="mb-3"><label className="form-label">Región</label>
            <select className="form-select" value={form.region} onChange={(e)=>setForm({...form, region: e.target.value, comuna: ''})} required>
              <option value="">Seleccione región</option>
              {regiones.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="mb-3"><label className="form-label">Comuna</label>
            <select className="form-select" value={form.comuna} onChange={(e)=>setForm({...form, comuna: e.target.value})} required disabled={!form.region}>
              <option value="">Seleccione comuna</option>
              {comunas.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="mb-3"><label className="form-label">Rol</label><select className="form-select" value={form.rol} onChange={(e)=>setForm({...form, rol: e.target.value})}><option value="USUARIO">USUARIO</option><option value="ADMINISTRADOR">ADMINISTRADOR</option></select></div>
          <div className="d-flex justify-content-end gap-2"><button className="btn btn-dorado" type="submit" disabled={loading}>Registrar</button></div>
        </form>
      </div>
    </div>
  )
}
