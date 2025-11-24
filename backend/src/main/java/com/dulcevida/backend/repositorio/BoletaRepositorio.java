package com.dulcevida.backend.repositorio;

import com.dulcevida.backend.modelo.Boleta;
import com.dulcevida.backend.modelo.Pedido;
import com.dulcevida.backend.modelo.Usuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BoletaRepositorio extends JpaRepository<Boleta, Integer> {
    Boleta findFirstByOrderByNumeroDesc();
    Page<Boleta> findByPedido_Cliente_EmailOrderByFechaEmisionDesc(String email, Pageable pageable);
    Page<Boleta> findAllByOrderByFechaEmisionDesc(Pageable pageable);
}
