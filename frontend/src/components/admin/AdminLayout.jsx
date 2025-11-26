import { useEffect, useMemo, useState } from 'react'
import { NavLink, Outlet, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

export default function AdminLayout({ title }) {
  const [open, setOpen] = useState(false) 
  const [collapsed, setCollapsed] = useState(true) 
  const [hovering, setHovering] = useState(false) 
  const { user, logout } = useAuth()
  const location = useLocation()

  const initials = useMemo(() => {
    const n = (user?.nombre || '').trim()
    if (!n) return 'U'
    const parts = n.split(/\s+/)
    return (parts[0]?.[0] || 'U').toUpperCase()
  }, [user])

  const toggleMobile = () => setOpen(v => !v)
  const toggleCollapse = () => setCollapsed(v => !v)

  
  useEffect(() => {
    document.body.classList.add('is-admin')
    return () => { document.body.classList.remove('is-admin') }
  }, [])

  return (
  <div className={`admin-shell ${collapsed ? 'is-collapsed is-mini' : ''} ${hovering ? 'is-hover' : ''}`}>
      {}
      <div
        className={`admin-backdrop ${open ? 'is-open' : ''}`}
        onClick={() => setOpen(false)}
        aria-hidden={!open}
      />
      <aside
        className={`admin-sidebar ${open ? 'is-open' : ''}`}
        aria-label="Menú de administración"
        aria-hidden={!open}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <div className="admin-brand">
          <Link to="/" title="Ir al inicio" className="brand-home">
            <img src="/img/misc/logo.png" alt="Dulce Vida" height="28" onError={(e)=>{ e.currentTarget.remove() }} />
          </Link>
          <span className="brand-text">Panel</span>
        </div>
        <nav className="admin-nav">
          <NavLink to="/admin/dashboard" className={({isActive})=>`admin-link ${isActive?'active':''}`} onClick={()=>setOpen(false)}>
            <span className="icon">📊</span>
            <span className="text">Dashboard</span>
          </NavLink>
          <NavLink to="/admin/productos" className={({isActive})=>`admin-link ${isActive?'active':''}`} onClick={()=>setOpen(false)}>
            <span className="icon">🧁</span>
            <span className="text">Productos</span>
          </NavLink>
          <NavLink to="/admin/usuarios" className={({isActive})=>`admin-link ${isActive?'active':''}`} onClick={()=>setOpen(false)}>
            <span className="icon">👤</span>
            <span className="text">Usuarios</span>
          </NavLink>
          <NavLink to="/admin/contactos" className={({isActive})=>`admin-link ${isActive?'active':''}`} onClick={()=>setOpen(false)}>
            <span className="icon">✉️</span>
            <span className="text">Contactos</span>
          </NavLink>
          <NavLink to="/admin/boletas" className={({isActive})=>`admin-link ${isActive?'active':''}`} onClick={()=>setOpen(false)}>
            <span className="icon">🧾</span>
            <span className="text">Boletas</span>
          </NavLink>
        </nav>
        <div className="admin-sidebar-footer">
          {user && (
            <div className="userbox" title={`${user.nombre} (${user.rol})`}>
              <div className="avatar" aria-hidden>{initials}</div>
              <div className="meta">
                <div className="name">{user.nombre}</div>
                <div className="role">{user.rol}</div>
              </div>
            </div>
          )}
          <button className="btn btn-sidebar" type="button" onClick={logout} title="Cerrar sesión">⎋</button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-container d-flex align-items-center justify-content-between gap-2">
          <div className="left">
            {}
            <button className="btn btn-icon d-lg-none" type="button" onClick={toggleMobile} aria-label="Abrir menú" aria-expanded={open}>☰</button>
            <button className="btn btn-icon d-none d-lg-inline-flex" type="button" onClick={toggleCollapse} aria-label="Colapsar barra">≡</button>
            <div className="page-headings">
              <div className="breadcrumbs">Admin / {sectionFor(location)}</div>
              <h1 className="page-title m-0">{titleFor(location, title)}</h1>
            </div>
          </div>
          <div className="right d-flex align-items-center gap-2">
            <NavLink to="/" className="btn btn-light" title="Volver al inicio">🏠 Inicio</NavLink>
            {user && (
              <div className="userpill d-none d-sm-flex" title={user.email}>
                <span className="avatar" aria-hidden>{initials}</span>
                <span className="name">{user.nombre}</span>
              </div>
            )}
          </div>
          </div>
        </header>

        <main className="admin-content admin-container">
          <div className="admin-animate-in">
            <Outlet />
          </div>
        </main>
      </div>

      {}
    </div>
  )
}

function titleFor(loc, fallback){
  const p = loc?.pathname || ''
  if (p.includes('/admin/dashboard')) return 'Dashboard'
  if (p.includes('/admin/productos')) return 'Productos'
  if (p.includes('/admin/usuarios')) return 'Usuarios'
  if (p.includes('/admin/contactos')) return 'Contactos'
  return fallback || 'Panel'
}

function sectionFor(loc){
  const p = loc?.pathname || ''
  if (p.includes('/admin/dashboard')) return 'Dashboard'
  if (p.includes('/admin/productos')) return 'Productos'
  if (p.includes('/admin/usuarios')) return 'Usuarios'
  if (p.includes('/admin/contactos')) return 'Contactos'
  return 'Panel'
}
