import { useEffect } from 'react'
import { createPortal } from 'react-dom'

export default function Modal({ open, title, onClose, children, footer }) {
  // Cerrar con ESC y bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose?.() }
    if (open) document.addEventListener('keydown', onKey)
    // Scroll lock
    const prev = document.body.style.overflow
    if (open) document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  const modalRootId = 'admin-modal-root'
  let root = typeof document !== 'undefined' ? document.getElementById(modalRootId) : null
  if (typeof document !== 'undefined' && !root) {
    root = document.createElement('div')
    root.id = modalRootId
    document.body.appendChild(root)
  }

  const modalEl = (
    <div className={`admin-modal ${open ? 'is-open' : ''}`} aria-hidden={!open}>
      <div className="admin-modal-backdrop" onClick={onClose} />
      <div className="admin-modal-card" role="dialog" aria-modal="true" aria-label={title || 'Modal'}>
        <div className="admin-modal-header">
          <h3 className="m-0">{title}</h3>
          <button type="button" className="btn" onClick={onClose}>Cerrar</button>
        </div>
        <div className="admin-modal-body">{children}</div>
        {footer && <div className="admin-modal-footer">{footer}</div>}
      </div>
    </div>
  )

  // Renderizar siempre a nivel del body para evitar que el layout de la lista lo afecte
  return root ? createPortal(modalEl, root) : modalEl
}
