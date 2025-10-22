package com.dulcevida.backend.repositorio;

import com.dulcevida.backend.modelo.Producto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductoRepositorio extends JpaRepository<Producto, Integer> {
    List<Producto> findByNombreContainingIgnoreCase(String nombre);
    List<Producto> findByNombreContainingIgnoreCaseOrIngredientesContainingIgnoreCase(String nombre, String ingredientes);
    List<Producto> findByCategoria_NombreIgnoreCase(String nombre);
    List<Producto> findByCategoria_IdCategoria(Integer idCategoria);
    List<Producto> findByStockLessThan(Integer stock);
}