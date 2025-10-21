import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)
const LS_KEY = 'dv_cart'

export function CartProvider({ children }) {
  const [items, setItems] = useState([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY)
      if (raw) setItems(JSON.parse(raw))
    } catch {}
  }, [])

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(items))
  }, [items])

  const addItem = (item) => {
    setItems((prev) => {
      if (prev.some(p => p.id === item.id)) return prev
      return [...prev, item]
    })
  }
  const removeItem = (id) => setItems(prev => prev.filter(p => p.id !== id))
  const clear = () => setItems([])
  const count = items.length
  const total = items.reduce((acc, it) => acc + Number(it.price || 0), 0)

  const value = useMemo(() => ({ items, addItem, removeItem, clear, count, total }), [items, count, total])
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  return useContext(CartContext)
}
