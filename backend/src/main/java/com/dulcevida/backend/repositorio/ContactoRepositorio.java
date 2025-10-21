package com.dulcevida.backend.repositorio;

import com.dulcevida.backend.modelo.Contacto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactoRepositorio extends JpaRepository<Contacto, Integer> {
}
