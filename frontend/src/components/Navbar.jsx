import { NavLink, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar() {
  const { count } = useCart()
  const { user } = useAuth()
  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <img src="/img/misc/logo.png" height="40" alt="Dulce Vida" onError={(e)=>{ e.currentTarget.remove() }} />
          <span className="fw-semibold">Dulce Vida</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Alternar navegación"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav me-auto mb-2 mb-md-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/productos">Productos</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/nosotros">Nosotros</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/contacto">Contacto</NavLink>
            </li>
            {user?.rol === 'ADMINISTRADOR' && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/admin/dashboard">Admin</NavLink>
              </li>
            )}
          </ul>
          <div className="d-flex gap-2 mt-3 mt-md-0">
            <Link to="/login" className="btn btn-outline-light rounded-pill shadow-sm px-3">Iniciar sesión</Link>
            <Link to="/register" className="btn btn-dorado rounded-pill shadow-sm px-3">Registrar usuario</Link>
            <Link to="/carrito" className="btn btn-outline-light rounded-pill shadow-sm px-3 position-relative" aria-label="Carrito de compras">
              <span className="me-1">🛒</span>
              <span>Carrito</span>
              <span id="cart-count" className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">{count}</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}