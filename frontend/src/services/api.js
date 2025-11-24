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

// Boletas (historial cliente)
export async function getMyBoletas(page = 0, size = 10) {
  const { data } = await api.get(`/boletas/mias?page=${page}&size=${size}`)
  return data
}

// Boletas admin (todas)
export async function getAllBoletas(page = 0, size = 10) {
  const { data } = await api.get(`/boletas/admin?page=${page}&size=${size}`)
  return data
}

// Detalles de una boleta
export async function getBoletaDetalles(idBoleta) {
  const { data } = await api.get(`/boletas/${idBoleta}/detalles`)
  return data
}