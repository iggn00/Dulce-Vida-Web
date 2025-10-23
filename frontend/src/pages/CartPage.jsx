import { useCart } from '../context/CartContext.jsx'

export default function CartPage() {
  const { items, total, removeItem, clear } = useCart()
  const pagar = async () => {
    // Simula pago: muestra mensaje y limpia carrito (backend + frontend)
    try {
      alert('Pago simulado con éxito. ¡Gracias por tu compra!')
      await clear()
    } catch (e) {
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
                <thead><tr><th>Producto</th><th className="text-end">Precio</th><th></th></tr></thead>
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
                      <td className="text-end">{new Intl.NumberFormat('es-CL',{style:'currency',currency:'CLP',maximumFractionDigits:0}).format(it.price)}</td>
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
