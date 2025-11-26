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
        var usuarioOpt = usuarioServicio.buscarPorEmail(loginRequest.getEmail());
        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("mensaje", "Credenciales inválidas"));
        }
        Usuario usuario = usuarioOpt.get();
        boolean match = usuarioServicio.passwordValida(usuario, loginRequest.getPassword());
        if (!match) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("mensaje", "Credenciales inválidas"));
        }
        String token = jwtUtil.generateToken(usuario.getEmail(), usuario.getRol());
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
    public ResponseEntity<?> session(Authentication authentication, @CookieValue(value = "dv_token", required = false) String jwt) {
        if ((authentication == null || !authentication.isAuthenticated()) && jwt != null && jwtUtil.isTokenValid(jwt)) {
            String email = jwtUtil.extractUsername(jwt);
            authentication = new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(email, null, java.util.Collections.emptyList());
        }
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
        refreshTokenServicio.revocarToken(refreshOpt.get());
        var usuario = refreshOpt.get().getUsuario();
        var nuevoRefreshTokenObj = refreshTokenServicio.crearRefreshToken(usuario, 365 * 24 * 3600);
        String nuevoRefreshToken = nuevoRefreshTokenObj.getToken();
        String newToken = jwtUtil.generateToken(usuario.getEmail(), usuario.getRol());
        return ResponseEntity.ok()
            .header("Set-Cookie", "dv_token=" + newToken + "; HttpOnly; Path=/; Max-Age=3600; SameSite=Lax")
            .header("Set-Cookie", "dv_refresh=" + nuevoRefreshToken + "; HttpOnly; Path=/; Max-Age=" + (365*24*3600) + "; SameSite=Lax")
            .body(Map.of("exito", true));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(jakarta.servlet.http.HttpServletRequest request) {
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

