import React from 'react'

export default function EditDrawer({ title = 'Editar', open = false, onClose, children, actions }){
  return (
    <>
      <div className={`edit-drawer ${open ? 'is-open' : ''}`} role="dialog" aria-modal="true" aria-labelledby="edit-drawer-title">
        <div className="edit-drawer-card">
          <div className="edit-drawer-header">
            <h3 id="edit-drawer-title" className="m-0">{title}</h3>
            <button type="button" className="btn btn-icon" aria-label="Cerrar" onClick={onClose}>✕</button>
          </div>
          <div className="edit-drawer-body">
            {children}
          </div>
          {actions && (
            <div className="edit-drawer-footer">
              {actions}
            </div>
          )}
        </div>
      </div>
      {/* Backdrop */}
      <div className={`edit-drawer-backdrop ${open ? 'is-open' : ''}`} onClick={onClose} aria-hidden={!open} />
    </>
  )
}
