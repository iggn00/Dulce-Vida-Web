package com.dulcevida.backend.controlador;

import com.dulcevida.backend.modelo.Usuario;
import com.dulcevida.backend.servicio.UsuarioServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api")
public class AutenticacionControlador {

    @Autowired
    private UsuarioServicio usuarioServicio;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credenciales, HttpSession session) {
        String email = credenciales.get("email");
        String password = credenciales.get("password");
        Optional<Usuario> opt = usuarioServicio.buscarPorEmail(email);
        if (opt.isPresent() && password != null && password.equals(opt.get().getPassword())) {
            Usuario u = opt.get();
            // Crear sesión simple sin JWT
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
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("exito", false, "mensaje", "Credenciales inválidas"));
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