import React, { useState } from 'react';
import { api } from '../services/http';

function HistorialComprasPage({ boletas }) {
    const [detalleId, setDetalleId] = useState(null);
    const [detalles, setDetalles] = useState({});
    const [loadingDetalle, setLoadingDetalle] = useState(false);
    const [errorDetalle, setErrorDetalle] = useState(null);

    const handleVerMas = async (boletaId) => {
        if (detalleId === boletaId) {
            setDetalleId(null);
            return;
        }
        setDetalleId(boletaId);
        if (!detalles[boletaId]) {
            setLoadingDetalle(true);
            setErrorDetalle(null);
            let timeoutId;
            try {
                timeoutId = setTimeout(() => {
                    setErrorDetalle('La petición está tardando demasiado. Verifica el backend.');
                    setLoadingDetalle(false);
                }, 7000); // 7 segundos de espera máxima
                const res = await api.get(`/boletas/${boletaId}/detalles`);
                clearTimeout(timeoutId);
                setDetalles(prev => ({ ...prev, [boletaId]: res.data }));
            } catch (e) {
                clearTimeout(timeoutId);
                setErrorDetalle('No se pudo cargar el detalle de la boleta. Verifica el backend o la conexión.');
                setDetalles(prev => ({ ...prev, [boletaId]: { detalles: [] } }));
            }
            setLoadingDetalle(false);
        }
    };

    return (
        <div>
            <h2>Historial de Compras</h2>
            {(!boletas || boletas.length === 0) ? (
                <p>No hay compras registradas.</p>
            ) : (
                boletas.map(boleta => (
                    <div key={boleta.idBoleta || boleta.id} className="boleta-card">
                        <p>Fecha: {boleta.fechaEmision || boleta.fecha}</p>
                        <p>Total: ${boleta.total}</p>
                        <button onClick={() => handleVerMas(boleta.idBoleta || boleta.id)}>
                            {detalleId === (boleta.idBoleta || boleta.id) ? 'Ocultar' : 'Ver más'}
                        </button>
                        {detalleId === (boleta.idBoleta || boleta.id) && (
                            <div className="detalle-compra">
                                <h4>Productos comprados:</h4>
                                {loadingDetalle ? (
                                    <p>Cargando detalles...</p>
                                ) : errorDetalle ? (
                                    <p style={{color:'red'}}>{errorDetalle}</p>
                                ) : detalles[boleta.idBoleta || boleta.id] && detalles[boleta.idBoleta || boleta.id].detalles ? (
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
                                            {detalles[boleta.idBoleta || boleta.id].detalles.map(d => (
                                                <tr key={d.idDetalleBoleta}>
                                                    <td>{d.producto.nombre}</td>
                                                    <td>{d.cantidad}</td>
                                                    <td>${d.precioUnitario}</td>
                                                    <td>${d.totalLinea}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p>No hay detalles disponibles.</p>
                                )}
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}

export default HistorialComprasPage;
