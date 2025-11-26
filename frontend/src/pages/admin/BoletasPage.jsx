import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAllBoletas, getBoletaDetalles } from '../../services/api';
import AdminDetalleBoleta from '../../components/admin/AdminDetalleBoleta';

export default function BoletasPage() {
    const { user } = useAuth();
    const [boletas, setBoletas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedBoleta, setSelectedBoleta] = useState(null);
    const [detallesBoleta, setDetallesBoleta] = useState([]);
    const [loadingDetalle, setLoadingDetalle] = useState(false);

    useEffect(() => {
        if (user?.rol === 'ADMINISTRADOR') {
            cargarBoletas();
        }
    }, [user]);

    const cargarBoletas = async () => {
        setLoading(true);
        try {
            const data = await getAllBoletas(0, 50);
            setBoletas(data.content || data || []);
        } catch (err) {
            console.error(err);
            setError('No se pudo cargar el historial de boletas.');
        } finally {
            setLoading(false);
        }
    };

    const abrirDetalle = async (boleta) => {
        setLoadingDetalle(true);
        try {
            const data = await getBoletaDetalles(boleta.idBoleta);

            setSelectedBoleta(data.boleta);
            setDetallesBoleta(data.detalles);
        } catch (err) {
            alert("Error al cargar los detalles de la boleta.");
        } finally {
            setLoadingDetalle(false);
        }
    };

    const cerrarModal = () => {
        setSelectedBoleta(null);
        setDetallesBoleta([]);
    };

    if (!user || user.rol !== 'ADMINISTRADOR') {
        return <div className="container py-5 text-center text-danger"><h3>Acceso Denegado</h3></div>;
    }

    return (
        <div className="container-fluid py-4 bg-light min-vh-100">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold text-dark mb-1">
                        <i className="bi bi-receipt-cutoff me-2 text-primary"></i>
                        Gestión de Boletas
                    </h2>
                    <p className="text-muted mb-0">Historial completo de ventas y facturación</p>
                </div>
                <button onClick={cargarBoletas} className="btn btn-outline-secondary btn-sm">
                    <i className="bi bi-arrow-clockwise me-1"></i> Actualizar
                </button>
            </div>

            {error && <div className="alert alert-danger shadow-sm border-0">{error}</div>}

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="mt-2 text-muted">Cargando registros...</p>
                </div>
            ) : (
                <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="bg-light text-secondary text-uppercase small">
                            <tr>
                                <th className="ps-4 py-3">Folio</th>
                                <th className="py-3">Fecha Emisión</th>
                                <th className="py-3">Cliente</th>
                                <th className="py-3">Ubicación</th>
                                <th className="text-end py-3">Monto Total</th>
                                <th className="text-end pe-4 py-3">Acciones</th>
                            </tr>
                            </thead>
                            <tbody className="border-top-0">
                            {boletas.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-5 text-muted">
                                        No se encontraron boletas registradas.
                                    </td>
                                </tr>
                            ) : (
                                boletas.map((b) => (
                                    <tr key={b.idBoleta}>
                                        <td className="ps-4 fw-bold text-dark">#{b.numero}</td>
                                        <td className="text-muted small">
                                            <i className="bi bi-calendar3 me-1"></i>
                                            {new Date(b.fechaEmision).toLocaleDateString()} <br/>
                                            <span className="text-secondary ms-3">
                           {new Date(b.fechaEmision).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                                        </td>
                                        <td>
                                            <div className="d-flex flex-column">
                          <span className="fw-medium text-dark">
                            {b.pedido?.cliente?.nombre || 'Cliente Web'}
                          </span>
                                                <span className="small text-muted">
                            {b.pedido?.cliente?.email || 'Sin correo'}
                          </span>
                                                {b.pedido?.cliente?.rut && (
                                                    <span className="badge bg-light text-secondary border mt-1" style={{width: 'fit-content'}}>
                              {b.pedido.cliente.rut}-{b.pedido.cliente.dv}
                            </span>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="small text-secondary">
                                                <div>{b.pedido?.cliente?.region || '-'}</div>
                                                <div>{b.pedido?.cliente?.comuna || '-'}</div>
                                            </div>
                                        </td>
                                        <td className="text-end fw-bold text-success fs-6">
                                            ${b.total?.toLocaleString('es-CL')}
                                        </td>
                                        <td className="text-end pe-4">
                                            <button
                                                className="btn btn-sm btn-outline-primary rounded-pill px-3 hover-shadow"
                                                onClick={() => abrirDetalle(b)}
                                                disabled={loadingDetalle}
                                            >
                                                <i className="bi bi-eye me-1"></i> Ver Detalle
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {selectedBoleta && (
                <AdminDetalleBoleta
                    boleta={selectedBoleta}
                    detalles={detallesBoleta}
                    onClose={cerrarModal}
                />
            )}
        </div>
    );
}