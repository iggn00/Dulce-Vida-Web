import React, { useState, useEffect } from 'react';
// Importamos las funciones específicas del servicio como hace el test
import { getMyBoletas, getBoletaDetalles } from '../services/api';

function HistorialComprasPage() {
    const [boletas, setBoletas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // Estados para el detalle
    const [detalleId, setDetalleId] = useState(null);
    const [detallesData, setDetallesData] = useState(null);
    const [loadingDetalle, setLoadingDetalle] = useState(false);

    // 1. Efecto para cargar las boletas al iniciar o cambiar de página
    useEffect(() => {
        cargarDatos(page);
    }, [page]);

    const cargarDatos = async (pagina) => {
        setLoading(true);
        try {
            // Llamamos al servicio mockeado en el test
            const data = await getMyBoletas(pagina);
            setBoletas(data.content || []);
            setTotalPages(data.totalPages || 1);
        } catch (error) {
            console.error("Error al cargar historial:", error);
            setBoletas([]);
        } finally {
            setLoading(false);
        }
    };

    // 2. Lógica para ver detalles
    const handleVerDetalles = async (idBoleta) => {
        setDetalleId(idBoleta);
        setLoadingDetalle(true);
        setDetallesData(null); // Limpiamos datos previos
        try {
            const data = await getBoletaDetalles(idBoleta);
            setDetallesData(data);
        } catch (error) {
            console.error("Error al cargar detalles:", error);
        } finally {
            setLoadingDetalle(false);
        }
    };

    const handleCerrarDetalles = () => {
        setDetalleId(null);
        setDetallesData(null);
    };

    // Renderizado condicional para el test "Cargando..."
    if (loading) return <div>Cargando...</div>;

    return (
        <div>
            <h2>Historial de Compras</h2>

            {(!boletas || boletas.length === 0) ? (
                <p>No hay compras registradas.</p>
            ) : (
                <div className="lista-boletas">
                    {boletas.map(boleta => (
                        <div key={boleta.idBoleta} className="boleta-card" style={{ border: '1px solid #ddd', padding: '1rem', marginBottom: '1rem' }}>
                            {/* El test busca texto "/Boleta #numero/" */}
                            <h3>Boleta #{boleta.numero}</h3>
                            <p>Fecha: {new Date(boleta.fechaEmision).toLocaleDateString()}</p>
                            <p>Total: ${boleta.total}</p>

                            {/* El test busca un botón con nombre exacto "Ver Detalles" */}
                            <button onClick={() => handleVerDetalles(boleta.idBoleta)}>
                                Ver Detalles
                            </button>

                            {/* Panel de Detalles */}
                            {detalleId === boleta.idBoleta && (
                                <div className="detalle-compra" style={{ marginTop: '10px', background: '#f9f9f9', padding: '10px' }}>
                                    {loadingDetalle ? (
                                        <p>Cargando detalles...</p>
                                    ) : detallesData ? (
                                        <>
                                            <h4>Productos:</h4>
                                            <ul>
                                                {detallesData.detalles && detallesData.detalles.map(d => (
                                                    <li key={d.idDetalleBoleta}>
                                                        {d.producto.nombre} - Cantidad: {d.cantidad} - Total: ${d.totalLinea}
                                                    </li>
                                                ))}
                                            </ul>
                                            {/* El test espera ver "Subtotal:" */}
                                            <p><strong>Subtotal:</strong> ${detallesData.boleta.subtotal}</p>

                                            {/* El test busca y clickea un botón "Cerrar" */}
                                            <button onClick={handleCerrarDetalles} style={{ marginTop: '10px' }}>
                                                Cerrar
                                            </button>
                                        </>
                                    ) : (
                                        <p>No se pudo cargar la información.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Controles de Paginación requeridos por el test */}
                    <div className="paginacion" style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                        <button
                            onClick={() => setPage(p => p - 1)}
                            disabled={page === 0}
                        >
                            Anterior
                        </button>
                        <span>Página {page + 1} de {totalPages}</span>
                        <button
                            onClick={() => setPage(p => p + 1)}
                            disabled={page >= totalPages - 1}
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default HistorialComprasPage;