import { useEffect, useState } from 'react'
import { getMyBoletas, getBoletaDetalles } from '../services/api.js'

export default function HistorialComprasPage() {
  const [page, setPage] = useState(0)
  const [data, setData] = useState(null)
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(false)
  const size = 5

  useEffect(() => {
    (async () => {
      setLoading(true)
      try {
        const res = await getMyBoletas(page, size)
        setData(res)
      } finally { setLoading(false) }
    })()
  }, [page])

  async function openDetalles(id) {
    const det = await getBoletaDetalles(id)
    setSelected(det)
  }

  return (
    <div className="container" style={{ padding: '1rem' }}>
      <h2>Historial de Compras</h2>
      {loading && <p>Cargando...</p>}
      {!loading && data?.content?.length === 0 && <p>Sin compras aún.</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {data?.content?.map(b => (
          <li key={b.idBoleta} style={{ border: '1px solid #ddd', marginBottom: '.75rem', padding: '.75rem', borderRadius: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>Boleta #{b.numero}</strong><br />
                <small>Emitida: {new Date(b.fechaEmision).toLocaleString()}</small><br />
                <small>Total: ${(b.total)?.toLocaleString('es-CL')}</small>
              </div>
              <button onClick={() => openDetalles(b.idBoleta)}>Ver Detalles</button>
            </div>
          </li>
        ))}
      </ul>
      <div style={{ display: 'flex', gap: '.5rem' }}>
        <button disabled={page === 0} onClick={() => setPage(p => Math.max(0, p - 1))}>Anterior</button>
        <button disabled={data && (page + 1 >= data.totalPages)} onClick={() => setPage(p => p + 1)}>Siguiente</button>
      </div>
      {selected && (
        <div style={{ marginTop: '1rem', background: '#fafafa', padding: '1rem', border: '1px solid #ccc', borderRadius: 6 }}>
          <h3>Boleta #{selected.boleta.numero}</h3>
          <p>Subtotal: ${selected.boleta.subtotal?.toLocaleString('es-CL')} | IVA: ${selected.boleta.iva?.toLocaleString('es-CL')} | Total: ${selected.boleta.total?.toLocaleString('es-CL')}</p>
          <table style={{ width: '100%', fontSize: '0.9rem' }}>
            <thead><tr><th>Producto</th><th>Cant.</th><th>Unit.</th><th>Total</th></tr></thead>
            <tbody>
              {selected.detalles.map(d => (
                <tr key={d.idDetalleBoleta}>
                  <td>{d.producto?.nombre}</td>
                  <td>{d.cantidad}</td>
                  <td>${d.precioUnitario?.toLocaleString('es-CL')}</td>
                  <td>${d.totalLinea?.toLocaleString('es-CL')}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={() => setSelected(null)} style={{ marginTop: '.5rem' }}>Cerrar</button>
        </div>
      )}
    </div>
  )
}
