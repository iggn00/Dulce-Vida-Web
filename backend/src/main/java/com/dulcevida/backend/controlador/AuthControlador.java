
package com.dulcevida.backend.controlador;
import com.dulcevida.backend.config.security.JwtUtil;

import com.dulcevida.backend.dto.LoginRequest;
import com.dulcevida.backend.dto.RegistroUsuarioDTO;
import com.dulcevida.backend.modelo.Usuario;
import com.dulcevida.backend.servicio.UsuarioServicio;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthControlador {

    private final UsuarioServicio usuarioServicio;
    private final JwtUtil jwtUtil;

    public AuthControlador(UsuarioServicio usuarioServicio, JwtUtil jwtUtil) {
        this.usuarioServicio = usuarioServicio;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegistroUsuarioDTO dto) {
        Usuario usuario = new Usuario();
        usuario.setNombre(dto.getNombre());
        usuario.setEmail(dto.getEmail());
        usuario.setPassword(dto.getPassword());
        usuario.setRol(dto.getRol());
        usuario.setRut(dto.getRut());
        usuario.setDv(dto.getDv());
        usuario.setRegion(dto.getRegion());
        usuario.setComuna(dto.getComuna());
        Usuario creado = usuarioServicio.crear(usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "id_usuario", creado.getIdUsuario(),
                "email", creado.getEmail(),
                "rol", creado.getRol()
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        System.out.println("[LOGIN] Email recibido: '" + loginRequest.getEmail() + "'");
        System.out.println("[LOGIN] Password recibido: '" + loginRequest.getPassword() + "'");
        var usuarioOpt = usuarioServicio.buscarPorEmail(loginRequest.getEmail());
        if (usuarioOpt.isEmpty()) {
            System.out.println("[LOGIN] Usuario no encontrado");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("mensaje", "Credenciales inválidas"));
        }
        Usuario usuario = usuarioOpt.get();
        System.out.println("[LOGIN] Hash en BD: '" + usuario.getPassword() + "'");
        boolean match = usuarioServicio.passwordValida(usuario, loginRequest.getPassword());
        System.out.println("[LOGIN] ¿Password coincide?: " + match);
        if (!match) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("mensaje", "Credenciales inválidas"));
        }
        // Generar token JWT
        String token = jwtUtil.generateToken(usuario.getEmail(), usuario.getRol());
        // Usar el mismo token como refresh simple para compatibilidad del frontend
        String refreshToken = token;
        return ResponseEntity.ok(Map.of(
                "id_usuario", usuario.getIdUsuario(),
                "nombre", usuario.getNombre(),
                "email", usuario.getEmail(),
                "rol", usuario.getRol(),
                "token", token,
                "refreshToken", refreshToken,
                "exito", true
        ));
    }

    @GetMapping("/session")
    public ResponseEntity<?> session(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return usuarioServicio.buscarPorEmail(authentication.getName())
                .<ResponseEntity<?>>map(u -> ResponseEntity.ok(Map.of(
                        "id_usuario", u.getIdUsuario(),
                        "nombre", u.getNombre(),
                        "email", u.getEmail(),
                        "rol", u.getRol()
                )))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody Map<String, String> body) {
        String refresh = body != null ? body.get("refreshToken") : null;
        if (refresh == null || !jwtUtil.isTokenValid(refresh)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("mensaje", "Refresh token inválido"));
        }
        String email = jwtUtil.extractUsername(refresh);
        String role = jwtUtil.extractRole(refresh);
        if (email == null || role == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("mensaje", "Refresh token inválido"));
        }
        String newToken = jwtUtil.generateToken(email, role);
        return ResponseEntity.ok(Map.of(
                "token", newToken,
                "refreshToken", refresh
        ));
    }

}
