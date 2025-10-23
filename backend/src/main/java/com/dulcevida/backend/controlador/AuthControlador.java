package com.dulcevida.backend.controlador;

import com.dulcevida.backend.modelo.Usuario;
import com.dulcevida.backend.servicio.UsuarioServicio;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthControlador {

    @Autowired
    private UsuarioServicio usuarioServicio;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credenciales, HttpSession session) {
        String email = credenciales.get("email");
        String password = credenciales.get("password");
        Optional<Usuario> opt = usuarioServicio.buscarPorEmail(email);
        if (opt.isPresent() && password != null) {
            Usuario u = opt.get();
            if (!"activo".equalsIgnoreCase(u.getEstado())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("exito", false, "mensaje", "Usuario inactivo"));
            }
            // Validar contraseña en texto plano (sin cifrar)
            if (password.equals(u.getPassword())) {
                session.setAttribute("usuarioId", u.getIdUsuario());
                session.setAttribute("usuarioEmail", u.getEmail());
                return ResponseEntity.ok(Map.of(
                        "exito", true,
                        "id_usuario", u.getIdUsuario(),
                        "nombre", u.getNombre(),
                        "email", u.getEmail(),
                        "rol", u.getRol()
                ));
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("exito", false, "mensaje", "Credenciales inválidas"));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody Usuario usuario) {
        // Permitir especificar rol al crear cuenta; si es inválido, usar USUARIO
        String rol = usuario.getRol();
        if (rol == null || !("ADMINISTRADOR".equalsIgnoreCase(rol) || "USUARIO".equalsIgnoreCase(rol))) {
            usuario.setRol("USUARIO");
        } else {
            usuario.setRol(rol.toUpperCase());
        }
        Usuario creado = usuarioServicio.crear(usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "id_usuario", creado.getIdUsuario(),
                "email", creado.getEmail(),
                "rol", creado.getRol()
        ));
    }

    @GetMapping("/session")
    public ResponseEntity<?> session(HttpSession session) {
        Object id = session.getAttribute("usuarioId");
        if (id == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        Optional<Usuario> opt = usuarioServicio.buscarPorId((Integer) id);
        if (opt.isEmpty()) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        Usuario u = opt.get();
        return ResponseEntity.ok(Map.of(
                "id_usuario", u.getIdUsuario(),
                "nombre", u.getNombre(),
                "email", u.getEmail(),
                "rol", u.getRol()
        ));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok(Map.of("exito", true));
    }
}
