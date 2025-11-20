import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api, baseURL } from '../services/http.js'
import { useAuth } from './AuthContext.jsx'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { user } = useAuth()

  const keyForUser = (u) => (u && u.id ? `dv.cart.${u.id}` : null)

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
    const key = keyForUser(user)
    if (!user || !key) { setItems([]); setTotal(0); return }
    try {
      const { data } = await api.get('/cart', { withCredentials: true })
      mapServerCart(data)
      try { localStorage.setItem(key, JSON.stringify({ items: data?.items || [], total: data?.total || 0 })) } catch {}
    } catch {
      // Si el backend falla, al menos intentamos recuperar del localStorage
      try {
        const raw = localStorage.getItem(key)
        if (raw) {
          const parsed = JSON.parse(raw)
          const its = (parsed.items || []).map(it => ({ ...it }))
          setItems(its)
          setTotal(Number(parsed.total || 0))
        } else {
          setItems([]); setTotal(0)
        }
      } catch {
        setItems([]); setTotal(0)
      }
    }
  }

  useEffect(() => { refresh() }, [user])

  const addItem = async (product, cantidad = 1) => {
    
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
      const key = keyForUser(user)
      if (key) { try { localStorage.setItem(key, JSON.stringify({ items: data?.items || [], total: data?.total || 0 })) } catch {} }
    } catch (e) {
      const msg = e?.response?.data?.error
      if (msg) alert(msg)
      console.error('No se pudo agregar al carrito', e?.response?.data || e.message)
    }
  }
  
  const updateQuantity = async (id, cantidad) => {
    const found = items.find(i => i.id === id)
    if (!found) return
    
    let nextQty = parseInt(cantidad, 10)
    if (Number.isNaN(nextQty)) nextQty = 0
    if (nextQty < 0) nextQty = 0

    
    setItems(prev => {
      const updated = prev.map(it => it.id === id ? { ...it, cantidad: nextQty } : it)
      
      return updated.filter(it => (Number(it.cantidad) || 0) > 0)
    })
    try {
      const { data } = await api.patch(`/cart/item/${found.idDetalle}`, { cantidad: nextQty }, { withCredentials: true })
      mapServerCart(data)
      const key = keyForUser(user)
      if (key) { try { localStorage.setItem(key, JSON.stringify({ items: data?.items || [], total: data?.total || 0 })) } catch {} }
    } catch (e) {
      
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
      const key = keyForUser(user)
      if (key) { try { localStorage.setItem(key, JSON.stringify({ items: data?.items || [], total: data?.total || 0 })) } catch {} }
    } catch {}
  }
  const clear = async () => {
    try {
      const { data } = await api.delete('/cart/clear', { withCredentials: true })
      mapServerCart(data)
      const key = keyForUser(user)
      if (key) { try { localStorage.removeItem(key) } catch {} }
    } catch {}
  }
  const checkout = async () => {
    try {
      const { data } = await api.post('/cart/checkout', {}, { withCredentials: true })
      
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
