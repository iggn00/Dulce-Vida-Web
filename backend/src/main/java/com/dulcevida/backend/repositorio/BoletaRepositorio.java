package com.dulcevida.backend.repositorio;

import com.dulcevida.backend.modelo.Boleta;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;

@Repository
public interface BoletaRepositorio extends JpaRepository<Boleta, Integer> {

    Page<Boleta> findByPedido_Cliente_EmailOrderByFechaEmisionDesc(String email, Pageable pageable);


    Page<Boleta> findAllByOrderByFechaEmisionDesc(Pageable pageable);

    // --- NUEVO: Para el Dashboard (Suma total de ventas) ---
    @Query("SELECT SUM(b.total) FROM Boleta b")
    BigDecimal sumarTotalVentas();

    Boleta findFirstByOrderByNumeroDesc();
}