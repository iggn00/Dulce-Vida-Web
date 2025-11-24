import { describe, it, expect } from 'vitest'

// Ejemplo simple de lógica de carrito (simulación aislada)
function addItem(state, producto, cantidad = 1) {
  const existing = state.find(i => i.id === producto.id)
  if (existing) {
    return state.map(i => i.id === producto.id ? { ...i, cantidad: i.cantidad + cantidad } : i)
  }
  return [...state, { id: producto.id, nombre: producto.nombre, cantidad }]
}

describe('Cart logic', () => {
  it('agrega nuevo producto', () => {
    const res = addItem([], { id: 1, nombre: 'A' }, 2)
    expect(res.length).toBe(1)
    expect(res[0].cantidad).toBe(2)
  })
  it('incrementa cantidad existente', () => {
    const res = addItem([{ id: 1, nombre: 'A', cantidad: 1 }], { id: 1, nombre: 'A' }, 3)
    expect(res[0].cantidad).toBe(4)
  })
})
