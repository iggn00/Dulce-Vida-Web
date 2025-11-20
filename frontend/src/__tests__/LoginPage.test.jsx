import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import LoginPage from '../pages/LoginPage.jsx'
import { AuthContext } from '../context/AuthContext.jsx'

function renderWithProviders(loginMock) {
  const value = { user: null, isAuthenticated: false, initialized: true, login: loginMock, logout: vi.fn() }
  return render(
    <AuthContext.Provider value={value}>
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin/dashboard" element={<div>Admin Dashboard</div>} />
          <Route path="/" element={<div>Home</div>} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  )
}

describe('LoginPage', () => {
  it('debe permitir login y redirigir a dashboard si rol ADMINISTRADOR', async () => {
    const loginMock = vi.fn(async () => ({ ok: true, user: { id: 1, nombre: 'Admin', email: 'admin@dv.com', rol: 'ADMINISTRADOR' } }))
    renderWithProviders(loginMock)
    const emailInput = screen.getByLabelText(/email/i)
    const passInput = screen.getByLabelText(/contraseña/i)
    const submitBtn = screen.getByRole('button', { name: /entrar/i })
    await userEvent.type(emailInput, 'admin@dv.com')
    await userEvent.type(passInput, 'pass12345')
    await userEvent.click(submitBtn)
    expect(loginMock).toHaveBeenCalledWith('admin@dv.com', 'pass12345')
    // Esperar a que aparezca destino
    const dashboard = await screen.findByText(/admin dashboard/i)
    expect(dashboard).toBeInTheDocument()
  })

  it('debe mostrar error con credenciales inválidas', async () => {
    const loginMock = vi.fn(async () => ({ ok: false, message: 'Credenciales inválidas' }))
    renderWithProviders(loginMock)
    await userEvent.type(screen.getByLabelText(/email/i), 'x@y.com')
    await userEvent.type(screen.getByLabelText(/contraseña/i), 'badpass')
    await userEvent.click(screen.getByRole('button', { name: /entrar/i }))
    const alerta = await screen.findByText(/credenciales inválidas/i)
    expect(alerta).toBeInTheDocument()
  })
})