package com.dulcevida.backend.modelo;

import jakarta.persistence.*;
import java.math.BigDecimal;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Detalle_Boleta")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DetalleBoleta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_detalle_boleta")
    private Integer idDetalleBoleta;

    @ManyToOne
    @JoinColumn(name = "id_boleta", nullable = false)
    private Boleta boleta;

    @ManyToOne
    @JoinColumn(name = "id_producto", nullable = false)
    private Producto producto;

    private Integer cantidad;

    @Column(name = "precio_unitario")
    private BigDecimal precioUnitario;

    @Column(name = "total_linea")
    private BigDecimal totalLinea;
}
