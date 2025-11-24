import { useEffect, useState } from 'react'
import { getAllBoletas, getBoletaDetalles } from '../../services/api.js'

export default function AdminComprasPage() {
  const [page, setPage] = useState(0)
  const [data, setData] = useState(null)
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(false)
  const size = 10

  useEffect(() => {
    (async () => {
      setLoading(true)
      try {
        const res = await getAllBoletas(page, size)
        setData(res)
      } finally { setLoading(false) }
    })()
  }, [page])

  async function openDetalles(id) {
    const det = await getBoletaDetalles(id)
    setSelected(det)
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Compras Realizadas (Admin)</h2>
      {loading && <p>Cargando...</p>}
      <table style={{ width: '100%', fontSize: '.85rem' }}>
        <thead>
          <tr><th>#</th><th>Fecha</th><th>Cliente</th><th>Total</th><th></th></tr>
        </thead>
        <tbody>
          {data?.content?.map(b => (
            <tr key={b.idBoleta}>
              <td>{b.numero}</td>
              <td>{new Date(b.fechaEmision).toLocaleString()}</td>
              <td>{b.pedido?.cliente?.email}</td>
              <td>${b.total?.toLocaleString('es-CL')}</td>
              <td><button onClick={() => openDetalles(b.idBoleta)}>Ver</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: '.5rem', display: 'flex', gap: '.5rem' }}>
        <button disabled={page === 0} onClick={() => setPage(p => Math.max(0, p - 1))}>Anterior</button>
        <button disabled={data && (page + 1 >= data.totalPages)} onClick={() => setPage(p => p + 1)}>Siguiente</button>
      </div>
      {selected && (
        <div style={{ marginTop: '1rem', background: '#f5f5f5', padding: '1rem', borderRadius: 6 }}>
          <h3>Boleta #{selected.boleta.numero}</h3>
          <p>Cliente: {selected.boleta.pedido?.cliente?.email}</p>
          <p>Total: ${selected.boleta.total?.toLocaleString('es-CL')}</p>
          <table style={{ width: '100%', fontSize: '.75rem' }}>
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
