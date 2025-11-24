package com.dulcevida.backend.controlador;

import com.dulcevida.backend.modelo.Usuario;
import com.dulcevida.backend.dto.UsuarioDTO;
import com.dulcevida.backend.dto.UsuarioMapper;
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

    @org.springframework.beans.factory.annotation.Value("${app.registration.allowAdmin:false}")
    private boolean registroPermiteAdmin;

    private boolean esAdminPermitido(HttpSession session){
        Object id = session.getAttribute("usuarioId");
        if (id == null) return false;
    return usuarioServicio.buscarPorId((Integer) id)
        .map(u -> u.getRol() != null && u.getRol().equalsIgnoreCase("ADMINISTRADOR"))
        .orElse(false);
    }

    @GetMapping
    public ResponseEntity<?> listar(HttpSession session) {
        if (!esAdminPermitido(session)) return ResponseEntity.status(403).body("No autorizado");
        return ResponseEntity.ok(usuarioServicio.listar().stream().map(UsuarioMapper::toDTO).toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> detalle(@PathVariable Integer id, HttpSession session) {
        if (!esAdminPermitido(session)) return ResponseEntity.status(403).body("No autorizado");
        Optional<Usuario> opt = usuarioServicio.buscarPorId(id);
        return opt.<ResponseEntity<?>>map(u -> ResponseEntity.ok(UsuarioMapper.toDTO(u))).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/buscar")
    public ResponseEntity<?> buscar(@RequestParam("q") @NotBlank String texto, HttpSession session) {
        if (!esAdminPermitido(session)) return ResponseEntity.status(403).body("No autorizado");
        return ResponseEntity.ok(usuarioServicio.buscarPorTexto(texto).stream().map(UsuarioMapper::toDTO).toList());
    }

    @PostMapping
    public ResponseEntity<?> crear(@Valid @RequestBody Usuario usuario, HttpSession session) {
        Object id = session.getAttribute("usuarioId");
        boolean esAdmin = esAdminPermitido(session);

        
        
        if (id == null || !esAdmin) {
            if (usuario.getRol() != null && usuario.getRol().equalsIgnoreCase("ADMINISTRADOR") && !registroPermiteAdmin) {
                usuario.setRol("USUARIO");
            }
            return ResponseEntity.ok(UsuarioMapper.toDTO(usuarioServicio.crear(usuario)));
        }

        
        return ResponseEntity.ok(UsuarioMapper.toDTO(usuarioServicio.crear(usuario)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Integer id, @RequestBody Usuario cambios, HttpSession session) {
        if (!esAdminPermitido(session)) return ResponseEntity.status(403).body("No autorizado");
        Optional<Usuario> opt = usuarioServicio.actualizar(id, cambios);
        return opt.<ResponseEntity<?>>map(u -> ResponseEntity.ok(UsuarioMapper.toDTO(u))).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Integer id, HttpSession session) {
        if (!esAdminPermitido(session)) return ResponseEntity.status(403).body("No autorizado");
        usuarioServicio.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<?> actualizarEstado(@PathVariable Integer id, @RequestBody java.util.Map<String,String> body, HttpSession session){
        if (!esAdminPermitido(session)) return ResponseEntity.status(403).body("No autorizado");
        String estado = body != null ? body.get("estado") : null;
        return usuarioServicio.actualizarEstado(id, estado)
            .<ResponseEntity<?>>map(u -> ResponseEntity.ok(UsuarioMapper.toDTO(u)))
                .orElseGet(() -> ResponseEntity.badRequest().body(java.util.Map.of("error","Estado inválido")));
    }

    @PostMapping("/{id}/password")
    public ResponseEntity<?> cambiarPassword(@PathVariable Integer id, @RequestBody java.util.Map<String,String> body, HttpSession session){
        Object sid = session.getAttribute("usuarioId");
        if (sid == null || !sid.equals(id)) return ResponseEntity.status(403).body("No autorizado");
        String actual = body != null ? body.get("actual") : null;
        String nueva = body != null ? body.get("nueva") : null;
        return usuarioServicio.cambiarPassword(id, actual, nueva)
                .<ResponseEntity<?>>map(u -> ResponseEntity.ok(java.util.Map.of("exito", true)))
                .orElseGet(() -> ResponseEntity.badRequest().body(java.util.Map.of("error","Password inválido o no coincide")));
    }
}