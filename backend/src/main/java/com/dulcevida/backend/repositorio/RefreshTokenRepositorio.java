package com.dulcevida.backend.repositorio;

import com.dulcevida.backend.modelo.RefreshToken;
import com.dulcevida.backend.modelo.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RefreshTokenRepositorio extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);
    void deleteByUsuario(Usuario usuario);
}
