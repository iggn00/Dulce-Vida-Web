
package com.dulcevida.backend.servicio;

import com.dulcevida.backend.modelo.Usuario;
import com.dulcevida.backend.repositorio.UsuarioRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class UsuarioServicio {

    @Autowired
    private UsuarioRepositorio usuarioRepositorio;

    @Autowired
    private PasswordEncoder passwordEncoder;


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
        
        if (usuarioRepositorio.findByEmail(usuario.getEmail()).isPresent()) {
            throw new DuplicateKeyException("El email ya está registrado");
        }
        
        if (usuario.getRut() != null) {
            usuario.setRut(usuario.getRut().replaceAll("[^0-9]", ""));
        }
        if (usuario.getDv() != null) {
            usuario.setDv(usuario.getDv().trim().toUpperCase());
        }
        // Prevenir duplicados de RUT+DV
        if (usuario.getRut() != null && usuario.getDv() != null) {
            if (usuarioRepositorio.findByRutAndDv(usuario.getRut(), usuario.getDv()).isPresent()) {
                throw new DuplicateKeyException("El RUT ya está registrado");
            }
        }
        
        if (usuario.getRol() == null || usuario.getRol().isBlank()) {
            usuario.setRol("USUARIO");
        }
        
        if (usuario.getEstado() == null || usuario.getEstado().isBlank()) {
            usuario.setEstado("activo");
        }
        
        // Cifrar contraseña antes de guardar
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        usuarioRepositorio.save(usuario);
        return usuario;
    }

    public Optional<Usuario> actualizar(Integer id, Usuario cambios) {
        
        if (cambios.getEmail() != null && !cambios.getEmail().isBlank()) {
            Optional<Usuario> existente = usuarioRepositorio.findByEmail(cambios.getEmail());
            if (existente.isPresent() && !existente.get().getIdUsuario().equals(id)) {
                throw new DuplicateKeyException("El email ya está registrado por otro usuario");
            }
        }
        
        if (cambios.getRut() != null) {
            cambios.setRut(cambios.getRut().replaceAll("[^0-9]", ""));
        }
        if (cambios.getDv() != null) {
            cambios.setDv(cambios.getDv().trim().toUpperCase());
        }
        return usuarioRepositorio.findById(Objects.requireNonNull(id)).map(u -> {
            u.setNombre(cambios.getNombre());
            u.setEmail(cambios.getEmail());
            if (cambios.getPassword() != null && !cambios.getPassword().isBlank()) {
                u.setPassword(passwordEncoder.encode(cambios.getPassword()));
            }
            if (cambios.getEstado() != null && !cambios.getEstado().isBlank()) {
                u.setEstado(cambios.getEstado());
            }
            u.setRol(cambios.getRol());
            // Si vienen cambios de RUT/DV/Región/Comuna, validar duplicidad y actualizar
            if (cambios.getRut() != null && cambios.getDv() != null) {
                Optional<Usuario> existenteRut = usuarioRepositorio.findByRutAndDv(cambios.getRut(), cambios.getDv());
                if (existenteRut.isPresent() && !existenteRut.get().getIdUsuario().equals(id)) {
                    throw new DuplicateKeyException("El RUT ya está registrado por otro usuario");
                }
                u.setRut(cambios.getRut());
                u.setDv(cambios.getDv());
            }
            if (cambios.getRegion() != null && !cambios.getRegion().isBlank()) {
                u.setRegion(cambios.getRegion());
            }
            if (cambios.getComuna() != null && !cambios.getComuna().isBlank()) {
                u.setComuna(cambios.getComuna());
            }
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

    public Optional<Usuario> cambiarPassword(Integer id, String actual, String nueva){
        if (actual == null || nueva == null) return Optional.empty();
        if (nueva.length() < 8) return Optional.empty();
        return usuarioRepositorio.findById(Objects.requireNonNull(id)).flatMap(u -> {
            if (!passwordEncoder.matches(actual, u.getPassword())) {
                return Optional.empty();
            }
            u.setPassword(passwordEncoder.encode(nueva));
            usuarioRepositorio.save(u);
            return Optional.of(u);
        });
    }
    // Valida la contraseña en texto plano contra la cifrada
    public boolean passwordValida(Usuario usuario, String passwordPlano) {
        if (usuario == null || passwordPlano == null) return false;
        return passwordEncoder.matches(passwordPlano, usuario.getPassword());
    }
}