import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, waitFor, fireEvent, cleanup } from '@testing-library/react'
import HistorialComprasPage from '../pages/HistorialComprasPage.jsx'

// Mock de servicios
vi.mock('../services/api.js', () => {
  return {
    getMyBoletas: vi.fn(),
    getBoletaDetalles: vi.fn()
  }
})

import { getMyBoletas, getBoletaDetalles } from '../services/api.js'

function buildBoleta(id, numero) {
  return {
    idBoleta: id,
    numero,
    fechaEmision: new Date('2025-11-24T10:00:00Z').toISOString(),
    subtotal: 10000,
    iva: 1900,
    total: 11900
  }
}

describe('HistorialComprasPage', () => {
  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })
  it('renderiza boletas y permite paginar', async () => {
    getMyBoletas.mockResolvedValueOnce({
      content: [buildBoleta(1, 1001), buildBoleta(2, 1002)],
      totalPages: 2
    })
    render(<HistorialComprasPage />)

    await waitFor(() => {
      expect(screen.queryByText('Cargando...')).toBeNull()
    })
    expect(screen.getByText('Historial de Compras')).toBeInTheDocument()
    expect(screen.getByText(/Boleta #1001/)).toBeInTheDocument()
    expect(screen.getByText(/Boleta #1002/)).toBeInTheDocument()
    const btnAnterior = screen.getByRole('button', { name: 'Anterior' })
    const btnSiguiente = screen.getByRole('button', { name: 'Siguiente' })
    expect(btnAnterior).toBeDisabled()
    expect(btnSiguiente).not.toBeDisabled()
  })

  it('abre detalles de una boleta', async () => {
    getMyBoletas.mockResolvedValueOnce({
      content: [buildBoleta(3, 2001)],
      totalPages: 1
    })
    getBoletaDetalles.mockResolvedValueOnce({
      boleta: buildBoleta(3, 2001),
      detalles: [
        {
          idDetalleBoleta: 10,
          producto: { nombre: 'Producto A' },
          cantidad: 2,
          precioUnitario: 5000,
          totalLinea: 10000
        }
      ]
    })

    render(<HistorialComprasPage />)

    await waitFor(() => {
      expect(screen.getByText(/Boleta #2001/)).toBeInTheDocument()
    })

    const botones = screen.getAllByRole('button', { name: 'Ver Detalles' })
    fireEvent.click(botones[0])

    await waitFor(() => {
      expect(getBoletaDetalles).toHaveBeenCalledWith(3)
      expect(screen.getByText(/Subtotal:/)).toBeInTheDocument()
      // Busca el texto completo del <li> usando una expresión regular
      expect(screen.getByText(/Producto A.*Cantidad: 2.*Total: \$10000/)).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: 'Cerrar' }))
    await waitFor(() => {
      // Busca el <li> por el texto completo
      expect(screen.queryByText(/Producto A.*Cantidad: 2.*Total: \$10000/)).toBeNull()
    })
  })
})
