package com.dulcevida.backend.repositorio;

import com.dulcevida.backend.modelo.Boleta;
import com.dulcevida.backend.modelo.DetalleBoleta;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DetalleBoletaRepositorio extends JpaRepository<DetalleBoleta, Integer> {
    List<DetalleBoleta> findByBoleta(Boleta boleta);
}
