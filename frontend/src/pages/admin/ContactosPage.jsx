import { useEffect, useMemo, useState } from 'react'
import { api } from '../../services/http.js'
import Modal from '../../components/admin/Modal.jsx'

export default function ContactosPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [q, setQ] = useState('')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    let alive = true
    async function load() {
      setLoading(true); setError('')
      try {
        const { data } = await api.get('/contactos')
        if (alive) setItems(Array.isArray(data) ? data : [])
      } catch (e) {
        if (alive) setError('Error cargando contactos')
      } finally {
        if (alive) setLoading(false)
      }
    }
    load()
    return () => { alive = false }
  }, [])

  const list = useMemo(() => {
    const term = q.trim().toLowerCase()
    if (!term) return items
    return items.filter(c => (
      c.nombre?.toLowerCase().includes(term) ||
      c.email?.toLowerCase().includes(term) ||
      c.asunto?.toLowerCase().includes(term) ||
      c.mensaje?.toLowerCase().includes(term)
    ))
  }, [items, q])

  return (
    <div className="page">
      <h2>Contactos</h2>
      <div className="toolbar d-flex gap-2 mb-3">
        <input
          className="form-control"
          placeholder="Filtrar por nombre, email, asunto o mensaje"
          value={q}
          onChange={(e)=>setQ(e.target.value)}
        />
      </div>
      {loading ? (
        <p>Cargando...</p>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Asunto</th>
                <th>Mensaje</th>
                <th>Fecha</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {list.map(c => (
                <tr key={c.idContacto}>
                  <td>{c.idContacto}</td>
                  <td>{c.nombre}</td>
                  <td>{c.email}</td>
                  <td>{c.asunto || '-'}</td>
                  <td style={{maxWidth: 420}}>
                    <div className="text-truncate" title={c.mensaje}>{c.mensaje}</div>
                  </td>
                  <td>{c.fechaEnvio ? new Date(c.fechaEnvio).toLocaleString() : '-'}</td>
                  <td className="text-end"><button className="btn btn-outline-secondary btn-sm" onClick={()=> setSelected(c)}>Ver</button></td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr><td colSpan={7} className="text-muted">Sin resultados</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={!!selected}
        onClose={()=> setSelected(null)}
        title={selected ? `Mensaje de ${selected.nombre}` : 'Mensaje'}
        footer={selected && (
          <>
            <a className="btn" href={`mailto:${encodeURIComponent(selected.email)}?subject=${encodeURIComponent(selected.asunto || 'Consulta')}&body=${encodeURIComponent(`Hola ${selected.nombre || ''}\n\nEn respuesta a tu mensaje:\n"${selected.mensaje || ''}"`)}`}>Responder por email</a>
            <button className="btn" type="button" onClick={() => { navigator.clipboard?.writeText(selected.email) }}>Copiar email</button>
            <button className="btn btn-primary" type="button" onClick={()=> setSelected(null)}>Cerrar</button>
          </>
        )}
      >
        {selected && (
          <div className="card admin-animate-in">
            <div className="card-body">
              <div className="d-flex flex-column gap-2">
                <div><strong>Nombre:</strong> {selected.nombre || '-'}</div>
                <div><strong>Email:</strong> <a href={`mailto:${selected.email}`}>{selected.email}</a></div>
                {selected.asunto && <div><strong>Asunto:</strong> {selected.asunto}</div>}
                <div>
                  <strong>Mensaje:</strong>
                  <div className="mt-1" style={{whiteSpace:'pre-wrap'}}>{selected.mensaje}</div>
                </div>
                {selected.fechaEnvio && <div className="text-muted small">Enviado: {new Date(selected.fechaEnvio).toLocaleString()}</div>}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
