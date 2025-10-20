package com.dulcevida.backend.servicio;

import com.dulcevida.backend.modelo.Producto;
import com.dulcevida.backend.repositorio.ProductoRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductoServicio {

    @Autowired
    private ProductoRepositorio productoRepositorio;

    public List<Producto> listar() {
        return productoRepositorio.findAll();
    }

    public Optional<Producto> buscarPorId(Integer id) {
        return productoRepositorio.findById(id);
    }

    public List<Producto> buscarPorNombre(String texto) {
        return productoRepositorio.findByNombreContainingIgnoreCase(texto);
    }

    public List<Producto> buscarPorCategoriaNombre(String nombre) {
        return productoRepositorio.findByCategoria_NombreIgnoreCase(nombre);
    }

    public List<Producto> buscarPorCategoriaId(Integer id) {
        return productoRepositorio.findByCategoria_IdCategoria(id);
    }

    public List<Producto> bajoStock(int umbral) {
        return productoRepositorio.findByStockLessThan(umbral);
    }

    public Producto crear(Producto producto) {
        producto.setEstado(producto.getEstado() == null ? "disponible" : producto.getEstado());
        return productoRepositorio.save(producto);
    }

    public Optional<Producto> actualizar(Integer id, Producto cambios) {
        return productoRepositorio.findById(id).map(p -> {
            p.setNombre(cambios.getNombre());
            p.setDescripcion(cambios.getDescripcion());
            p.setPrecio(cambios.getPrecio());
            p.setStock(cambios.getStock());
            p.setCategoria(cambios.getCategoria());
            p.setImagenUrl(cambios.getImagenUrl());
            p.setEstado(cambios.getEstado());
            return productoRepositorio.save(p);
        });
    }

    public Optional<Producto> inhabilitar(Integer id) {
        return productoRepositorio.findById(id).map(p -> {
            p.setEstado("agotado");
            return productoRepositorio.save(p);
        });
    }
}