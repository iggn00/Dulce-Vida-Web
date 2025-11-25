package com.dulcevida.backend.servicio;

import com.dulcevida.backend.modelo.RefreshToken;
import com.dulcevida.backend.modelo.Usuario;
import com.dulcevida.backend.repositorio.RefreshTokenRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
public class RefreshTokenServicio {
    @Autowired
    private RefreshTokenRepositorio refreshTokenRepositorio;

    public RefreshToken crearRefreshToken(Usuario usuario, long expirySeconds) {
        RefreshToken token = new RefreshToken();
        token.setUsuario(usuario);
        token.setToken(UUID.randomUUID().toString());
        token.setExpiraEn(Instant.now().plusSeconds(expirySeconds));
        token.setRevocado(false);
        return refreshTokenRepositorio.save(token);
    }

    public Optional<RefreshToken> buscarPorToken(String token) {
        return refreshTokenRepositorio.findByToken(token);
    }

    public void revocarToken(RefreshToken token) {
        token.setRevocado(true);
        refreshTokenRepositorio.save(token);
    }

    public void eliminarPorUsuario(Usuario usuario) {
        refreshTokenRepositorio.deleteByUsuario(usuario);
    }
}
