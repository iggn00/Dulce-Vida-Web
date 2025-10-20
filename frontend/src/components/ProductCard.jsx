export default function ProductCard({ product, onAdd }) {
  const priceText = new Intl.NumberFormat('es-CL', {
    style: 'currency', currency: 'CLP', minimumFractionDigits: 0, maximumFractionDigits: 0
  }).format(product.price || 0)
  const src = product.image || `https://picsum.photos/seed/prod-${product.id}/600/400`
  return (
    <div className="col">
      <div className="card h-100 tarjeta-producto">
        <a href="#" className="imagen-producto d-flex align-items-center justify-content-center" onClick={(e) => e.preventDefault()}>
          <img src={src} alt={product.title || 'Producto'} onError={(e)=>{ e.currentTarget.src = `https://picsum.photos/seed/prod-${product.id}/600/400` }} />
        </a>
        <div className="card-body">
          <div className="fw-semibold">{product.title}</div>
          <div className="small text-muted">{product.attributes || ''}</div>
        </div>
        <div className="card-footer bg-transparent border-0 pt-0">
          <div className="d-flex justify-content-between align-items-center">
            <span className="fw-semibold">{priceText}</span>
            <button type="button" className="btn btn-sm btn-dorado" onClick={() => onAdd?.(product)}>Añadir</button>
          </div>
        </div>
      </div>
    </div>
  )
}