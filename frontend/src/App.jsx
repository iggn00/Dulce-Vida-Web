import { Routes, Route, Outlet, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import './App.css'
import ProductosPage from './pages/ProductosPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import DashboardPage from './pages/admin/DashboardPage.jsx'
import UsuariosPage from './pages/admin/UsuariosPage.jsx'
import AdminProductosPage from './pages/admin/ProductosPage.jsx'

function Layout() {
  return (
    <div className="bg-crema d-flex flex-column min-vh-100">
      <Navbar />
      <main className="container py-4 flex-grow-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

function HomePage() {
  return (
    <div>
      <h1 className="h4 mb-3">Bienvenido a Dulce Vida</h1>
      <p className="text-muted">Repostería artesanal con ingredientes de calidad.</p>
    </div>
  )
}

function ContactoPage() {
  return (
    <div>
      <h1 className="h4 mb-3">Contacto</h1>
      <p className="text-muted">Escríbenos a correo@dulcevida.cl</p>
    </div>
  )
}

function NosotrosPage() {
  return (
    <div>
      <h1 className="h4 mb-3">Nosotros</h1>
      <p className="text-muted">Pasión por el cacao y la repostería.</p>
    </div>
  )
}

function AdminLayout({ title, children }) {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h4 m-0">{title}</h1>
      </div>
      {children}
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}> 
          <Route index element={<HomePage />} />
          <Route path="productos" element={<ProductosPage />} />
          <Route path="contacto" element={<ContactoPage />} />
          <Route path="nosotros" element={<NosotrosPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="admin" element={<ProtectedRoute />}> 
            <Route path="dashboard" element={<AdminLayout title="Dashboard"><DashboardPage /></AdminLayout>} />
            <Route path="usuarios" element={<AdminLayout title="Usuarios"><UsuariosPage /></AdminLayout>} />
            <Route path="productos" element={<AdminLayout title="Productos"><AdminProductosPage /></AdminLayout>} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}
