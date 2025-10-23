export default function ProductCard({ product, onAdd, onViewDetail, disabledAdd = false }) {
  const priceText = new Intl.NumberFormat('es-CL', {
    style: 'currency', currency: 'CLP', minimumFractionDigits: 0, maximumFractionDigits: 0
  }).format(product.price || 0)
  const src = product.image || `https://picsum.photos/seed/prod-${product.id}/600/400`
  return (
    <div className="col">
      <div className="card h-100 tarjeta-producto" style={{ cursor: 'pointer' }} onClick={() => onViewDetail?.(product)}>
        <div className="imagen-producto d-flex align-items-center justify-content-center">
          <img src={src} alt={product.title || 'Producto'} onError={(e)=>{ e.currentTarget.src = `https://picsum.photos/seed/prod-${product.id}/600/400` }} />
        </div>
        <div className="card-body">
          <div className="fw-semibold">{product.title}</div>
          <div className="small text-muted">{product.attributes || ''}</div>
          {product.ingredientes && (
            <div className="small text-secondary mt-1" title={product.ingredientes}>
              {(product.ingredientes.length > 70) ? product.ingredientes.slice(0,70) + '…' : product.ingredientes}
            </div>
          )}
        </div>
        <div className="card-footer bg-transparent border-0 pt-0">
          <div className="d-flex justify-content-between align-items-center">
            <span className="fw-semibold">{priceText}</span>
            <button 
              type="button" 
              className="btn btn-sm btn-dorado" 
              onClick={(e) => {
                e.stopPropagation()
                onAdd?.(product)
              }}
              disabled={disabledAdd}
            >
              {disabledAdd ? 'Límite' : 'Añadir'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}