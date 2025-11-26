import React from 'react';

export default function AdminDetalleBoleta({ boleta, detalles, onClose }) {
    if (!boleta) return null;

    // Acceso seguro a los datos del cliente (usamos optional chaining ?. por si algo viene nulo)
    const cliente = boleta.pedido?.cliente || {};

    return (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
            <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content border-0 shadow-lg">

                    {/* --- ENCABEZADO: Título y Estado --- */}
                    <div className="modal-header bg-dark text-white">
                        <div>
                            <h5 className="modal-title fw-bold">
                                <i className="bi bi-receipt me-2"></i>
                                Detalle de Boleta #{boleta.numero}
                            </h5>
                            <small className="opacity-75">
                                Emitida el: {new Date(boleta.fechaEmision).toLocaleString()}
                            </small>
                        </div>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>

                    <div className="modal-body bg-light">

                        {/* --- SECCIÓN 1: DATOS DEL CLIENTE Y ENVÍO --- */}
                        <div className="row g-3 mb-4">
                            {/* Tarjeta de Cliente */}
                            <div className="col-md-6">
                                <div className="card h-100 border-0 shadow-sm">
                                    <div className="card-body">
                                        <h6 className="card-title text-uppercase text-muted small fw-bold mb-3">
                                            <i className="bi bi-person-circle me-2"></i>
                                            Datos del Cliente
                                        </h6>
                                        <div className="d-flex flex-column gap-2">
                                            <div>
                                                <span className="fw-bold d-block text-dark">{cliente.nombre || 'Sin nombre'}</span>
                                                <span className="text-muted small">Cliente</span>
                                            </div>
                                            <div>
                                                <span className="text-muted small d-block">RUT</span>
                                                <span className="fw-medium">{cliente.rut ? `${cliente.rut}-${cliente.dv}` : 'N/A'}</span>
                                            </div>
                                            <div>
                                                <span className="text-muted small d-block">Email</span>
                                                <a href={`mailto:${cliente.email}`} className="text-decoration-none">
                                                    {cliente.email || 'Sin email'}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tarjeta de Ubicación */}
                            <div className="col-md-6">
                                <div className="card h-100 border-0 shadow-sm">
                                    <div className="card-body">
                                        <h6 className="card-title text-uppercase text-muted small fw-bold mb-3">
                                            <i className="bi bi-geo-alt-fill me-2"></i>
                                            Ubicación de Envío
                                        </h6>
                                        <div className="d-flex flex-column gap-2">
                                            <div>
                                                <span className="text-muted small d-block">Región</span>
                                                <span className="fw-medium">{cliente.region || 'No especificada'}</span>
                                            </div>
                                            <div>
                                                <span className="text-muted small d-block">Comuna</span>
                                                <span className="fw-medium">{cliente.comuna || 'No especificada'}</span>
                                            </div>
                                            {/* Si tu pedido tiene dirección específica, agrégala aquí */}
                                            {boleta.pedido?.direccionEntrega && (
                                                <div className="alert alert-warning py-1 px-2 mt-1 mb-0 small">
                                                    <i className="bi bi-house-door me-1"></i>
                                                    {boleta.pedido.direccionEntrega}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* --- SECCIÓN 2: TABLA DE PRODUCTOS --- */}
                        <div className="card border-0 shadow-sm mb-4">
                            <div className="card-header bg-white py-3">
                                <h6 className="mb-0 fw-bold text-secondary">Resumen de Productos</h6>
                            </div>
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead className="table-light">
                                    <tr className="text-uppercase small text-muted">
                                        <th className="ps-4">Producto</th>
                                        <th className="text-center">Cant.</th>
                                        <th className="text-end">Precio Unit.</th>
                                        <th className="text-end pe-4">Total</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {detalles.map((d) => (
                                        <tr key={d.idDetalleBoleta}>
                                            <td className="ps-4">
                                                <div className="fw-medium">{d.producto.nombre}</div>
                                            </td>
                                            <td className="text-center">
                          <span className="badge bg-secondary bg-opacity-10 text-secondary rounded-pill px-3">
                            {d.cantidad}
                          </span>
                                            </td>
                                            <td className="text-end text-muted">
                                                ${d.precioUnitario.toLocaleString('es-CL')}
                                            </td>
                                            <td className="text-end fw-bold pe-4">
                                                ${d.totalLinea.toLocaleString('es-CL')}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* --- SECCIÓN 3: TOTALES --- */}
                        <div className="row justify-content-end">
                            <div className="col-md-5">
                                <div className="card border-0 bg-white shadow-sm">
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between mb-2 text-muted">
                                            <span>Subtotal Neto:</span>
                                            <span>${boleta.subtotal.toLocaleString('es-CL')}</span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-3 text-muted">
                                            <span>IVA (19%):</span>
                                            <span>${boleta.iva.toLocaleString('es-CL')}</span>
                                        </div>
                                        <div className="border-top pt-3 d-flex justify-content-between align-items-center">
                                            <span className="h5 mb-0 fw-bold text-dark">Monto Total</span>
                                            <span className="h4 mb-0 fw-bold text-primary">
                        ${boleta.total.toLocaleString('es-CL')}
                      </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* --- PIE DEL MODAL --- */}
                    <div className="modal-footer bg-white border-top-0">
                        <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                            Cerrar
                        </button>
                        <button type="button" className="btn btn-primary" onClick={() => window.print()}>
                            <i className="bi bi-printer me-2"></i> Imprimir
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}