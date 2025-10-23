package com.dulcevida.backend.controlador;

import com.dulcevida.backend.servicio.CarritoServicio;
import jakarta.servlet.http.HttpSession;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CarritoControlador {

    @Autowired
    private CarritoServicio carritoServicio;

    @GetMapping
    public ResponseEntity<?> obtener(HttpSession session){
        try {
            return ResponseEntity.ok(carritoServicio.obtenerCarrito(session));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(401).body(Map.of("error", "Usuario no autenticado"));
        }
    }

    @PostMapping("/add")
    public ResponseEntity<?> agregar(@RequestBody Map<String, Integer> body, HttpSession session){
        try {
            Integer idProducto = body.get("idProducto");
            Integer cantidad = body.getOrDefault("cantidad", 1);
            return ResponseEntity.ok(carritoServicio.agregar(session, idProducto, cantidad));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(401).body(Map.of("error", "Usuario no autenticado"));
        }
    }

    @DeleteMapping("/item/{idDetalle}")
    public ResponseEntity<?> quitar(@PathVariable Integer idDetalle, HttpSession session){
        try {
            return ResponseEntity.ok(carritoServicio.quitar(session, idDetalle));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(401).body(Map.of("error", "Usuario no autenticado"));
        }
    }

    @PatchMapping("/item/{idDetalle}")
    public ResponseEntity<?> actualizarCantidad(@PathVariable Integer idDetalle, @RequestBody Map<String,Integer> body, HttpSession session){
        try {
            Integer cantidad = body != null ? body.get("cantidad") : null;
            return ResponseEntity.ok(carritoServicio.actualizarCantidad(session, idDetalle, cantidad));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(401).body(Map.of("error", "Usuario no autenticado"));
        }
    }

    @DeleteMapping("/clear")
    public ResponseEntity<?> limpiar(HttpSession session){
        try {
            return ResponseEntity.ok(carritoServicio.limpiar(session));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(401).body(Map.of("error", "Usuario no autenticado"));
        }
    }

    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(HttpSession session) {
        try {
            return ResponseEntity.ok(carritoServicio.finalizar(session));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(401).body(Map.of("error", "Usuario no autenticado"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
