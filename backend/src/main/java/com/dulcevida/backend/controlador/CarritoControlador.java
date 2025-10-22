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
        return ResponseEntity.ok(carritoServicio.obtenerCarrito(session));
    }

    @PostMapping("/add")
    public ResponseEntity<?> agregar(@RequestBody Map<String, Integer> body, HttpSession session){
        Integer idProducto = body.get("idProducto");
        Integer cantidad = body.getOrDefault("cantidad", 1);
        return ResponseEntity.ok(carritoServicio.agregar(session, idProducto, cantidad));
    }

    @DeleteMapping("/item/{idDetalle}")
    public ResponseEntity<?> quitar(@PathVariable Integer idDetalle, HttpSession session){
        return ResponseEntity.ok(carritoServicio.quitar(session, idDetalle));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<?> limpiar(HttpSession session){
        return ResponseEntity.ok(carritoServicio.limpiar(session));
    }
}
