import { useEffect } from 'react'

export default function Modal({ open, title, onClose, children, footer }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose?.() }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
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
}
