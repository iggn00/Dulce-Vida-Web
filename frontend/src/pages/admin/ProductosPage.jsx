import { useEffect, useState } from 'react'
import { api, baseURL } from '../../services/http'

export default function ProductosPage() {
  const [productos, setProductos] = useState([])
  const [q, setQ] = useState('')
  const [categorias, setCategorias] = useState([])
  const [categoriaId, setCategoriaId] = useState('')
  const [form, setForm] = useState({ nombre: '', descripcion: '', precio: 1000, stock: 10, idCategoria: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const validarProducto = (f) => {
    const errs = []
    if (!f.nombre?.trim()) errs.push('Nombre es obligatorio')
    if (f.nombre && f.nombre.length > 100) errs.push('Nombre no debe superar 100 caracteres')
    if (!f.descripcion?.trim()) errs.push('Descripción es obligatoria')
    if (f.descripcion && f.descripcion.length > 1000) errs.push('Descripción no debe superar 1000 caracteres')
    if (f.precio == null || Number(f.precio) <= 0) errs.push('Precio debe ser positivo')
    if (f.stock == null || Number(f.stock) < 0) errs.push('Stock no debe ser negativo')
    if (!f.idCategoria) errs.push('Debe seleccionar una categoría')
    return errs
  }

  const cargar = async () => {
    setLoading(true)
    try {
      const [cats, prods] = await Promise.all([
        api.get('/categorias'),
        (q || categoriaId) ? api.get(`/productos/buscar${q ? `?q=${encodeURIComponent(q)}` : ''}${!q && categoriaId ? `?idCategoria=${categoriaId}` : (q && categoriaId ? `&idCategoria=${categoriaId}` : '')}`) : api.get('/productos')
      ])
      setCategorias(cats.data)
      setProductos(prods.data)
    } catch (e) {
      setError('Error cargando productos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { cargar() }, [q, categoriaId])

  const crear = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const errs = validarProducto(form)
    if (errs.length) {
      setError(errs.join(', '))
      setLoading(false)
      return
    }
    try {
      const payload = { ...form, categoria: { idCategoria: Number(form.idCategoria) } }
      await api.post('/productos', payload)
      setForm({ nombre: '', descripcion: '', precio: 1000, stock: 10, idCategoria: categorias[0]?.idCategoria ? String(categorias[0].idCategoria) : '' })
      cargar()
    } catch (e) {
      const resp = e?.response?.data
      setError(resp?.errores ? resp.errores.join(', ') : (resp?.mensaje || 'Error creando producto'))
    } finally {
      setLoading(false)
    }
  }

  const inhabilitar = async (id) => {
    setLoading(true)
    try {
      await api.delete(`/productos/${id}`)
      cargar()
    } catch (e) {
      const resp = e?.response?.data
      setError(resp?.errores ? resp.errores.join(', ') : (resp?.mensaje || 'Error inhabilitando producto'))
    } finally {
      setLoading(false)
    }
  }

  const subirImagen = async (id, file) => {
    if (!file) return
    if (!file.type?.startsWith('image/')) {
      setError('El archivo debe ser una imagen')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen no debe superar 5MB')
      return
    }
    const fd = new FormData()
    fd.append('archivo', file)
    setLoading(true)
    try {
      await api.post(`/productos/${id}/imagen`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      cargar()
    } catch (e) {
      const resp = e?.response?.data
      setError(resp?.errores ? resp.errores.join(', ') : (resp?.mensaje || 'Error subiendo imagen'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <h2>Gestión de Productos</h2>

      <div className="toolbar">
        <input placeholder="Buscar por nombre" value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)}>
          <option value="">Todas las categorías</option>
          {categorias.map(c => <option key={c.idCategoria} value={c.idCategoria}>{c.nombre}</option>)}
        </select>
      </div>

      <div className="grid">
        <div className="card">
          <h3>Crear producto</h3>
          <form onSubmit={crear} className="form-grid">
            <label>Nombre<input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required /></label>
            <label>Descripción<textarea value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} required /></label>
            <label>Precio<input type="number" min="0" step="0.01" value={form.precio} onChange={(e) => setForm({ ...form, precio: Number(e.target.value) })} required /></label>
            <label>Stock<input type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} required /></label>
            <label>Categoría<select value={form.idCategoria} onChange={(e) => setForm({ ...form, idCategoria: e.target.value })} required>
              <option value="">Seleccione una categoría</option>
              {categorias.map(c => (
                <option key={c.idCategoria} value={c.idCategoria}>{c.nombre}</option>
              ))}
            </select></label>
            <button className="btn" type="submit" disabled={loading}>Crear</button>
            {error && <div className="error">{error}</div>}
          </form>
        </div>

        <div className="card">
          <h3>Listado</h3>
          {loading ? <p>Cargando...</p> : (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Imagen</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {productos.map(p => (
                  <tr key={p.idProducto}>
                    <td>{p.idProducto}</td>
                    <td>{p.nombre}</td>
                    <td>{p.categoria?.nombre}</td>
                    <td>${p.precio}</td>
                    <td>{p.stock}</td>
                    <td>
                      {p.imagenUrl ? (
                        <img alt={p.nombre} src={baseURL + p.imagenUrl} style={{ width: 60, height: 60, objectFit: 'cover' }} />
                      ) : (
                        <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && subirImagen(p.idProducto, e.target.files[0])} />
                      )}
                    </td>
                    <td>
                      {p.estado === 'disponible' && <button className="btn" onClick={() => inhabilitar(p.idProducto)}>Inhabilitar</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}