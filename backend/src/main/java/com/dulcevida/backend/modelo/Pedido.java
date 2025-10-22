package com.dulcevida.backend.modelo;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "Pedidos")
public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pedido")
    private Integer idPedido;

    @Column(name = "fecha_pedido")
    private Instant fechaPedido = Instant.now();

    @ManyToOne
    @JoinColumn(name = "id_cliente", nullable = false)
    private Cliente cliente;

    @Column(name = "direccion_entrega")
    private String direccionEntrega;

    private BigDecimal total = BigDecimal.ZERO;

    // 'pendiente', 'en_preparacion', 'en_camino', 'entregado', 'cancelado'
    private String estado = "pendiente";
}
