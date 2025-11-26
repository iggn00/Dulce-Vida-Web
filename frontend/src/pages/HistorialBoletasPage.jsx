import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/http';
import { Link } from 'react-router-dom';

export default function HistorialBoletasPage() {
  const { user, token } = useAuth();
  const [boletas, setBoletas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resumen, setResumen] = useState({});

  useEffect(() => {
    async function fetchBoletas() {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get('/boletas/mias?page=0&size=20');
        setBoletas(res.data.content || []);
        // Obtener resumen de productos por boleta
        const resumenObj = {};
        for (const b of res.data.content || []) {
          try {
            const detalles = await api.get(`/boletas/${b.idBoleta}/detalles`);
            resumenObj[b.idBoleta] = detalles.data.detalles?.length || 0;
          } catch {
            resumenObj[b.idBoleta] = 0;
          }
        }
        setResumen(resumenObj);
      } catch (err) {
        setError('No se pudo cargar boletas');
      } finally {
        setLoading(false);
      }
    }
    if (user) fetchBoletas();
  }, [user, token]);

  if (!user) {
    return <div>Debes iniciar sesión para ver tu historial de boletas.</div>;
  }

  return (
    <div className="container bg-crema p-4 rounded shadow">
      <h2 className="mb-4 text-cacao">Mis Boletas</h2>
      {loading && <p>Cargando...</p>}
      {error && <p style={{color:'red'}}>{error}</p>}
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle" style={{background:'var(--crema-clara)'}}>
          <thead className="bg-cacao text-white">
            <tr>
              <th>ID</th>
              <th>Correlativo</th>
              <th>Fecha</th>
              <th>Productos</th>
              <th>Subtotal</th>
              <th>IVA</th>
              <th>Total</th>
              <th>Detalle</th>
            </tr>
          </thead>
          <tbody>
            {boletas.map(b => (
              <tr key={b.idBoleta}>
                <td>{b.idBoleta}</td>
                <td>{b.numero}</td>
                <td>{new Date(b.fechaEmision).toLocaleString()}</td>
                <td>{resumen[b.idBoleta] ? `${resumen[b.idBoleta]} productos` : '-'}</td>
                <td>${b.subtotal}</td>
                <td>${b.iva}</td>
                <td>${b.total}</td>
                <td>
                  <Link to={`/boleta/${b.idBoleta}`} className="btn btn-dorado btn-sm">Ver Detalle</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
