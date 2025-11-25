import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/http';

export default function BoletasPage() {
  const { user, token } = useAuth();
  const [boletas, setBoletas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    <div>
      <h2>Boletas (Historial Global)</h2>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
