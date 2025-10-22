import { useEffect } from 'react'

export default function ProductDetailModal({ product, isOpen, onClose, onAdd }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen])

  if (!isOpen || !product) return null

  const priceText = new Intl.NumberFormat('es-CL', {
    style: 'currency', currency: 'CLP', minimumFractionDigits: 0, maximumFractionDigits: 0
  }).format(product.price || 0)
  
  const src = product.image || `https://picsum.photos/seed/prod-${product.id}/800/600`

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
      <div className="modal-dialog modal-dialog-centered modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">
          <div className="modal-header border-0">
            <h5 className="modal-title fw-bold">{product.title}</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Cerrar"></button>
          </div>
          <div className="modal-body">
            <div className="row g-4">
              {/* Imagen del producto */}
              <div className="col-md-6">
                <div className="ratio ratio-4x3 rounded overflow-hidden shadow-sm">
                  <img 
                    src={src} 
                    alt={product.title} 
                    className="object-fit-cover w-100"
                    onError={(e) => { e.currentTarget.src = `https://picsum.photos/seed/prod-${product.id}/800/600` }}
                  />
                </div>
              </div>

              {/* Detalles del producto */}
              <div className="col-md-6">
                <div className="mb-3">
                  <span className="badge bg-secondary mb-2">{product.category || 'Producto'}</span>
                  <h4 className="mb-3 text-dorado fw-bold">{priceText}</h4>
                </div>

                <div className="mb-3">
                  <h6 className="fw-semibold text-muted mb-2">Descripción</h6>
                  <p className="text-secondary mb-0">{product.attributes || 'Delicioso producto de nuestra pastelería artesanal.'}</p>
                </div>

                {product.stock !== undefined && (
                  <div className="mb-3">
                    <h6 className="fw-semibold text-muted mb-2">Disponibilidad</h6>
                    <p className="mb-0">
                      {product.stock > 0 ? (
                        <span className="text-success">
                          <i className="bi bi-check-circle-fill me-1"></i>
                          En stock ({product.stock} unidades)
                        </span>
                      ) : (
                        <span className="text-danger">
                          <i className="bi bi-x-circle-fill me-1"></i>
                          Agotado
                        </span>
                      )}
                    </p>
                  </div>
                )}

                <div className="mb-3">
                  <h6 className="fw-semibold text-muted mb-2">Características</h6>
                  <ul className="list-unstyled small text-secondary">
                    <li><i className="bi bi-check2 text-success me-2"></i>Elaborado con ingredientes frescos</li>
                    <li><i className="bi bi-check2 text-success me-2"></i>Preparación artesanal</li>
                    <li><i className="bi bi-check2 text-success me-2"></i>Disponible para pedidos personalizados</li>
                  </ul>
                </div>

                {product.ingredientes && (
                  <div className="mb-3">
                    <h6 className="fw-semibold text-muted mb-2">Ingredientes principales</h6>
                    <p className="small text-secondary">{product.ingredientes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="modal-footer border-0 justify-content-between">
            <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
              Cerrar
            </button>
            <button 
              type="button" 
              className="btn btn-dorado btn-lg px-4" 
              onClick={() => {
                onAdd?.(product)
                onClose()
              }}
              disabled={product.stock === 0}
            >
              <i className="bi bi-cart-plus me-2"></i>
              Añadir al carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
