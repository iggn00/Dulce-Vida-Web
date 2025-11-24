import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ProductCard from '../components/ProductCard.jsx'

const mock = { id: 1, title: 'Torta Prueba', price: 12990, image: null }

describe('ProductCard', () => {
  it('renderiza nombre y precio', () => {
    render(<ProductCard product={mock} />)
    expect(screen.getByText(/Torta Prueba/i)).toBeInTheDocument()
    expect(screen.getByText(/12\.990/)).toBeInTheDocument()
  })
})
