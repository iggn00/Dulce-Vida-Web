import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api, baseURL } from '../services/http.js'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)

  const mapServerCart = (data) => {
    const its = (data?.items || []).map(it => {
      const p = it.producto || {}
      return {
        id: p.idProducto,
        title: p.nombre,
        attributes: p.descripcion,
        price: Number(p.precio),
        image: p.imagenUrl ? (baseURL + p.imagenUrl) : undefined,
        cantidad: it.cantidad,
        idDetalle: it.idDetalle,
      }
    })
    setItems(its)
    setTotal(Number(data?.total || 0))
  }

  const refresh = async () => {
    try {
      const { data } = await api.get('/cart', { withCredentials: true })
      mapServerCart(data)
    } catch {}
  }

  useEffect(() => { refresh() }, [])

  const addItem = async (product, cantidad = 1) => {
    try {
      const { data } = await api.post('/cart/add', { idProducto: product.id, cantidad }, { withCredentials: true })
      mapServerCart(data)
    } catch (e) {
      console.error('No se pudo agregar al carrito', e?.response?.data || e.message)
    }
  }
  const removeItem = async (id) => {
    const found = items.find(i => i.id === id)
    if (!found) return
    try {
      const { data } = await api.delete(`/cart/item/${found.idDetalle}`, { withCredentials: true })
      mapServerCart(data)
    } catch {}
  }
  const clear = async () => {
    try {
      const { data } = await api.delete('/cart/clear', { withCredentials: true })
      mapServerCart(data)
    } catch {}
  }
  const checkout = async () => {
    try {
      const { data } = await api.post('/cart/checkout', {}, { withCredentials: true })
      // Tras finalizar, el carrito debería quedar vacío; refrescamos estado
      await refresh()
      return data
    } catch (e) {
      throw e
    }
  }
  const count = items.reduce((acc, it) => acc + (Number(it.cantidad) || 0), 0)

  const value = useMemo(() => ({ items, addItem, removeItem, clear, checkout, count, total, refresh }), [items, count, total])
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  return useContext(CartContext)
}
