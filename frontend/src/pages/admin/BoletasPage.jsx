import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/http';

function formatMoney(num) {
  return num ? num.toLocaleString('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }) : '$0';
}

function formatDate(date) {
  return new Date(date).toLocaleString('es-CL', { dateStyle: 'medium', timeStyle: 'short' });
}

function DetalleModal({ open, onClose, boleta }) {
  const [detalles, setDetalles] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (open && boleta) {
      setLoading(true);
      api.get(`/boletas/${boleta.idBoleta}/detalles`).then(res => {
        let arr = Array.isArray(res.data) ? res.data : (res.data?.detalles || res.data?.content || []);
        setDetalles(arr);
      }).finally(() => setLoading(false));
    } else {
      setDetalles([]);
    }
  }, [open, boleta]);
  if (!open || !boleta) return null;
  return (
    <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.3)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{background:'#fff',borderRadius:8,padding:24,minWidth:350,maxWidth:600,boxShadow:'0 2px 16px #0002',position:'relative'}}>
        <button onClick={onClose} style={{position:'absolute',top:8,right:8,fontSize:18,border:'none',background:'none',cursor:'pointer'}}>✕</button>
        <h3 style={{marginBottom:8}}>Detalle Boleta #{boleta.numero}</h3>
        <p><b>Fecha:</b> {formatDate(boleta.fechaEmision)}</p>
        <p><b>Total:</b> {formatMoney(boleta.total)}</p>
        {loading ? <p>Cargando productos...</p> : (
          <table style={{width:'100%',marginTop:12,borderCollapse:'collapse'}}>
            <thead>
              <tr style={{background:'#f5f5f5'}}>
                <th style={{padding:'8px'}}>Foto</th>
                <th style={{padding:'8px'}}>Producto</th>
                <th style={{padding:'8px'}}>Cantidad</th>
                <th style={{padding:'8px'}}>Unitario</th>
                <th style={{padding:'8px'}}>Total</th>
              </tr>
            </thead>
            <tbody>
              {detalles.map(d => (
                <tr key={d.idDetalleBoleta} style={{borderBottom:'1px solid #eee'}}>
                  <td style={{padding:'8px',textAlign:'center'}}>
                    {d.imagenUrl ? (
                      <img src={`/${d.imagenUrl}`} alt={d.nombreProducto || d.idProducto} style={{width:48,height:48,objectFit:'cover',borderRadius:6,boxShadow:'0 1px 4px #0001'}} />
                    ) : (
                      <span style={{fontSize:24,opacity:0.3}}>🖼️</span>
                    )}
                  </td>
                  <td style={{padding:'8px'}}><b>{d.nombreProducto || d.idProducto}</b></td>
                  <td style={{padding:'8px',textAlign:'center'}}>{d.cantidad}</td>
                  <td style={{padding:'8px',textAlign:'right'}}>{formatMoney(d.precioUnitario)}</td>
                  <td style={{padding:'8px',textAlign:'right'}}>{formatMoney(d.totalLinea)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {(!loading && detalles.length === 0) && <p style={{marginTop:16,color:'#888'}}>No hay productos en esta boleta.</p>}
      </div>
    </div>
  );
}

export default function BoletasPage() {
  const { user, token } = useAuth();
  const [boletas, setBoletas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalBoleta, setModalBoleta] = useState(null);

  useEffect(() => {
    async function fetchBoletas() {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get('/boletas/admin?page=0&size=20');
        setBoletas(res.data.content || []);
      } catch (err) {
        setError('No se pudo cargar boletas');
      } finally {
        setLoading(false);
      }
    }
    if (user && user.rol === 'ADMINISTRADOR') fetchBoletas();
  }, [user, token]);

  if (!user || user.rol !== 'ADMINISTRADOR') {
    return <div>No tienes permisos para ver esta página.</div>;
  }

  return (
    <div style={{padding:'2rem'}}>
      <h2 style={{marginBottom:'1rem'}}>Boletas (Historial Global)</h2>
      {loading && <p>Cargando...</p>}
      {error && <p style={{color:'red'}}>{error}</p>}
      <div style={{overflowX:'auto'}}>
        <table style={{borderCollapse:'collapse',width:'100%',background:'#fff',boxShadow:'0 2px 8px #0001',borderRadius:8}}>
          <thead style={{background:'#f5f5f5'}}>
            <tr>
              <th style={{padding:'8px 12px'}}>ID</th>
              <th style={{padding:'8px 12px'}}>Correlativo</th>
              <th style={{padding:'8px 12px'}}>Fecha</th>
              <th style={{padding:'8px 12px'}}>Subtotal</th>
              <th style={{padding:'8px 12px'}}>IVA</th>
              <th style={{padding:'8px 12px'}}>Total</th>
              <th style={{padding:'8px 12px'}}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {boletas.map(b => (
              <tr key={b.idBoleta} style={{borderBottom:'1px solid #eee'}}>
                <td style={{padding:'8px 12px'}}>{b.idBoleta}</td>
                <td style={{padding:'8px 12px'}}>{b.numero}</td>
                <td style={{padding:'8px 12px'}}>{formatDate(b.fechaEmision)}</td>
                <td style={{padding:'8px 12px'}}>{formatMoney(b.subtotal)}</td>
                <td style={{padding:'8px 12px'}}>{formatMoney(b.iva)}</td>
                <td style={{padding:'8px 12px'}}>{formatMoney(b.total)}</td>
                <td style={{padding:'8px 12px'}}>
                  <button onClick={() => setModalBoleta(b)} style={{background:'#6c63ff',color:'#fff',border:'none',borderRadius:4,padding:'6px 12px',cursor:'pointer'}}>Ver detalles</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <DetalleModal open={!!modalBoleta} onClose={() => setModalBoleta(null)} boleta={modalBoleta} />
    </div>
  );
}
