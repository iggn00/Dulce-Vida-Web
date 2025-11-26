package com.dulcevida.backend.controlador;

import com.dulcevida.backend.config.security.JwtUtil;
import com.dulcevida.backend.modelo.Usuario;
import com.dulcevida.backend.servicio.UsuarioServicio;
import jakarta.servlet.http.Cookie; // IMPORTANTE
import jakarta.servlet.http.HttpServletResponse; // IMPORTANTE
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AutenticacionControlador {

    @Autowired
    private UsuarioServicio usuarioServicio;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credenciales, HttpServletResponse response) {
        String email = credenciales.get("email");
        String password = credenciales.get("password");

        Optional<Usuario> opt = usuarioServicio.buscarPorEmail(email);

        // Verificamos si existe y si la contraseña coincide
        if (opt.isPresent() && passwordEncoder.matches(password, opt.get().getPassword())) {
            Usuario u = opt.get();

            // 1. Generar token
            String token = jwtUtil.generateToken(u.getEmail(), u.getRol());

            // 2. CREAR COOKIE HTTP-ONLY (Esto soluciona el problema de la sesión pegada)
            Cookie cookie = new Cookie("dv_token", token);
            cookie.setHttpOnly(true);
            cookie.setSecure(false); // Pon true si usas HTTPS en producción
            cookie.setPath("/");     // Disponible para toda la app
            cookie.setMaxAge(60 * 60 * 24); // 1 día de duración
            response.addCookie(cookie);

            return ResponseEntity.ok(Map.of(
                    "exito", true,
                    "token", token, // También lo enviamos por si el front lo necesita en memoria
                    "id_usuario", u.getIdUsuario(),
                    "nombre", u.getNombre(),
                    "email", u.getEmail(),
                    "rol", u.getRol() != null ? u.getRol() : "USUARIO"
            ));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("exito", false, "mensaje", "Credenciales inválidas"));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Usuario usuario) {
        if (usuarioServicio.buscarPorEmail(usuario.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("mensaje", "El email ya está registrado"));
        }

        if (usuario.getRol() == null || usuario.getRol().isEmpty()) {
            usuario.setRol("USUARIO");
        }
        usuario.setEstado("activo");

        try {
            Usuario nuevo = usuarioServicio.crear(usuario);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                    "exito", true,
                    "mensaje", "Usuario registrado correctamente",
                    "id_usuario", nuevo.getIdUsuario()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("mensaje", "Error al registrar: " + e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        // SOBRESCRIBIR LA COOKIE PARA BORRARLA
        Cookie cookie = new Cookie("dv_token", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(0); // 0 segundos = borrar inmediatamente
        response.addCookie(cookie);

        return ResponseEntity.ok(Map.of("exito", true, "mensaje", "Sesión cerrada"));
    }

    @GetMapping("/session")
    public ResponseEntity<?> session() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        Optional<Usuario> opt = usuarioServicio.buscarPorEmail(email);

        if (opt.isPresent()) {
            Usuario u = opt.get();
            return ResponseEntity.ok(Map.of(
                    "id_usuario", u.getIdUsuario(),
                    "nombre", u.getNombre(),
                    "email", u.getEmail(),
                    "rol", u.getRol()
            ));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh() {
        return ResponseEntity.ok(Map.of("exito", true));
    }
}