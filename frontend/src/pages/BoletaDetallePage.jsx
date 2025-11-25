import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/http';

export default function BoletaDetallePage() {
  const { id } = useParams();
  const { token } = useAuth();
  const [boleta, setBoleta] = useState(null);
  const [detalles, setDetalles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDetalle() {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/boletas/${id}/detalles`);
        setBoleta(res.data.boleta);
        setDetalles(res.data.detalles);
      } catch (err) {
        setError('No se pudo cargar la boleta');
      } finally {
        setLoading(false);
      }
    }
    if (id && token) fetchDetalle();
  }, [id, token]);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p style={{color:'red'}}>{error}</p>;
  if (!boleta) return <p>No se encontró la boleta.</p>;

  return (
    <div>
      <h2>Boleta #{boleta.numero}</h2>
      <p><b>Fecha:</b> {new Date(boleta.fechaEmision).toLocaleString()}</p>
      <table>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Total Línea</th>
          </tr>
        </thead>
        <tbody>
          {detalles.map(d => (
            <tr key={d.idDetalleBoleta}>
              <td>{d.producto.nombre}</td>
              <td>{d.cantidad}</td>
              <td>${d.precioUnitario}</td>
              <td>${d.totalLinea}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p><b>Subtotal:</b> ${boleta.subtotal}</p>
      <p><b>IVA (19%):</b> ${boleta.iva}</p>
      <p><b>Total:</b> ${boleta.total}</p>
    </div>
  );
}
