import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

export default function AdminLayout({ title }) {
  const [open, setOpen] = useState(false) // para mobile overlay
  const [collapsed, setCollapsed] = useState(false) // para desktop
  const { user, logout } = useAuth()

  const toggleMobile = () => setOpen(v => !v)
  const toggleCollapse = () => setCollapsed(v => !v)

  return (
    <div className={`admin-shell ${collapsed ? 'is-collapsed' : ''}`}>
      {/* Backdrop para móvil */}
      <div
        className={`admin-backdrop ${open ? 'is-open' : ''}`}
        onClick={() => setOpen(false)}
        aria-hidden={!open}
      />
      <aside
        className={`admin-sidebar ${open ? 'is-open' : ''}`}
        aria-label="Menú de administración"
        aria-hidden={!open}
      >
        <div className="admin-brand">
          <img src="/img/misc/logo.png" alt="Dulce Vida" height="28" onError={(e)=>{ e.currentTarget.remove() }} />
          {!collapsed && <span className="brand-text">Admin</span>}
        </div>
        <nav className="admin-nav">
          <NavLink to="/admin/dashboard" className={({isActive})=>`admin-link ${isActive?'active':''}`} onClick={()=>setOpen(false)}>
            <span className="icon">📊</span>
            {!collapsed && <span className="text">Dashboard</span>}
          </NavLink>
          <NavLink to="/admin/productos" className={({isActive})=>`admin-link ${isActive?'active':''}`} onClick={()=>setOpen(false)}>
            <span className="icon">🧁</span>
            {!collapsed && <span className="text">Productos</span>}
          </NavLink>
          <NavLink to="/admin/usuarios" className={({isActive})=>`admin-link ${isActive?'active':''}`} onClick={()=>setOpen(false)}>
            <span className="icon">👤</span>
            {!collapsed && <span className="text">Usuarios</span>}
          </NavLink>
          <NavLink to="/admin/contactos" className={({isActive})=>`admin-link ${isActive?'active':''}`} onClick={()=>setOpen(false)}>
            <span className="icon">✉️</span>
            {!collapsed && <span className="text">Contactos</span>}
          </NavLink>
        </nav>
        <div className="admin-sidebar-footer">
          {!collapsed && user && (
            <div className="userbox" title={`${user.nombre} (${user.rol})`}>
              <div className="name">{user.nombre}</div>
              <div className="role">{user.rol}</div>
            </div>
          )}
          <button className="btn btn-sidebar" type="button" onClick={logout} title="Cerrar sesión">⎋</button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div className="left">
            <button className="btn btn-icon d-md-none" type="button" onClick={toggleMobile} aria-label="Abrir menú" aria-expanded={open}>☰</button>
            <button className="btn btn-icon d-none d-md-inline-flex" type="button" onClick={toggleCollapse} aria-label="Colapsar barra">≡</button>
            <h1 className="page-title m-0">{titleFor(useLocation(), title)}</h1>
          </div>
          <div className="right">
            <span className="hint d-none d-sm-inline">Panel de administración</span>
          </div>
        </header>

        <main className="admin-content">
          <div className="admin-animate-in">
            <Outlet />
          </div>
        </main>
      </div>
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
