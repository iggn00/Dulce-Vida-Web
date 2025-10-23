package com.dulcevida.backend.servicio;

import com.dulcevida.backend.modelo.Usuario;
import com.dulcevida.backend.repositorio.UsuarioRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class UsuarioServicio {

    @Autowired
    private UsuarioRepositorio usuarioRepositorio;


    public List<Usuario> listar() {
        return usuarioRepositorio.findAll();
    }

    public Optional<Usuario> buscarPorId(Integer id) {
        return usuarioRepositorio.findById(Objects.requireNonNull(id));
    }

    public Optional<Usuario> buscarPorEmail(String email) {
        return usuarioRepositorio.findByEmail(email);
    }

    public List<Usuario> buscarPorTexto(String texto) {
        return usuarioRepositorio.findByNombreContainingIgnoreCaseOrEmailContainingIgnoreCase(texto, texto);
    }

    public Usuario crear(Usuario usuario) {
        // Prevenir duplicados de email
        if (usuarioRepositorio.findByEmail(usuario.getEmail()).isPresent()) {
            throw new DuplicateKeyException("El email ya está registrado");
        }
        // Establecer rol por defecto si no viene
        if (usuario.getRol() == null || usuario.getRol().isBlank()) {
            usuario.setRol("USUARIO");
        }
        // Establecer estado por defecto
        if (usuario.getEstado() == null || usuario.getEstado().isBlank()) {
            usuario.setEstado("activo");
        }
        // Guardar contraseña en texto plano (sin cifrar)
        usuario.setPassword(usuario.getPassword());
        usuarioRepositorio.save(usuario);
        return usuario;
    }

    public Optional<Usuario> actualizar(Integer id, Usuario cambios) {
        // Validar duplicado de email distinto del usuario actual
        if (cambios.getEmail() != null && !cambios.getEmail().isBlank()) {
            Optional<Usuario> existente = usuarioRepositorio.findByEmail(cambios.getEmail());
            if (existente.isPresent() && !existente.get().getIdUsuario().equals(id)) {
                throw new DuplicateKeyException("El email ya está registrado por otro usuario");
            }
        }
        return usuarioRepositorio.findById(Objects.requireNonNull(id)).map(u -> {
            u.setNombre(cambios.getNombre());
            u.setEmail(cambios.getEmail());
            if (cambios.getPassword() != null && !cambios.getPassword().isBlank()) {
                // Actualizar en texto plano (sin cifrar)
                u.setPassword(cambios.getPassword());
            }
            if (cambios.getEstado() != null && !cambios.getEstado().isBlank()) {
                u.setEstado(cambios.getEstado());
            }
            u.setRol(cambios.getRol());
            usuarioRepositorio.save(u);
            return u;
        });
    }

    public void eliminar(Integer id) {
        usuarioRepositorio.deleteById(Objects.requireNonNull(id));
    }

    public Optional<Usuario> actualizarEstado(Integer id, String estado){
        if (estado == null) return Optional.empty();
        String norm = estado.trim().toLowerCase();
        if (!norm.equals("activo") && !norm.equals("inactivo")) return Optional.empty();
        return usuarioRepositorio.findById(Objects.requireNonNull(id)).map(u -> {
            u.setEstado(norm);
            usuarioRepositorio.save(u);
            return u;
        });
    }
}