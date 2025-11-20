package com.dulcevida.backend.servicio;

import com.dulcevida.backend.modelo.Categoria;
import com.dulcevida.backend.modelo.Producto;
import com.dulcevida.backend.repositorio.ProductoRepositorio;
import com.dulcevida.backend.repositorio.CategoriaRepositorio;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ProductoServicioTest {

    @Mock
    private ProductoRepositorio productoRepositorio;

    @Mock
    private CategoriaRepositorio categoriaRepositorio;

    @InjectMocks
    private ProductoServicio productoServicio;

    private Producto producto;
    private Categoria categoria;

    @BeforeEach
    void setUp() {
        categoria = new Categoria();
        categoria.setIdCategoria(1);
        categoria.setNombre("Tortas");

        producto = new Producto();
        producto.setIdProducto(1);
        producto.setNombre("Torta de Chocolate");
        producto.setDescripcion("Deliciosa torta");
        producto.setPrecio(new BigDecimal("12990"));
        producto.setStock(10);
        producto.setCategoria(categoria);
        producto.setEstado("disponible");
    }

    @Test
    void listar_debeRetornarLista() {
        when(productoRepositorio.findAll()).thenReturn(Arrays.asList(producto));
        List<Producto> lista = productoServicio.listar();
        assertEquals(1, lista.size());
        verify(productoRepositorio, times(1)).findAll();
    }

    @Test
    void crear_debeGuardarProducto() {
        when(categoriaRepositorio.findById(1)).thenReturn(Optional.of(categoria));
        Producto creado = productoServicio.crear(producto);
        assertEquals("Torta de Chocolate", creado.getNombre());
        assertEquals("disponible", creado.getEstado());
    }

    @Test
    void actualizar_debeModificarCampos() {
        Categoria nuevaCat = new Categoria();
        nuevaCat.setIdCategoria(2);
        nuevaCat.setNombre("Galletas");

        Producto cambios = new Producto();
        cambios.setNombre("Torta de Vainilla");
        cambios.setDescripcion("Suave torta");
        cambios.setPrecio(new BigDecimal("13990"));
        cambios.setStock(5);
        cambios.setCategoria(nuevaCat);
        cambios.setImagenUrl("/uploads/img.jpg");
        cambios.setEstado("disponible");

        when(productoRepositorio.findById(1)).thenReturn(Optional.of(producto));
        when(categoriaRepositorio.findById(2)).thenReturn(Optional.of(nuevaCat));
        Optional<Producto> actualizado = productoServicio.actualizar(1, cambios);
        assertTrue(actualizado.isPresent());
        assertEquals("Torta de Vainilla", actualizado.get().getNombre());
        assertEquals(5, actualizado.get().getStock());
        assertEquals("Galletas", actualizado.get().getCategoria().getNombre());
    }

    @Test
    void inhabilitar_debeCambiarEstado() {
        when(productoRepositorio.findById(1)).thenReturn(Optional.of(producto));
        Optional<Producto> inhabilitado = productoServicio.inhabilitar(1);
        assertTrue(inhabilitado.isPresent());
        assertEquals("agotado", inhabilitado.get().getEstado());
    }

    @Test
    void crear_debeFallarSiCategoriaInexistente() {
        when(categoriaRepositorio.findById(1)).thenReturn(Optional.empty());
        assertThrows(IllegalArgumentException.class, () -> productoServicio.crear(producto));
    }

    @Test
    void actualizar_debeFallarSiCategoriaNuevaNoExiste() {
        when(productoRepositorio.findById(1)).thenReturn(Optional.of(producto));
        Categoria otra = new Categoria();
        otra.setIdCategoria(99);
        Producto cambios = new Producto();
        cambios.setCategoria(otra);
        assertThrows(IllegalArgumentException.class, () -> productoServicio.actualizar(1, cambios));
    }
}