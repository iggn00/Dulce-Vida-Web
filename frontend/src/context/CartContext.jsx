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
        stock: typeof p.stock === 'number' ? p.stock : undefined,
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
    // Si conocemos el stock y ya hay unidades en carrito, limitamos el agregado
    const existing = items.find(i => i.id === product.id)
    const yaEnCarrito = Number(existing?.cantidad || 0)
    const stock = typeof product.stock === 'number' ? product.stock : undefined
    let cantidadAAgregar = Number(cantidad || 1)
    if (cantidadAAgregar <= 0) cantidadAAgregar = 1
    if (typeof stock === 'number') {
      const restante = stock - yaEnCarrito
      if (restante <= 0) {
        alert('Ya alcanzaste el stock disponible para este producto.')
        return
      }
      cantidadAAgregar = Math.min(cantidadAAgregar, restante)
    }
    try {
      const { data } = await api.post('/cart/add', { idProducto: product.id, cantidad: cantidadAAgregar }, { withCredentials: true })
      mapServerCart(data)
    } catch (e) {
      const msg = e?.response?.data?.error
      if (msg) alert(msg)
      console.error('No se pudo agregar al carrito', e?.response?.data || e.message)
    }
  }
  // Actualiza la cantidad de un ítem; aplica actualización optimista y luego sincroniza con el servidor
  const updateQuantity = async (id, cantidad) => {
    const found = items.find(i => i.id === id)
    if (!found) return
    // Normalizamos cantidad
    let nextQty = parseInt(cantidad, 10)
    if (Number.isNaN(nextQty)) nextQty = 0
    if (nextQty < 0) nextQty = 0

    // Optimista: reflejar en UI de inmediato
    setItems(prev => {
      const updated = prev.map(it => it.id === id ? { ...it, cantidad: nextQty } : it)
      // Si llega a 0 lo quitamos visualmente para que se sienta responsivo
      return updated.filter(it => (Number(it.cantidad) || 0) > 0)
    })
    try {
      const { data } = await api.patch(`/cart/item/${found.idDetalle}`, { cantidad: nextQty }, { withCredentials: true })
      mapServerCart(data)
    } catch (e) {
      // Si falla, refrescamos para no dejar el estado desincronizado
      console.error('No se pudo actualizar la cantidad', e?.response?.data || e.message)
      await refresh()
      throw e
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

  const value = useMemo(() => ({ items, addItem, updateQuantity, removeItem, clear, checkout, count, total, refresh }), [items, count, total])
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  return useContext(CartContext)
}
