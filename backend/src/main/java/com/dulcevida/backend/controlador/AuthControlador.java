package com.dulcevida.backend.controlador;

import com.dulcevida.backend.modelo.Usuario;
import com.dulcevida.backend.servicio.UsuarioServicio;
import com.dulcevida.backend.config.security.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
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
import java.time.Instant;
import java.util.UUID;
import com.dulcevida.backend.modelo.RefreshToken;
import com.dulcevida.backend.repositorio.RefreshTokenRepositorio;

@RestController
@RequestMapping("/auth")
public class AuthControlador {

    @Autowired
    private UsuarioServicio usuarioServicio;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private RefreshTokenRepositorio refreshTokenRepositorio;

    private static final int MAX_LOGIN_ATTEMPTS = 5;
    private static final long BLOCK_WINDOW_MS = 5 * 60 * 1000; // 5 minutos
    private final java.util.concurrent.ConcurrentHashMap<String, int[]> loginAttempts = new java.util.concurrent.ConcurrentHashMap<>();

    private boolean isBlocked(String email){
        int[] data = loginAttempts.get(email);
        if (data == null) return false;
        int attempts = data[0];
        long firstTs = data[1];
        long now = System.currentTimeMillis();
        if (now - firstTs > BLOCK_WINDOW_MS){
            loginAttempts.remove(email);
            return false;
        }
        return attempts >= MAX_LOGIN_ATTEMPTS;
    }

    private void registerAttempt(String email){
        loginAttempts.compute(email, (k,v)->{
            long now = System.currentTimeMillis();
            if (v == null || now - v[1] > BLOCK_WINDOW_MS){
                return new int[]{1,(int)now};
            }
            v[0] += 1;
            return v;
        });
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credenciales, HttpServletRequest request) {
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
        if (isBlocked(email)){
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(Map.of(
                    "exito", false,
                    "codigo", "login_bloqueado",
                    "mensaje", "Demasiados intentos fallidos. Intenta más tarde."));
        }
        if (!"activo".equalsIgnoreCase(u.getEstado())) {
            return ResponseEntity.status(HttpStatus.LOCKED).body(Map.of(
                    "exito", false,
                    "codigo", "cuenta_inactiva",
                    "mensaje", "Tu cuenta ha sido inhabilitada, Contacta al Administrador."));
        }
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
        } catch (BadCredentialsException ex) {
            registerAttempt(email);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("exito", false, "mensaje", "Credenciales inválidas"));
        }
        loginAttempts.remove(email); // reset
        String token = jwtUtil.generateToken(u.getEmail(), u.getRol());
        RefreshToken rt = new RefreshToken();
        rt.setUsuario(u);
        rt.setToken(UUID.randomUUID().toString());
        rt.setExpiraEn(Instant.now().plusSeconds(60 * 60 * 24)); // 24h refresh
        refreshTokenRepositorio.save(rt);

        // Vincular usuario a la sesión para integrar con carrito (aunque la seguridad principal es JWT Stateless)
        HttpSession session = request.getSession(false);
        if (session == null) {
            session = request.getSession(true);
        }
        session.setAttribute("usuarioId", u.getIdUsuario());

        return ResponseEntity.ok(Map.of(
                "exito", true,
                "token", token,
                "refreshToken", rt.getToken(),
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

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody Map<String,String> body){
        String rtoken = body.get("refreshToken");
        if (rtoken == null) return ResponseEntity.badRequest().body(Map.of("error","Falta refreshToken"));
        Optional<RefreshToken> ropt = refreshTokenRepositorio.findByToken(rtoken);
        if (ropt.isEmpty()) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error","Refresh inválido"));
        RefreshToken rt = ropt.get();
        if (rt.isRevocado() || rt.getExpiraEn().isBefore(Instant.now())){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error","Refresh expirado"));
        }
        Usuario u = rt.getUsuario();
        String newAccess = jwtUtil.generateToken(u.getEmail(), u.getRol());
        // Rotación simple: generar nuevo refresh y revocar anterior
        rt.setRevocado(true);
        refreshTokenRepositorio.save(rt);
        RefreshToken nuevo = new RefreshToken();
        nuevo.setUsuario(u);
        nuevo.setToken(UUID.randomUUID().toString());
        nuevo.setExpiraEn(Instant.now().plusSeconds(60*60*24));
        refreshTokenRepositorio.save(nuevo);
        return ResponseEntity.ok(Map.of(
                "token", newAccess,
                "refreshToken", nuevo.getToken()
        ));
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
    public ResponseEntity<?> logout(@RequestBody(required = false) Map<String,String> body) {
        if (body != null){
            String refresh = body.get("refreshToken");
            if (refresh != null){
                refreshTokenRepositorio.findByToken(refresh).ifPresent(rt->{
                    rt.setRevocado(true);
                    refreshTokenRepositorio.save(rt);
                });
            }
        }
        return ResponseEntity.ok(Map.of("exito", true));
    }
}
