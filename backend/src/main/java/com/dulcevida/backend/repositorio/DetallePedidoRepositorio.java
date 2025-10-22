package com.dulcevida.backend.repositorio;

import com.dulcevida.backend.modelo.DetallePedido;
import com.dulcevida.backend.modelo.Pedido;
import com.dulcevida.backend.modelo.Producto;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DetallePedidoRepositorio extends JpaRepository<DetallePedido, Integer> {
    List<DetallePedido> findByPedido(Pedido pedido);
    Optional<DetallePedido> findByPedidoAndProducto(Pedido pedido, Producto producto);
}
