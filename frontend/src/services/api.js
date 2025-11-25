import { api } from './http'

export async function getProducts(params = {}) {
  const { q, idCategoria } = params;
  // No enviar token en GET públicos
  const config = { headers: {} };
  if (q || idCategoria) {
    const qp = new URLSearchParams();
    if (q) qp.set('q', q);
    if (idCategoria) qp.set('idCategoria', idCategoria);
    const { data } = await api.get(`/productos/buscar?${qp.toString()}`, config);
    return data;
  }
  const { data } = await api.get('/productos', config);
  return data;
}

export async function getCategories() {
  // No enviar token en GET públicos
  const config = { headers: {} };
  const { data } = await api.get('/categorias', config);
  return data;
}

export async function getMyBoletas(page = 0, size = 10) {
  const { data } = await api.get(`/boletas/mias?page=${page}&size=${size}`);
  return data;
}

export async function getAllBoletas(page = 0, size = 10) {
  const { data } = await api.get(`/boletas/admin?page=${page}&size=${size}`);
  return data;
}

export async function getBoletaDetalles(idBoleta) {
  const { data } = await api.get(`/boletas/${idBoleta}/detalles`);
  return data;
}