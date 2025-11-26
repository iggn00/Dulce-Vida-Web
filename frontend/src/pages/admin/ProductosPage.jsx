import { useEffect, useRef, useState } from 'react'
import Modal from '../../components/admin/Modal.jsx'
import { api, baseURL } from '../../services/http'

export default function ProductosPage() {
  const [productos, setProductos] = useState([])
  const [q, setQ] = useState('')
  const [categorias, setCategorias] = useState([])
  const [categoriaId, setCategoriaId] = useState('')
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const [sort, setSort] = useState('idProducto,desc')
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [form, setForm] = useState({ nombre: '', descripcion: '', precio: '1000', stock: '10', idCategoria: '', ingredientes: '', estado: 'disponible' })
  const [formCreate, setFormCreate] = useState({ nombre: '', descripcion: '', precio: '1000', stock: '10', idCategoria: '', ingredientes: '', estado: 'disponible' })
  const [createImage, setCreateImage] = useState(null)
  const [editId, setEditId] = useState(null)
  const [showEdit, setShowEdit] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const listRef = useRef(null)

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
        (async () => {
          if (q || categoriaId) {
            const params = new URLSearchParams()
            if (q) params.set('q', q)
            if (categoriaId) params.set('idCategoria', categoriaId)
            return api.get(`/productos/buscar?${params.toString()}`)
          }
          
          return api.get('/productos', { params: { page, size, sort } })
        })()
      ])
      setCategorias(cats.data)
      if (q || categoriaId) {
        setProductos(prods.data)
        setTotalPages(1)
        setTotalElements(prods.data?.length || 0)
      } else {
        const pg = prods.data
        if (Array.isArray(pg)) {
          
          setProductos(pg)
          setTotalPages(1)
          setTotalElements(pg.length)
        } else {
          setProductos(pg?.content || [])
          setTotalPages(pg?.totalPages || 0)
          setTotalElements(pg?.totalElements || 0)
        }
      }
    } catch (e) {
      setError('No pudimos cargar los productos. Verifica que el backend esté en ejecución y la base de datos disponible.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { cargar() }, [q, categoriaId, page, size, sort])

  const crear = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const errs = validarProducto(formCreate)
    if (errs.length) {
      setError(errs.join(', '))
      setLoading(false)
      return
    }
    try {
  const payload = { ...formCreate, precio: Number(formCreate.precio), stock: Number(formCreate.stock), categoria: { idCategoria: Number(formCreate.idCategoria) } }
      const resp = await api.post('/productos', payload)
      const created = resp?.data
      const newId = created?.idProducto
      if (newId && createImage) {
        const fd = new FormData()
        fd.append('archivo', createImage)
        await api.post(`/productos/${newId}/imagen`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      }
  setFormCreate({ nombre: '', descripcion: '', precio: '1000', stock: '10', idCategoria: categorias[0]?.idCategoria ? String(categorias[0].idCategoria) : '', ingredientes: '' })
      setCreateImage(null)
      setShowCreate(false)
      cargar()
      if (listRef.current) listRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } catch (e) {
      const resp = e?.response?.data
      setError(resp?.errores ? resp.errores.join(', ') : (resp?.mensaje || 'Error creando producto'))
    } finally {
      setLoading(false)
    }
  }

  const guardarEdicion = async (e) => {
    e.preventDefault()
    if (!editId) return
    setError('')
    setLoading(true)
    const errs = validarProducto(form)
    if (errs.length) {
      setError(errs.join(', '))
      setLoading(false)
      return
    }
    try {
  const payload = { ...form, precio: Number(form.precio), stock: Number(form.stock), categoria: { idCategoria: Number(form.idCategoria) } }
      await api.put(`/productos/${editId}`, payload)
      setEditId(null)
      setShowEdit(false)
      cargar()
    } catch (e) {
      const resp = e?.response?.data
      setError(resp?.errores ? resp.errores.join(', ') : (resp?.mensaje || 'Error actualizando producto'))
    } finally {
      setLoading(false)
    }
  }

  const inhabilitar = async (id) => {
    if (!confirm('¿Seguro que deseas inhabilitar este producto?')) return
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

  const restaurar = async (id) => {
    setLoading(true)
    try {
      await api.post(`/productos/${id}/restaurar`)
      cargar()
    } catch (e) {
      const resp = e?.response?.data
      setError(resp?.errores ? resp.errores.join(', ') : (resp?.mensaje || 'Error restaurando producto'))
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
    if (file.size > 10 * 1024 * 1024) {
      setError('La imagen no debe superar 10MB')
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
      <div className="toolbar">
        <div style={{display:'flex',gap:'.5rem',flexWrap:'wrap'}}>
          <button className="btn btn-primary" type="button" onClick={()=>{
            const defaultCat = categorias[0]?.idCategoria ? String(categorias[0].idCategoria) : ''
            setFormCreate({ nombre: '', descripcion: '', precio: '1000', stock: '10', idCategoria: defaultCat, ingredientes: '', estado: 'disponible' })
            setCreateImage(null)
            setShowCreate(true)
          }}>+ Crear producto</button>
        </div>
        <input placeholder="Buscar por nombre" value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)}>
          <option value="">Todas las categorías</option>
          {categorias.map(c => <option key={c.idCategoria} value={c.idCategoria}>{c.nombre}</option>)}
        </select>
      </div>

      <div className="grid">
        <div className="card table-card" ref={listRef}>
          <h3 className="m-0">Listado</h3>
          {error && <div className="alert alert-danger mt-2" role="alert">{error} <button className="btn btn-sm btn-light ms-2" onClick={()=>cargar()}>Reintentar</button></div>}
          {loading ? <p>Cargando...</p> : (
            <div className="table-responsive table-viewport" style={{overflowX:'auto'}}>
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th className="w-25">Ingredientes</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Imagen</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map(p => (
                  <tr key={p.idProducto}>
                    <td>{p.idProducto}</td>
                    <td>{p.nombre}</td>
                    <td>{p.categoria?.nombre}</td>
                    <td>
                      <div className="small text-muted" title={p.ingredientes || ''}>
                        {(p.ingredientes || '').length > 80 ? (p.ingredientes || '').slice(0,80) + '…' : (p.ingredientes || '')}
                      </div>
                    </td>
                    <td>{new Intl.NumberFormat('es-CL',{style:'currency',currency:'CLP',maximumFractionDigits:0}).format(Number(p.precio)||0)}</td>
                    <td>{p.stock}</td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        {p.imagenUrl && (
                          <img alt={p.nombre} src={baseURL + p.imagenUrl} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }} />
                        )}
                        <label className="btn btn-sm btn-outline-secondary m-0">
                          {p.imagenUrl ? 'Cambiar' : 'Subir'}
                          <input type="file" accept="image/*" style={{display:'none'}} onChange={(e) => e.target.files?.[0] && subirImagen(p.idProducto, e.target.files[0])} />
                        </label>
                      </div>
                    </td>
                    <td className="d-flex gap-2">
                      <button className="btn btn-primary" onClick={() => {
                        setEditId(p.idProducto)
                        setForm({
                          nombre: p.nombre || '',
                          descripcion: p.descripcion || '',
                          ingredientes: p.ingredientes || '',
                          precio: p.precio != null ? String(p.precio) : '',
                          stock: p.stock != null ? String(p.stock) : '',
                          idCategoria: p.categoria?.idCategoria ? String(p.categoria.idCategoria) : '',
                          estado: p.estado || 'disponible'
                        })
                        setShowEdit(true)
                      }}>Editar</button>
                      {p.estado === 'disponible' && <button className="btn btn-danger" onClick={() => inhabilitar(p.idProducto)}>Inhabilitar</button>}
                      {p.estado === 'agotado' && <button className="btn btn-success" onClick={() => restaurar(p.idProducto)}>Habilitar</button>}
                      <button className="btn btn-outline-danger" onClick={async () => {
                        if (!confirm('Esto eliminará el producto de forma permanente. ¿Continuar?')) return
                        setLoading(true)
                        try {
                          await api.delete(`/productos/${p.idProducto}/hard`)
                          cargar()
                        } catch (e) {
                          const resp = e?.response?.data
                          setError(resp?.errores ? resp.errores.join(', ') : (resp?.mensaje || 'Error eliminando producto'))
                        } finally {
                          setLoading(false)
                        }
                      }}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!q && !categoriaId && (
              <div className="d-flex justify-content-between align-items-center mt-2">
                <div className="d-flex align-items-center gap-2">
                  <label className="small">Tamaño
                    <select className="form-select form-select-sm d-inline-block ms-1" style={{width: 'auto'}} value={size} onChange={(e)=>{ setPage(0); setSize(Number(e.target.value)) }}>
                      {[5,10,20,50].map(n=> <option key={n} value={n}>{n}</option>)}
                    </select>
                  </label>
                  <label className="small">Ordenar por
                    <select className="form-select form-select-sm d-inline-block ms-1" style={{width: 'auto'}} value={sort} onChange={(e)=>{ setPage(0); setSort(e.target.value) }}>
                      <option value="idProducto,desc">ID desc</option>
                      <option value="idProducto,asc">ID asc</option>
                      <option value="nombre,asc">Nombre A-Z</option>
                      <option value="nombre,desc">Nombre Z-A</option>
                      <option value="precio,asc">Precio menor</option>
                      <option value="precio,desc">Precio mayor</option>
                      <option value="stock,asc">Stock menor</option>
                      <option value="stock,desc">Stock mayor</option>
                    </select>
                  </label>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <button className="btn btn-outline-secondary btn-sm" disabled={page<=0} onClick={()=> setPage(p=>Math.max(0,p-1))}>Anterior</button>
                  <span className="small">Página {totalPages? (page+1): 0} de {totalPages}</span>
                  <button className="btn btn-outline-secondary btn-sm" disabled={page+1>=totalPages} onClick={()=> setPage(p=>p+1)}>Siguiente</button>
                </div>
              </div>
            )}
            </div>
          )}
        </div>
      </div>

      {}
      <Modal title="Editar producto" open={showEdit} onClose={()=>{ setShowEdit(false); setEditId(null) }}
        footer={(
          <>
            <button className="btn" type="button" onClick={()=>{ setShowEdit(false); setEditId(null) }}>Cancelar</button>
            <button className="btn btn-primary" type="submit" form="form-editar" disabled={loading}>Guardar cambios</button>
          </>
        )}
      >
        <form id="form-editar" className="form-grid" onSubmit={guardarEdicion}>
          <label>Nombre<input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required /></label>
          <label>Descripción<textarea value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} required /></label>
          <label>Ingredientes<textarea value={form.ingredientes} onChange={(e) => setForm({ ...form, ingredientes: e.target.value })} placeholder="Ej: Harina, huevos, chocolate..." /></label>
          <label>Precio<input type="number" min="0" step="0.01" value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })} required /></label>
          <label>Stock<input type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required /></label>
          <label>Estado<select value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })} required>
            <option value="disponible">Disponible</option>
            <option value="agotado">Agotado</option>
          </select></label>
          <label>Categoría<select value={form.idCategoria} onChange={(e) => setForm({ ...form, idCategoria: e.target.value })} required>
            <option value="">Seleccione una categoría</option>
            {categorias.map(c => (
              <option key={c.idCategoria} value={c.idCategoria}>{c.nombre}</option>
            ))}
          </select></label>
          <div className="muted">Imagen: puedes actualizarla desde la tabla en la columna Imagen.</div>
          {error && <div className="error">{error}</div>}
        </form>
      </Modal>

      {}
      <Modal title="Crear producto" open={showCreate} onClose={()=> setShowCreate(false)}
        footer={(
          <>
            <button className="btn" type="button" onClick={()=> setShowCreate(false)}>Cancelar</button>
            <button className="btn btn-primary" type="submit" form="form-crear" disabled={loading}>Crear</button>
          </>
        )}
      >
        <form id="form-crear" className="form-grid" onSubmit={crear}>
          <label>Nombre<input value={formCreate.nombre} onChange={(e) => setFormCreate({ ...formCreate, nombre: e.target.value })} required /></label>
          <label>Descripción<textarea value={formCreate.descripcion} onChange={(e) => setFormCreate({ ...formCreate, descripcion: e.target.value })} required /></label>
          <label>Ingredientes<textarea value={formCreate.ingredientes} onChange={(e) => setFormCreate({ ...formCreate, ingredientes: e.target.value })} placeholder="Ej: Harina, huevos, chocolate..." /></label>
          <label>Precio<input type="number" min="0" step="0.01" value={formCreate.precio} onChange={(e) => setFormCreate({ ...formCreate, precio: e.target.value })} required /></label>
          <label>Stock<input type="number" min="0" value={formCreate.stock} onChange={(e) => setFormCreate({ ...formCreate, stock: e.target.value })} required /></label>
          <label>Estado<select value={formCreate.estado} onChange={(e)=> setFormCreate({ ...formCreate, estado: e.target.value })} required>
            <option value="disponible">Disponible</option>
            <option value="agotado">Agotado</option>
          </select></label>
          <label>Categoría<select value={formCreate.idCategoria} onChange={(e) => setFormCreate({ ...formCreate, idCategoria: e.target.value })} required>
            <option value="">Seleccione una categoría</option>
            {categorias.map(c => (
              <option key={c.idCategoria} value={c.idCategoria}>{c.nombre}</option>
            ))}
          </select></label>
          <label>Imagen (opcional)
            <input type="file" accept="image/*" onChange={(e)=> setCreateImage(e.target.files?.[0] || null)} />
          </label>
          {error && <div className="error">{error}</div>}
        </form>
      </Modal>
    </div>
  )
}