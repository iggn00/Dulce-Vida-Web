package com.dulcevida.backend.repositorio;

import com.dulcevida.backend.modelo.Cliente;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClienteRepositorio extends JpaRepository<Cliente, Integer> {
    Optional<Cliente> findByEmail(String email);
}
