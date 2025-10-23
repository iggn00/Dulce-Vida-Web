import { useEffect, useState } from 'react'
import { api } from '../../services/http'

export default function DashboardPage() {
  const [usuarios, setUsuarios] = useState(0)
  const [productos, setProductos] = useState(0)
  const [bajoStock, setBajoStock] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function cargar() {
      setLoading(true)
      try {
        const [u, p, bs] = await Promise.all([
          api.get('/usuarios'),
          api.get('/productos'),
          api.get('/productos/bajo-stock?umbral=5'),
        ])
        setUsuarios(u.data.length)
        setProductos(p.data.length)
        setBajoStock(bs.data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    cargar()
  }, [])

  return (
    <div className="page">
      {loading ? (
        <div className="grid">
          <div className="card stat skeleton" style={{height:96}}/>
          <div className="card stat skeleton" style={{height:96}}/>
          <div className="card skeleton" style={{height:220}}/>
        </div>
      ) : (
        <div className="grid">
          <div className="card stat">
            <h3>Usuarios</h3>
            <p className="big">{usuarios}</p>
          </div>
          <div className="card stat">
            <h3>Productos</h3>
            <p className="big">{productos}</p>
          </div>
          <div className="card">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <h3 className="m-0">Productos con bajo stock</h3>
              <span className="badge-soft">Umbral ≤ 5</span>
            </div>
            {bajoStock.length === 0 ? (
              <div className="text-muted">No hay productos con bajo stock 🎉</div>
            ) : (
              <ul className="list-group list-group-flush small">
                {bajoStock.map((p) => (
                  <li key={p.idProducto} className="list-group-item d-flex justify-content-between align-items-center">
                    <span className="text-truncate" style={{maxWidth:'70%'}}>{p.nombre}</span>
                    <span className="badge-soft">{p.stock} unidades</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  )
}