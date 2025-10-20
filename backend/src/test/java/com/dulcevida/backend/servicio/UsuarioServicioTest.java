package com.dulcevida.backend.servicio;

import com.dulcevida.backend.modelo.Usuario;
import com.dulcevida.backend.repositorio.UsuarioRepositorio;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class UsuarioServicioTest {

    @Mock
    private UsuarioRepositorio usuarioRepositorio;

    private PasswordEncoder encriptador = new BCryptPasswordEncoder();

    @InjectMocks
    private UsuarioServicio usuarioServicio;

    private Usuario usuario;

    @BeforeEach
    void setUp() {
        usuarioServicio = new UsuarioServicio();
        // Inyectamos los mocks manualmente porque el PasswordEncoder no es un mock
        try {
            var repoField = UsuarioServicio.class.getDeclaredField("usuarioRepositorio");
            repoField.setAccessible(true);
            repoField.set(usuarioServicio, usuarioRepositorio);
            var encField = UsuarioServicio.class.getDeclaredField("encriptador");
            encField.setAccessible(true);
            encField.set(usuarioServicio, encriptador);
        } catch (Exception ignored) {}

        usuario = new Usuario();
        usuario.setIdUsuario(1);
        usuario.setNombre("Admin");
        usuario.setEmail("admin@dulcevida.com");
        usuario.setPassword("admin123");
        usuario.setRol("ADMINISTRADOR");
    }

    @Test
    void crear_debeCifrarPassword() {
        when(usuarioRepositorio.findByEmail("admin@dulcevida.com")).thenReturn(Optional.empty());
        when(usuarioRepositorio.save(any())).thenAnswer(inv -> inv.getArgument(0));
        Usuario creado = usuarioServicio.crear(usuario);
        assertNotEquals("admin123", creado.getPassword());
        assertTrue(encriptador.matches("admin123", creado.getPassword()));
    }

    @Test
    void crear_debeFallarSiEmailDuplicado() {
        when(usuarioRepositorio.findByEmail("admin@dulcevida.com")).thenReturn(Optional.of(usuario));
        assertThrows(DuplicateKeyException.class, () -> usuarioServicio.crear(usuario));
    }

    @Test
    void actualizar_debeActualizarCamposBasicos() {
        Usuario cambios = new Usuario();
        cambios.setNombre("Nuevo Admin");
        cambios.setEmail("nuevo@dulcevida.com");
        cambios.setRol("ADMINISTRADOR");
        when(usuarioRepositorio.findById(1)).thenReturn(Optional.of(usuario));
        when(usuarioRepositorio.findByEmail("nuevo@dulcevida.com")).thenReturn(Optional.empty());
        when(usuarioRepositorio.save(any())).thenAnswer(inv -> inv.getArgument(0));
        Optional<Usuario> actualizado = usuarioServicio.actualizar(1, cambios);
        assertTrue(actualizado.isPresent());
        assertEquals("Nuevo Admin", actualizado.get().getNombre());
        assertEquals("nuevo@dulcevida.com", actualizado.get().getEmail());
    }

    @Test
    void actualizar_debeFallarSiEmailPerteneceAOtroUsuario() {
        Usuario otro = new Usuario();
        otro.setIdUsuario(2);
        otro.setEmail("nuevo@dulcevida.com");
        Usuario cambios = new Usuario();
        cambios.setEmail("nuevo@dulcevida.com");
        when(usuarioRepositorio.findById(1)).thenReturn(Optional.of(usuario));
        when(usuarioRepositorio.findByEmail("nuevo@dulcevida.com")).thenReturn(Optional.of(otro));
        assertThrows(DuplicateKeyException.class, () -> usuarioServicio.actualizar(1, cambios));
    }
}