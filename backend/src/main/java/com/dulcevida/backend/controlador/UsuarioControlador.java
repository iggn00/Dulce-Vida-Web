package com.dulcevida.backend.controlador;

import com.dulcevida.backend.modelo.Usuario;
import com.dulcevida.backend.servicio.UsuarioServicio;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/usuarios")
@Validated
public class UsuarioControlador {

    @Autowired
    private UsuarioServicio usuarioServicio;

    @org.springframework.beans.factory.annotation.Value("${app.admin.email:admin@dulcevida.cl}")
    private String adminEmailPermitido;

    @org.springframework.beans.factory.annotation.Value("${app.registration.allowAdmin:false}")
    private boolean registroPermiteAdmin;

    private boolean esAdminPermitido(HttpSession session){
        Object id = session.getAttribute("usuarioId");
        if (id == null) return false;
    return usuarioServicio.buscarPorId((Integer) id)
        .map(u -> u.getRol() != null && u.getRol().equalsIgnoreCase("ADMINISTRADOR")
            || (u.getEmail() != null && u.getEmail().equalsIgnoreCase(adminEmailPermitido)))
        .orElse(false);
    }

    @GetMapping
    public List<Usuario> listar() {
        return usuarioServicio.listar();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> detalle(@PathVariable Integer id) {
        Optional<Usuario> opt = usuarioServicio.buscarPorId(id);
        return opt.<ResponseEntity<?>>map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/buscar")
    public List<Usuario> buscar(@RequestParam("q") @NotBlank String texto) {
        return usuarioServicio.buscarPorTexto(texto);
    }

    @PostMapping
    public ResponseEntity<?> crear(@Valid @RequestBody Usuario usuario, HttpSession session) {
        Object id = session.getAttribute("usuarioId");
        boolean esAdmin = esAdminPermitido(session);

        // Si no hay sesión (registro público) o el usuario autenticado no es admin,
        // permitimos crear cuenta pero controlamos el rol según configuración
        if (id == null || !esAdmin) {
            if (usuario.getRol() != null && usuario.getRol().equalsIgnoreCase("ADMINISTRADOR") && !registroPermiteAdmin) {
                usuario.setRol("USUARIO");
            }
            return ResponseEntity.ok(usuarioServicio.crear(usuario));
        }

        // Si es admin, puede crear con cualquier rol
        return ResponseEntity.ok(usuarioServicio.crear(usuario));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Integer id, @Valid @RequestBody Usuario cambios, HttpSession session) {
        if (!esAdminPermitido(session)) return ResponseEntity.status(403).body("No autorizado");
        Optional<Usuario> opt = usuarioServicio.actualizar(id, cambios);
        return opt.<ResponseEntity<?>>map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Integer id, HttpSession session) {
        if (!esAdminPermitido(session)) return ResponseEntity.status(403).body("No autorizado");
        usuarioServicio.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}