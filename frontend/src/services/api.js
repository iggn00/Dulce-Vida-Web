import { api } from './http'


export async function getProducts(params = {}) {
  const { q, idCategoria } = params
  
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


export async function getCategories() {
  const { data } = await api.get('/categorias')
  return data
}