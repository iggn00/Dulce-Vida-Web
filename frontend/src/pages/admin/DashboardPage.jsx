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
      <h2>Dashboard</h2>
      {loading ? (
        <p>Cargando...</p>
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
            <h3>Productos con bajo stock</h3>
            <ul>
              {bajoStock.map((p) => (
                <li key={p.idProducto}>{p.nombre} — stock: {p.stock}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}