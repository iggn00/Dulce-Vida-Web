import { describe, it, expect } from 'vitest'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import ProtectedRoute from '../components/ProtectedRoute.jsx'
import { AuthContext } from '../context/AuthContext.jsx'

function Secret() { return <h1>Secreto</h1> }

describe('ProtectedRoute', () => {
  it('redirige a /login si no autenticado', () => {
    render(
      <AuthContext.Provider value={{ isAuthenticated: false, initialized: true }}>
        <MemoryRouter initialEntries={['/secret']}>
          <Routes>
            <Route path='/login' element={<h1>Login</h1>} />
            <Route path='/secret' element={<ProtectedRoute><Secret /></ProtectedRoute>} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    )
    expect(screen.getByText('Login')).toBeInTheDocument()
  })

  it('muestra contenido si autenticado simple', () => {
    render(
      <AuthContext.Provider value={{ isAuthenticated: true, initialized: true, user: { rol: 'USUARIO' } }}>
        <MemoryRouter initialEntries={['/secret']}>
          <Routes>
            <Route path='/secret' element={<ProtectedRoute><Secret /></ProtectedRoute>} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    )
    expect(screen.getByText('Secreto')).toBeInTheDocument()
  })
    it('redirige a /login si no autenticado (initialized)', () => {
      render(
        <AuthContext.Provider value={{ isAuthenticated: false, initialized: true }}>
          <MemoryRouter initialEntries={['/secret']}>
            <Routes>
              <Route path='/login' element={<h1>Login</h1>} />
              <Route path='/secret' element={<ProtectedRoute><Secret /></ProtectedRoute>} />
            </Routes>
          </MemoryRouter>
        </AuthContext.Provider>
      )
      expect(screen.getAllByText('Login').length).toBeGreaterThan(0)
    })

    it('muestra contenido si autenticado con initialized', () => {
      render(
        <AuthContext.Provider value={{ isAuthenticated: true, initialized: true, user: { rol: 'USUARIO', email: 'x@y.com' } }}>
          <MemoryRouter initialEntries={['/secret']}>
            <Routes>
              <Route path='/secret' element={<ProtectedRoute><Secret /></ProtectedRoute>} />
            </Routes>
          </MemoryRouter>
        </AuthContext.Provider>
      )
      expect(screen.getAllByText('Secreto').length).toBeGreaterThan(0)
    })
})
