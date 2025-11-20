package com.dulcevida.backend.controlador;

import com.dulcevida.backend.modelo.Usuario;
import com.dulcevida.backend.servicio.UsuarioServicio;
import com.dulcevida.backend.config.security.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthControlador {

    @Autowired
    private UsuarioServicio usuarioServicio;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credenciales) {
        String email = credenciales.get("email");
        String password = credenciales.get("password");
        if (email == null || password == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("exito", false, "mensaje", "Email y password requeridos"));
        }
        Optional<Usuario> opt = usuarioServicio.buscarPorEmail(email);
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("exito", false, "mensaje", "Credenciales inválidas"));
        }
        Usuario u = opt.get();
        if (!"activo".equalsIgnoreCase(u.getEstado())) {
            return ResponseEntity.status(HttpStatus.LOCKED).body(Map.of(
                    "exito", false,
                    "codigo", "cuenta_inactiva",
                    "mensaje", "Tu cuenta ha sido inhabilitada, Contacta al Administrador."));
        }
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
        } catch (BadCredentialsException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("exito", false, "mensaje", "Credenciales inválidas"));
        }
        String token = jwtUtil.generateToken(u.getEmail(), u.getRol());
        return ResponseEntity.ok(Map.of(
                "exito", true,
                "token", token,
                "id_usuario", u.getIdUsuario(),
                "nombre", u.getNombre(),
                "email", u.getEmail(),
                "rol", u.getRol()
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody Usuario usuario) {
        
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
                "rol", creado.getRol()));
    }

    @GetMapping("/session")
    public ResponseEntity<?> session(@RequestHeader(name = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String token = authHeader.substring(7);
        if (!jwtUtil.isTokenValid(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String email = jwtUtil.extractUsername(token);
        Optional<Usuario> opt = usuarioServicio.buscarPorEmail(email);
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
    public ResponseEntity<?> logout() {
        // Con JWT sólo se invalida en cliente (opcional lista negra) => respuesta informativa
        return ResponseEntity.ok(Map.of("exito", true));
    }
}
