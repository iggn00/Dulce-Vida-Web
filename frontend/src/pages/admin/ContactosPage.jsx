import { useEffect, useMemo, useState } from 'react'
import { api } from '../../services/http.js'

export default function ContactosPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [q, setQ] = useState('')

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
                </tr>
              ))}
              {list.length === 0 && (
                <tr><td colSpan={6} className="text-muted">Sin resultados</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
