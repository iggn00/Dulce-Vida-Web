package com.dulcevida.backend.config.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain) throws ServletException, IOException {
        String path = request.getRequestURI();

        // --- PASE VIP PARA IMÁGENES (NUEVO) ---
        // Si la petición es para una imagen, dejamos pasar sin preguntar nada.
        if (path.startsWith("/img/") || path.startsWith("/uploads/") || path.endsWith(".png") || path.endsWith(".jpg") || path.endsWith(".jpeg")) {
            filterChain.doFilter(request, response);
            return;
        }
        // --------------------------------------

        // ... (El resto de tu lógica de Auth/Login sigue igual hacia abajo) ...
        if (path.equals("/auth/login") || path.equals("/auth/register") || path.equals("/auth/refresh")) {
            filterChain.doFilter(request, response);
            return;
        }

        // ... (Tu código existente para validar token) ...
        String token = null;
        if (request.getCookies() != null) {
            for (var c : request.getCookies()) {
                if ("dv_token".equals(c.getName())) {
                    token = c.getValue();
                    break;
                }
            }
        }

        // ... (Resto de validación de usuario) ...
        String username = null;
        if (token != null && jwtUtil.isTokenValid(token)) {
            username = jwtUtil.extractUsername(token);
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try { // Agregamos try-catch para evitar que explote si el usuario no existe
                UserDetails details = userDetailsService.loadUserByUsername(username);
                if (jwtUtil.isTokenValid(token)) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(details, null, details.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            } catch (Exception e) {
                // Si el usuario no existe en BD (cookie vieja), ignoramos el error y seguimos
            }
        }
        filterChain.doFilter(request, response);
    }
}