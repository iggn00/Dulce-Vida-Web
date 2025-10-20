package com.dulcevida.backend.servicio;

import com.dulcevida.backend.modelo.Categoria;
import com.dulcevida.backend.repositorio.CategoriaRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Objects;

@Service
public class CategoriaServicio {

    @Autowired
    private CategoriaRepositorio categoriaRepositorio;

    public List<Categoria> listar() {
        return categoriaRepositorio.findAll();
    }

    public Optional<Categoria> buscarPorId(Integer id) {
        return categoriaRepositorio.findById(Objects.requireNonNull(id));
    }

    public Optional<Categoria> buscarPorNombre(String nombre) {
        Categoria c = categoriaRepositorio.findByNombreIgnoreCase(nombre);
        return Optional.ofNullable(c);
    }
}