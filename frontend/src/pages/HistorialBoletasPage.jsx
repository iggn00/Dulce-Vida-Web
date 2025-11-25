import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/http';
import { Link } from 'react-router-dom';

export default function HistorialBoletasPage() {
  const { user, token } = useAuth();
  const [boletas, setBoletas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBoletas() {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get('/boletas/mias?page=0&size=20');
        setBoletas(res.data.content || []);
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
    <div>
      <h2>Mis Boletas</h2>
      {loading && <p>Cargando...</p>}
      {error && <p style={{color:'red'}}>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Correlativo</th>
            <th>Fecha</th>
            <th>Subtotal</th>
            <th>IVA</th>
            <th>Total</th>
            <th>Ver</th>
          </tr>
        </thead>
        <tbody>
          {boletas.map(b => (
            <tr key={b.idBoleta}>
              <td>{b.idBoleta}</td>
              <td>{b.numero}</td>
              <td>{new Date(b.fechaEmision).toLocaleString()}</td>
              <td>${b.subtotal}</td>
              <td>${b.iva}</td>
              <td>${b.total}</td>
              <td><Link to={`/boleta/${b.idBoleta}`}>Ver</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
