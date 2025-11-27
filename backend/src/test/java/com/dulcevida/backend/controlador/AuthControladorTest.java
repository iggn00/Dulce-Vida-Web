package com.dulcevida.backend.controlador;

import com.dulcevida.backend.config.security.JwtAuthenticationFilter;
import com.dulcevida.backend.config.security.JwtUtil;
import com.dulcevida.backend.modelo.Usuario;
import com.dulcevida.backend.servicio.UsuarioServicio;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AutenticacionControlador.class)
public class AuthControladorTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    // --- MOCKS: Simulamos servicios y componentes de seguridad ---

    @MockBean
    private UsuarioServicio usuarioServicio;

    @MockBean
    private JwtUtil jwtUtil;

    @MockBean
    private PasswordEncoder passwordEncoder;

    // IMPORTANTE: Mockeamos el filtro porque SecurityConfig lo necesita para cargar
    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    // -------------------------------------------------------------

    @Test
    @DisplayName("Registro de usuario exitoso")
    void testRegistroUsuarioExitoso() throws Exception {
        String email = "testuser_" + UUID.randomUUID() + "@mail.com";

        var registro = new java.util.HashMap<String, Object>();
        registro.put("nombre", "Test User");
        registro.put("email", email);
        registro.put("password", "test1234");
        registro.put("rol", "USUARIO");
        registro.put("rut", "12345678");
        registro.put("dv", "9");

        // Simulamos la respuesta del servicio al crear
        Usuario usuarioCreado = new Usuario();
        usuarioCreado.setIdUsuario(1); // Cambiado de 1L a 1 (Integer)
        usuarioCreado.setEmail(email);
        usuarioCreado.setNombre("Test User");
        usuarioCreado.setRol("USUARIO");

        when(usuarioServicio.crear(any(Usuario.class))).thenReturn(usuarioCreado);

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registro)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id_usuario").exists())
                .andExpect(jsonPath("$.email").value(email));
    }

    @Test
    @DisplayName("Login exitoso")
    void testLoginExitoso() throws Exception {
        String email = "login@mail.com";
        String password = "password123";

        // 1. Preparamos el usuario que "devuelve" la base de datos simulada
        Usuario usuarioEnBd = new Usuario();
        usuarioEnBd.setIdUsuario(10); // Cambiado de 10L a 10 (Integer)
        usuarioEnBd.setEmail(email);
        usuarioEnBd.setPassword("password_encriptada");
        usuarioEnBd.setNombre("Usuario Login");
        usuarioEnBd.setRol("USUARIO");

        // 2. Comportamiento de los Mocks
        when(usuarioServicio.buscarPorEmail(email)).thenReturn(Optional.of(usuarioEnBd));
        // Simulamos que la contraseña coincide
        when(passwordEncoder.matches(eq(password), any())).thenReturn(true);
        // Simulamos la generación del token
        when(jwtUtil.generateToken(any(), any())).thenReturn("eyJhbGciOiJIUzI1...");

        // 3. Ejecutamos el request
        var login = new java.util.HashMap<String, Object>();
        login.put("email", email);
        login.put("password", password);

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.email").value(email));
    }

    @Test
    @DisplayName("Login falla con credenciales incorrectas")
    void testLoginFalla() throws Exception {
        String email = "fallo@mail.com";

        // Simulamos que el usuario NO existe
        when(usuarioServicio.buscarPorEmail(email)).thenReturn(Optional.empty());

        var login = new java.util.HashMap<String, Object>();
        login.put("email", email);
        login.put("password", "cualquiera");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.mensaje").value("Credenciales inválidas"));
    }
}