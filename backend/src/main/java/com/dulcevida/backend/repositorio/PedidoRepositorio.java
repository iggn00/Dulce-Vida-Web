package com.dulcevida.backend.repositorio;

import com.dulcevida.backend.modelo.Cliente;
import com.dulcevida.backend.modelo.Pedido;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PedidoRepositorio extends JpaRepository<Pedido, Integer> {
    Optional<Pedido> findFirstByClienteAndEstado(Cliente cliente, String estado);
}
