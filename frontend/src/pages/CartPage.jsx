import { useCart } from '../context/CartContext.jsx'

export default function CartPage() {
  const { items, total, removeItem, updateQuantity, clear, checkout } = useCart()
  const pagar = async () => {
    try {
      const data = await checkout()
      const totalFmt = new Intl.NumberFormat('es-CL',{style:'currency',currency:'CLP',maximumFractionDigits:0}).format(Number(data?.total||0))
      alert(`Pedido #${data?.pedidoId} confirmado. Total: ${totalFmt}. ¡Gracias por tu compra!`)
    } catch (e) {
      const msg = e?.response?.data?.error || 'No pudimos finalizar tu compra.'
      alert(msg)
      console.error(e)
    }
  }
  return (
    <div className="page page-cart">
      <h1 className="h4 mb-3">Carrito</h1>
      {items.length === 0 ? (
        <p className="text-muted">Tu carrito está vacío.</p>
      ) : (
        <div className="row g-3">
          <div className="col-12 col-lg-8">
            <div className="table-responsive cart-card">
              <table className="table align-middle">
                <thead><tr><th>Producto</th><th style={{width:140}}>Cantidad</th><th className="text-end">Subtotal</th><th></th></tr></thead>
                <tbody>
                  {items.map(it => (
                    <tr key={it.id}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <img src={it.image} alt={it.title} width={56} height={56} className="object-fit-cover rounded" />
                          <div>
                            <div className="fw-semibold">{it.title}</div>
                            <div className="small text-muted">{it.attributes}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="d-inline-flex align-items-center gap-1">
                          <button className="btn btn-sm btn-outline-secondary" type="button" disabled={(Number(it.cantidad)||0) <= 1} onClick={()=> updateQuantity(it.id, Math.max(0, Number(it.cantidad||0)-1)) }>-</button>
                          <input className="form-control form-control-sm text-center" style={{width:64}} type="number" min="0" value={it.cantidad} onChange={(e)=>{
                            const v = parseInt(e.target.value, 10)
                            if (Number.isNaN(v)) return
                            updateQuantity(it.id, v)
                          }} />
                          <button className="btn btn-sm btn-outline-secondary" type="button" disabled={typeof it.stock === 'number' && (Number(it.cantidad)||0) >= it.stock} onClick={()=> updateQuantity(it.id, Number(it.cantidad||0)+1) }>+</button>
                        </div>
                      </td>
                      <td className="text-end">{new Intl.NumberFormat('es-CL',{style:'currency',currency:'CLP',maximumFractionDigits:0}).format((Number(it.price)||0) * (Number(it.cantidad)||0))}</td>
                      <td className="text-end"><button className="btn btn-sm btn-outline-danger" onClick={()=>removeItem(it.id)}>Quitar</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="col-12 col-lg-4">
            <div className="card resumen-compra position-sticky" style={{top: 80}}>
              <div className="card-body">
                <div className="d-flex justify-content-between mb-2"><span>Total</span><strong>{new Intl.NumberFormat('es-CL',{style:'currency',currency:'CLP',maximumFractionDigits:0}).format(total)}</strong></div>
                <div className="d-flex gap-2">
                  <button className="btn btn-success w-100" id="btn-pagar" type="button" onClick={pagar}>Pagar</button>
                  <button className="btn btn-outline-secondary" type="button" onClick={clear}>Vaciar</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
