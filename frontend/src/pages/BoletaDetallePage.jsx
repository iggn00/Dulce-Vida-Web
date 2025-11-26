import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Agregamos useNavigate
import { api } from '../services/http';

export default function BoletaDetallePage() {
    const { id } = useParams();
    const navigate = useNavigate(); // Para el botón de volver

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
                console.error(err);
                setError('No se pudo cargar la boleta. Intenta nuevamente.');
            } finally {
                setLoading(false);
            }
        }

        if (id) fetchDetalle();
    }, [id]);

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{height: '60vh'}}>
            <div className="spinner-border text-warning" role="status">
                <span className="visually-hidden">Cargando...</span>
            </div>
        </div>
    );

    if (error) return (
        <div className="container mt-5">
            <div className="alert alert-danger shadow-sm">{error}</div>
        </div>
    );

    if (!boleta) return (
        <div className="container mt-5">
            <div className="alert alert-warning">No se encontró la boleta.</div>
        </div>
    );

    return (
        <div className="container py-5">
            {/* Botón Volver */}
            <button onClick={() => navigate(-1)} className="btn btn-link text-decoration-none mb-3 ps-0">
                <i className="bi bi-arrow-left"></i> &larr; Volver atrás
            </button>

            <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
                {/* Encabezado de la Boleta */}
                <div className="card-header bg-dark text-white p-4 d-flex justify-content-between align-items-center">
                    <div>
                        <h6 className="text-uppercase text-white-50 mb-1">Comprobante de compra</h6>
                        <h2 className="mb-0 fw-bold">Boleta #{boleta.numero}</h2>
                    </div>
                    <div className="text-end">
                        <div className="badge bg-success fs-6 mb-2">Pagada</div>
                        <p className="mb-0 opacity-75">{new Date(boleta.fechaEmision).toLocaleDateString()} {new Date(boleta.fechaEmision).toLocaleTimeString()}</p>
                    </div>
                </div>

                <div className="card-body p-4 p-md-5">
                    {/* Tabla de Productos */}
                    <div className="table-responsive mb-4">
                        <table className="table table-hover align-middle">
                            <thead className="table-light text-secondary text-uppercase small">
                            <tr>
                                <th scope="col" className="py-3">Producto</th>
                                <th scope="col" className="text-center py-3">Cant.</th>
                                <th scope="col" className="text-end py-3">Precio Unit.</th>
                                <th scope="col" className="text-end py-3">Total</th>
                            </tr>
                            </thead>
                            <tbody>
                            {detalles.map(d => (
                                <tr key={d.idDetalleBoleta}>
                                    <td className="py-3">
                                        <div className="fw-bold text-dark">{d.producto.nombre}</div>
                                        {/* Si tienes descripción corta del producto, podrías ponerla aquí en pequeño */}
                                    </td>
                                    <td className="text-center py-3">
                                        <span className="badge bg-light text-dark border">{d.cantidad}</span>
                                    </td>
                                    <td className="text-end py-3 text-muted">
                                        ${d.precioUnitario.toLocaleString('es-CL')}
                                    </td>
                                    <td className="text-end py-3 fw-bold">
                                        ${d.totalLinea.toLocaleString('es-CL')}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Sección de Totales */}
                    <div className="row justify-content-end">
                        <div className="col-md-5 col-lg-4">
                            <div className="bg-light p-3 rounded-3">
                                <div className="d-flex justify-content-between mb-2 text-muted">
                                    <span>Subtotal:</span>
                                    <span>${boleta.subtotal.toLocaleString('es-CL')}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-3 text-muted">
                                    <span>IVA (19%):</span>
                                    <span>${boleta.iva.toLocaleString('es-CL')}</span>
                                </div>
                                <div className="border-top pt-3 d-flex justify-content-between align-items-center">
                                    <span className="h5 mb-0">Total a Pagar</span>
                                    <span className="h4 mb-0 text-dark fw-bold">${boleta.total.toLocaleString('es-CL')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pie de la tarjeta */}
                <div className="card-footer bg-white border-top-0 p-4 text-center">
                    <p className="text-muted small mb-0">Gracias por preferir Dulce Vida 🍰</p>
                </div>
            </div>
        </div>
    );
}