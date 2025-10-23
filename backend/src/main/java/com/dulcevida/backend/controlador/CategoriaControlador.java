package com.dulcevida.backend.controlador;

import com.dulcevida.backend.modelo.Categoria;
import com.dulcevida.backend.servicio.CategoriaServicio;
import com.dulcevida.backend.servicio.UsuarioServicio;
import com.dulcevida.backend.modelo.Usuario;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/categorias")
public class CategoriaControlador {

    @Autowired
    private CategoriaServicio categoriaServicio;

    @Autowired
    private UsuarioServicio usuarioServicio;

    private boolean esAdmin(HttpSession session){
        Object id = session.getAttribute("usuarioId");
        if (id == null) return false;
        return usuarioServicio.buscarPorId((Integer) id)
                .map(Usuario::getRol)
                .map(r -> r.equalsIgnoreCase("ADMINISTRADOR"))
                .orElse(false);
    }

    @GetMapping
    public List<Categoria> listar() {
        return categoriaServicio.listar();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> detalle(@PathVariable Integer id) {
        Optional<Categoria> opt = categoriaServicio.buscarPorId(id);
        return opt.<ResponseEntity<?>>map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> crear(@Valid @RequestBody Categoria categoria, HttpSession session) {
        if (!esAdmin(session)) return ResponseEntity.status(403).body("No autorizado");
        return ResponseEntity.ok(categoriaServicio.crear(categoria));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Integer id, @Valid @RequestBody Categoria cambios, HttpSession session) {
        if (!esAdmin(session)) return ResponseEntity.status(403).body("No autorizado");
        Optional<Categoria> opt = categoriaServicio.actualizar(id, cambios);
        return opt.<ResponseEntity<?>>map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Integer id, HttpSession session) {
        if (!esAdmin(session)) return ResponseEntity.status(403).body("No autorizado");
        categoriaServicio.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}