package com.dulcevida.backend.controlador;

import com.dulcevida.backend.repositorio.*;
import com.dulcevida.backend.servicio.UsuarioServicio;
import com.dulcevida.backend.modelo.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardControlador {

    @Autowired
    private BoletaRepositorio boletaRepositorio;
    @Autowired
    private ProductoRepositorio productoRepositorio;
    @Autowired
    private UsuarioRepositorio usuarioRepositorio;
    @Autowired
    private UsuarioServicio usuarioServicio;

    // Verificar si es admin
    private boolean esAdmin() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return usuarioServicio.buscarPorEmail(email)
                .map(u -> "ADMINISTRADOR".equalsIgnoreCase(u.getRol()))
                .orElse(false);
    }

    @GetMapping("/resumen")
    public ResponseEntity<?> obtenerResumen() {
        if (!esAdmin()) return ResponseEntity.status(HttpStatus.FORBIDDEN).build();

        long cantidadProductos = productoRepositorio.count();
        long cantidadUsuarios = usuarioRepositorio.count();
        long cantidadBoletas = boletaRepositorio.count();
        BigDecimal totalVentas = boletaRepositorio.sumarTotalVentas();

        Map<String, Object> stats = new HashMap<>();
        stats.put("productos", cantidadProductos);
        stats.put("usuarios", cantidadUsuarios);
        stats.put("boletas", cantidadBoletas);
        stats.put("ventas", totalVentas != null ? totalVentas : BigDecimal.ZERO);

        return ResponseEntity.ok(stats);
    }
}