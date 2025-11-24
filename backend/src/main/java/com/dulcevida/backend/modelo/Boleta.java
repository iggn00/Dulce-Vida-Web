package com.dulcevida.backend.modelo;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Boleta")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Boleta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_boleta")
    private Integer idBoleta;

    @Column(name = "numero", unique = true)
    private Long numero; // correlativo

    @Column(name = "fecha_emision")
    private Instant fechaEmision = Instant.now();

    @ManyToOne
    @JoinColumn(name = "id_pedido", nullable = false)
    private Pedido pedido;

    @Column(name = "subtotal")
    private BigDecimal subtotal;

    @Column(name = "iva")
    private BigDecimal iva;

    @Column(name = "total")
    private BigDecimal total;
}
