package com.dulcevida.backend.controlador;

import com.dulcevida.backend.modelo.Categoria;
import com.dulcevida.backend.servicio.CategoriaServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
public class CategoriaControlador {

    @Autowired
    private CategoriaServicio categoriaServicio;

    @GetMapping
    public List<Categoria> listar() {
        return categoriaServicio.listar();
    }
}