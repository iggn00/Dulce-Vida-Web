import { useEffect, useMemo, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { api } from '../../services/http'
import { useAuth } from '../../context/AuthContext.jsx'

export default function DashboardPage() {
  const { user } = useAuth()
  const [usuarios, setUsuarios] = useState(0)
  const [productos, setProductos] = useState(0)
  const [bajoStock, setBajoStock] = useState(0)
  const [contactos, setContactos] = useState(0)
  const [loading, setLoading] = useState(true)
  const [ts, setTs] = useState(() => new Date())

  useEffect(() => {
    async function cargar() {
      setLoading(true)
      try {
        const [u, p, bs, c] = await Promise.all([
          api.get('/usuarios').catch(()=>({data:[]})),
          api.get('/productos').catch(()=>({data:[]})),
          api.get('/productos/bajo-stock?umbral=5').catch(()=>({data:[]})),
          api.get('/contactos').catch(()=>({data:[]})),
        ])
        setUsuarios(Array.isArray(u.data)? u.data.length : 0)
        setProductos(Array.isArray(p.data)? p.data.length : 0)
        setBajoStock(Array.isArray(bs.data)? bs.data.length : 0)
        setContactos(Array.isArray(c.data)? c.data.length : 0)
        setTs(new Date())
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    cargar()
  }, [])

  return (
    <div className="dash-page">
      <h2 className="dash-title">Bienvenido{user?.nombre ? ',' : ''} <span>{user?.nombre || ''}</span></h2>
      {loading ? (
        <div className="cards-hero">
          <div className="dash-card skeleton"/>
          <div className="dash-card skeleton"/>
          <div className="dash-card skeleton"/>
          <div className="dash-card skeleton"/>
        </div>
      ) : (
        <div className="cards-hero">
            <HeroNavCard to="/admin/usuarios" variant="violeta" icon="👤" title="Usuarios" value={usuarios} />
            <HeroNavCard to="/admin/productos" variant="azul" icon="🧁" title="Productos" value={productos} />
            <HeroNavCard to="/admin/productos" variant="verde" icon="📦" title="Inventario" subtitle="Bajo stock" value={bajoStock} />
            <HeroNavCard to="/admin/contactos" variant="oro" icon="✉️" title="Contactos" value={contactos} />
            <HeroNavCard to="/admin/boletas" variant="dorado" icon="🧾" title="Boletas" subtitle="Historial" value={0} />
        </div>
      )}
      <div className="muted small" style={{marginTop:'.75rem'}}>Última actualización: {ts.toLocaleString()}</div>
    </div>
  )
}
function CountUp({ to = 0, duration = 650 }){
  const [val, setVal] = useState(0)
  const raf = useRef(0)
  const start = useRef(0)
  const from = useRef(0)
  const d = useMemo(()=>Math.max(200, duration),[duration])
  useEffect(()=>{
    cancelAnimationFrame(raf.current)
    from.current = 0
    start.current = performance.now()
    const tick = (t) => {
      const p = Math.min(1, (t - start.current) / d)
      const eased = 1 - Math.pow(1 - p, 3)
      const cur = Math.round(from.current + (to - from.current) * eased)
      setVal(cur)
      if (p < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [to, d])
  return <span>{val}</span>
}

function HeroCard({ to, variant = 'violeta', icon, title, subtitle, value }){
  const target = Math.max(0, Number(value) || 0)
  return (
    <a href={to} className={`dash-card ${variant}`}>
      <div className="dash-card-icon" aria-hidden>{icon}</div>
      <div className="dash-card-body">
        <div className="dash-card-title">{title}</div>
        {subtitle && <div className="dash-card-subtitle">{subtitle}</div>}
        <div className="dash-card-value"><CountUp to={target} /></div>
      </div>
    </a>
  )}


function HeroNavCard({ to, variant = 'violeta', icon, title, subtitle, value }){
  const target = Math.max(0, Number(value) || 0)
  return (
    <NavLink to={to} className={`dash-card ${variant}`}>
      <div className="dash-card-icon" aria-hidden>{icon}</div>
      <div className="dash-card-body">
        <div className="dash-card-title">{title}</div>
        {subtitle && <div className="dash-card-subtitle">{subtitle}</div>}
        <div className="dash-card-value"><CountUp to={target} /></div>
      </div>
    </NavLink>
  )}