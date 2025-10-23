import { Routes, Route, Outlet, Navigate, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import ProductosPage from './pages/ProductosPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import DashboardPage from './pages/admin/DashboardPage.jsx'
import UsuariosPage from './pages/admin/UsuariosPage.jsx'
import AdminProductosPage from './pages/admin/ProductosPage.jsx'
import AdminContactosPage from './pages/admin/ContactosPage.jsx'
import AdminLayoutShell from './components/admin/AdminLayout.jsx'
import HomePage from './pages/HomePage.jsx'
import ContactoPage from './pages/ContactoPage.jsx'
import NosotrosPage from './pages/NosotrosPage.jsx'
import CartPage from './pages/CartPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'

function Layout() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')
  return (
    <div className="bg-crema d-flex flex-column min-vh-100">
      <Navbar />
      <main className={`${isAdmin ? 'px-0' : 'container'} py-4 flex-grow-1`}>
        <Outlet />
      </main>
      <Footer />
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
      <CartProvider>
      <Routes>
        {/* Rutas públicas con Navbar/Footer */}
        <Route path="/" element={<Layout />}> 
          <Route index element={<HomePage />} />
          <Route path="productos" element={<ProductosPage />} />
          <Route path="contacto" element={<ContactoPage />} />
          <Route path="nosotros" element={<NosotrosPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="carrito" element={<CartPage />} />
        </Route>

        {/* Panel de administración FULL (sin Navbar/Footer públicos) */}
        <Route path="/admin" element={<ProtectedRoute requiredRoles={["ADMINISTRADOR"]} />}> 
          <Route element={<AdminLayoutShell title="Panel" />}> 
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="usuarios" element={<UsuariosPage />} />
            <Route path="productos" element={<AdminProductosPage />} />
            <Route path="contactos" element={<AdminContactosPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </CartProvider>
    </AuthProvider>
  )
}
