import { useState } from 'react'
import { api } from '../services/http.js'

export default function ContactoPage() {
  const [alerta, setAlerta] = useState(null)
  const [form, setForm] = useState({ nombre: '', email: '', asunto: '', mensaje: '' })

  const onSubmit = async (e) => {
    e.preventDefault()
    // Validación simple en el cliente; no hay backend de contacto aún
    if (!form.nombre || form.nombre.length < 3) return setAlerta({ tipo: 'danger', msg: 'Ingresa tu nombre (mínimo 3 caracteres).' })
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(form.email)) return setAlerta({ tipo: 'danger', msg: 'Ingresa un correo válido.' })
    if (!form.mensaje) return setAlerta({ tipo: 'danger', msg: 'Escribe tu mensaje.' })
    try {
      await api.post('/contactos', form)
      setAlerta({ tipo: 'success', msg: 'Mensaje enviado. Te contactaremos pronto.' })
      setForm({ nombre: '', email: '', asunto: '', mensaje: '' })
    } catch (err) {
      setAlerta({ tipo: 'danger', msg: 'No pudimos enviar tu mensaje. Intenta nuevamente.' })
    }
  }

  return (
    <div className="mt-1">
      <section className="py-4 text-center">
        <h1 className="display-6 fw-bold mb-2">Contáctanos</h1>
        <p className="text-muted mb-0">¿Tienes un pedido especial, dudas o quieres cotizar? Estamos para ayudarte.</p>
      </section>

      <section className="py-3">
        <div className="row g-4 align-items-stretch">
          <div className="col-12 col-lg-5">
            <div className="h-100 p-4 tarjeta-formulario rounded">
              <h2 className="h5 fw-bold mb-3">Información</h2>
              <ul className="list-unstyled small mb-4">
                <li className="mb-2"><strong>Email:</strong> contacto@dulcevida.cl</li>
                <li className="mb-2"><strong>Teléfono:</strong> +56 9 1234 5678</li>
                <li className="mb-2"><strong>Horario:</strong> Lun a Vie, 09:00 a 18:00</li>
                <li className="mb-0"><strong>Dirección:</strong> Santiago, Chile</li>
              </ul>
              <div className="d-flex align-items-center gap-3">
                <a href="#" aria-label="Instagram"><img src="/img/misc/instagram.png" height="28" alt="Instagram" /></a>
                <a href="#" aria-label="TikTok"><img src="/img/misc/tiktok.png" height="28" alt="TikTok" /></a>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-7">
            <div className="h-100 p-4 tarjeta-formulario rounded position-relative">
              <div className="position-absolute top-0 start-0 end-0 rounded-top" style={{height: 10, background: 'var(--crema-clara)'}}></div>
              <h2 className="h5 fw-bold mb-3">Formulario de contacto</h2>
              {alerta && <div className={`alert alert-${alerta.tipo}`} role="alert">{alerta.msg}</div>}
              <form onSubmit={onSubmit} noValidate>
                <div className="mb-3">
                  <label className="form-label">Nombre completo</label>
                  <input type="text" className="form-control" value={form.nombre} onChange={(e)=>setForm({...form, nombre: e.target.value})} required minLength={3} placeholder="Ej. María Pérez" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Correo</label>
                  <input type="email" className="form-control" value={form.email} onChange={(e)=>setForm({...form, email: e.target.value})} required placeholder="nombre@correo.com" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Asunto</label>
                  <input type="text" className="form-control" value={form.asunto} onChange={(e)=>setForm({...form, asunto: e.target.value})} placeholder="Ej. Cotización de torta" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Mensaje</label>
                  <textarea className="form-control" rows={5} value={form.mensaje} onChange={(e)=>setForm({...form, mensaje: e.target.value})} required placeholder="Cuéntanos en qué te ayudamos"></textarea>
                </div>
                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-dorado">Enviar mensaje</button>
                  <button type="button" className="btn btn-outline-secondary" onClick={()=>{ setForm({ nombre:'', email:'', asunto:'', mensaje:''}); setAlerta(null); }}>Limpiar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
