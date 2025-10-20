import { api } from './http'

// Productos públicos (catálogo)
export async function getProducts(params = {}) {
  const { q, idCategoria } = params
  // Si hay filtros, usar /productos/buscar; si no, /productos
  if (q || idCategoria) {
    const qp = new URLSearchParams()
    if (q) qp.set('q', q)
    if (idCategoria) qp.set('idCategoria', idCategoria)
    const { data } = await api.get(`/productos/buscar?${qp.toString()}`)
    return data
  }
  const { data } = await api.get('/productos')
  return data
}

// Categorías
export async function getCategories() {
  const { data } = await api.get('/categorias')
  return data
}