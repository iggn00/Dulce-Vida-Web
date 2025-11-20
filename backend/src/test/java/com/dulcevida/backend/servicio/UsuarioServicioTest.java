package com.dulcevida.backend.servicio;

import com.dulcevida.backend.modelo.Usuario;
import com.dulcevida.backend.repositorio.UsuarioRepositorio;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.dao.DuplicateKeyException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class UsuarioServicioTest {

    @Mock
    private UsuarioRepositorio usuarioRepositorio;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UsuarioServicio usuarioServicio;

    private Usuario usuario;

    @BeforeEach
    void setUp() {
        usuarioServicio = new UsuarioServicio();
        try {
            var repoField = UsuarioServicio.class.getDeclaredField("usuarioRepositorio");
            repoField.setAccessible(true);
            repoField.set(usuarioServicio, usuarioRepositorio);
            var encField = UsuarioServicio.class.getDeclaredField("passwordEncoder");
            encField.setAccessible(true);
            encField.set(usuarioServicio, passwordEncoder);
        } catch (Exception ignored) {}

        usuario = new Usuario();
        usuario.setIdUsuario(1);
        usuario.setNombre("Admin");
        usuario.setEmail("admin@dulcevida.com");
        usuario.setPassword("admin123");
        usuario.setRol("ADMINISTRADOR");
        usuario.setEstado("activo");
    }

    @Test
    void crear_debeCifrarPasswordBCrypt() {
        when(usuarioRepositorio.findByEmail("admin@dulcevida.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("admin123")).thenReturn("$2a$FakeHashEncodedPassword123456789012345678901234");
        Usuario creado = usuarioServicio.crear(usuario);
        assertNotEquals("admin123", creado.getPassword());
        assertTrue(creado.getPassword().startsWith("$2a$") || creado.getPassword().startsWith("$2b$"));
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
        when(usuarioRepositorio.findByEmail("nuevo@dulcevida.com")).thenReturn(Optional.of(otro));
        assertThrows(DuplicateKeyException.class, () -> usuarioServicio.actualizar(1, cambios));
    }
}