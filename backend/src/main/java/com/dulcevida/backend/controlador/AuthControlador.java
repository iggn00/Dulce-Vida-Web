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
    private final com.dulcevida.backend.servicio.RefreshTokenServicio refreshTokenServicio;


    public AuthControlador(UsuarioServicio usuarioServicio, JwtUtil jwtUtil, com.dulcevida.backend.servicio.RefreshTokenServicio refreshTokenServicio) {
        this.usuarioServicio = usuarioServicio;
        this.jwtUtil = jwtUtil;
        this.refreshTokenServicio = refreshTokenServicio;
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
        // Generar refresh token único y persistente (365 días)
        var refreshTokenObj = refreshTokenServicio.crearRefreshToken(usuario, 365 * 24 * 3600);
        String refreshToken = refreshTokenObj.getToken();
        return ResponseEntity.ok()
            .header("Set-Cookie", "dv_token=" + token + "; HttpOnly; Path=/; Max-Age=3600; SameSite=Lax")
            .header("Set-Cookie", "dv_refresh=" + refreshToken + "; HttpOnly; Path=/; Max-Age=" + (365*24*3600) + "; SameSite=Lax")
            .body(Map.of(
                "id_usuario", usuario.getIdUsuario(),
                "nombre", usuario.getNombre(),
                "email", usuario.getEmail(),
                "rol", usuario.getRol(),
                "exito", true
            ));
    }

    @GetMapping("/session")
    public ResponseEntity<?> session(Authentication authentication) {
        System.out.println("[SESSION] Autenticación: " + authentication);
        if (authentication == null || !authentication.isAuthenticated()) {
            System.out.println("[SESSION] No autenticado");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        var usuarioOpt = usuarioServicio.buscarPorEmail(authentication.getName());
        if (usuarioOpt.isEmpty()) {
            System.out.println("[SESSION] Usuario no encontrado: " + authentication.getName());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        var usuario = usuarioOpt.get();
        if (usuario.getEstado() != null && !usuario.getEstado().equalsIgnoreCase("activo")) {
            System.out.println("[SESSION] Usuario inactivo/bloqueado: " + usuario.getEmail());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        System.out.println("[SESSION] Usuario autenticado: " + usuario.getEmail());
        return ResponseEntity.ok(Map.of(
                "id_usuario", usuario.getIdUsuario(),
                "nombre", usuario.getNombre(),
                "email", usuario.getEmail(),
                "rol", usuario.getRol()
        ));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(jakarta.servlet.http.HttpServletRequest request) {
        String refresh = null;
        var cookies = request.getCookies();
        if (cookies != null) {
            for (var c : cookies) {
                if ("dv_refresh".equals(c.getName())) {
                    refresh = c.getValue();
                    break;
                }
            }
        }
        if (refresh == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("mensaje", "Refresh token ausente"));
        }
        var refreshOpt = refreshTokenServicio.buscarPorToken(refresh);
        if (refreshOpt.isEmpty() || refreshOpt.get().isRevocado() || refreshOpt.get().getExpiraEn().isBefore(java.time.Instant.now())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("mensaje", "Refresh token inválido"));
        }
        var usuario = refreshOpt.get().getUsuario();
        String newToken = jwtUtil.generateToken(usuario.getEmail(), usuario.getRol());
        return ResponseEntity.ok()
            .header("Set-Cookie", "dv_token=" + newToken + "; HttpOnly; Path=/; Max-Age=3600; SameSite=Lax")
            .header("Set-Cookie", "dv_refresh=" + refresh + "; HttpOnly; Path=/; Max-Age=" + (365*24*3600) + "; SameSite=Lax")
            .body(Map.of("exito", true));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(jakarta.servlet.http.HttpServletRequest request) {
        // Eliminar refresh token de BD y cookie
        String refreshLogout = null;
        var cookiesLogout = request.getCookies();
        if (cookiesLogout != null) {
            for (var c : cookiesLogout) {
                if ("dv_refresh".equals(c.getName())) {
                    refreshLogout = c.getValue();
                    break;
                }
            }
        }
        if (refreshLogout != null) {
            var refreshOptLogout = refreshTokenServicio.buscarPorToken(refreshLogout);
            refreshOptLogout.ifPresent(refreshTokenServicio::revocarToken);
        }
        return ResponseEntity.ok()
            .header("Set-Cookie", "dv_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax")
            .header("Set-Cookie", "dv_refresh=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax")
            .body(Map.of("exito", true));
    }
    }

