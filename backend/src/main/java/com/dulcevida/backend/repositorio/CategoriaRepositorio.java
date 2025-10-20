package com.dulcevida.backend.repositorio;

import com.dulcevida.backend.modelo.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoriaRepositorio extends JpaRepository<Categoria, Integer> {
    Categoria findByNombreIgnoreCase(String nombre);
}