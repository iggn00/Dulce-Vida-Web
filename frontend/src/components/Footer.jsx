import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Footer() {
  const { user, logout } = useAuth()
  return (
    <div className="container-fluid bg-cacao text-crema">
      <footer className="py-4">
        <div className="container">
          <div className="row g-4">
            <div className="col-12 col-md-3 d-flex align-items-start gap-3">
              <div>
                <div className="fw-semibold">Dulce Vida</div>
                <div className="small opacity-75">
                  Repostería artesanal con ingredientes de calidad.
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="fw-semibold titulo-pie mb-2">Enlaces</div>
              <ul className="list-unstyled small m-0 d-grid gap-1">
                <li><Link className="enlace-pie" to="/productos">Productos</Link></li>
                <li><Link className="enlace-pie" to="/nosotros">Nosotros</Link></li>
                <li><Link className="enlace-pie" to="/contacto">Contacto</Link></li>
                {user ? (
                  <>
                    <li><Link className="enlace-pie" to={user.rol === 'ADMINISTRADOR' ? '/admin/dashboard' : '/'}>Mi cuenta</Link></li>
                    {user.rol === 'ADMINISTRADOR' ? (
                      <li><Link className="enlace-pie" to="/admin/boletas">Boletas</Link></li>
                    ) : (
                      <li><Link className="enlace-pie" to="/historial-boletas">Historial de compras</Link></li>
                    )}
                    <li><button className="enlace-pie btn btn-link p-0 align-baseline" onClick={logout}>Cerrar sesión</button></li>
                  </>
                ) : (
                  <>
                    <li><Link className="enlace-pie" to="/login">Iniciar sesión</Link></li>
                    <li><Link className="enlace-pie" to="/register">Registrar usuario</Link></li>
                  </>
                )}
              </ul>
            </div>
            <div className="col-12 col-md-3">
              <div className="fw-semibold titulo-pie mb-2">Contacto</div>
              <div className="small">correo@dulcevida.cl</div>
              <div className="small mb-3">+56 9 1234 5678</div>
              <div className="fw-semibold titulo-pie mb-2">Síguenos</div>
              <div className="d-flex align-items-center gap-3 mb-3">
                <a className="social-pie" href="#" aria-label="Instagram">
                  <img src="/img/misc/instagram.png" alt="Instagram" height="22" />
                </a>
                <a className="social-pie" href="#" aria-label="TikTok">
                  <img src="/img/misc/tiktok.png" alt="TikTok" height="22" />
                </a>
              </div>
              <div className="fw-semibold titulo-pie mb-2">Newsletter</div>
              <form className="input-group input-group-sm" aria-label="Suscripción a newsletter" onSubmit={(e) => e.preventDefault()}>
                <input type="email" className="form-control footer-input" placeholder="Ingresar email" aria-label="Email" />
                <button className="btn btn-secondary" type="button">Suscribirse</button>
              </form>
            </div>
          </div>
          <div className="pie-inferior mt-4 pt-3 d-flex flex-column flex-md-row gap-2 justify-content-between small">
            <span>&copy; 2025 Dulce Vida. Todos los derechos reservados.</span>
            <span>Hecho con cariño y buen cacao.</span>
          </div>
        </div>
      </footer>
    </div>
  )
}