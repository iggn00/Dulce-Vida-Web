import { Routes, Route, Outlet, Navigate, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx'

// Páginas
import HomePage from './pages/HomePage.jsx'
import ProductosPage from './pages/ProductosPage.jsx'
import ContactoPage from './pages/ContactoPage.jsx'
import NosotrosPage from './pages/NosotrosPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import CartPage from './pages/CartPage.jsx'
import HistorialBoletasPage from './pages/HistorialBoletasPage.jsx'
import BoletaDetallePage from './pages/BoletaDetallePage.jsx'

// Páginas Admin
import DashboardPage from './pages/admin/DashboardPage.jsx'
import UsuariosPage from './pages/admin/UsuariosPage.jsx'
import AdminProductosPage from './pages/admin/ProductosPage.jsx'
import AdminContactosPage from './pages/admin/ContactosPage.jsx'
import AdminBoletasPage from './pages/admin/BoletasPage.jsx'
import AdminLayoutShell from './components/admin/AdminLayout.jsx'

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

export default function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<HomePage />} />
                        <Route path="productos" element={<ProductosPage />} />
                        <Route path="contacto" element={<ContactoPage />} />
                        <Route path="nosotros" element={<NosotrosPage />} />
                        <Route path="login" element={<LoginPage />} />
                        <Route path="register" element={<RegisterPage />} />

                        {/* CARRITO PROTEGIDO: Si no hay login, redirige a /login */}
                        <Route path="carrito" element={
                            <ProtectedRoute>
                                <CartPage />
                            </ProtectedRoute>
                        } />

                        {/* Rutas de Usuario */}
                        <Route path="historial-boletas" element={
                            <ProtectedRoute>
                                <HistorialBoletasPage />
                            </ProtectedRoute>
                        } />
                        <Route path="boleta/:id" element={
                            <ProtectedRoute>
                                <BoletaDetallePage />
                            </ProtectedRoute>
                        } />
                    </Route>

                    {/* Rutas de Admin */}
                    <Route path="/admin" element={<ProtectedRoute requiredRoles={["ADMINISTRADOR"]} />}>
                        <Route element={<AdminLayoutShell title="Panel de Administración" />}>
                            <Route index element={<Navigate to="dashboard" replace />} />
                            <Route path="dashboard" element={<DashboardPage />} />
                            <Route path="usuarios" element={<UsuariosPage />} />
                            <Route path="productos" element={<AdminProductosPage />} />
                            <Route path="contactos" element={<AdminContactosPage />} />
                            <Route path="boletas" element={<AdminBoletasPage />} />
                        </Route>
                    </Route>

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </CartProvider>
        </AuthProvider>
    )
}