package com.dulcevida.backend.controlador;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class AuthControladorTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

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
        registro.put("region", "Región de Prueba");
        registro.put("comuna", "Comuna Prueba");

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registro)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id_usuario").exists())
                .andExpect(jsonPath("$.email").value(email))
                .andExpect(jsonPath("$.rol").value("USUARIO"));
    }

    @Test
    @DisplayName("Login exitoso con usuario registrado")
    void testLoginExitoso() throws Exception {
        String email = "testlogin_" + UUID.randomUUID() + "@mail.com";
        var registro = new java.util.HashMap<String, Object>();
        registro.put("nombre", "Login User");
        registro.put("email", email);
        registro.put("password", "test1234");
        registro.put("rol", "USUARIO");
        registro.put("rut", "87654321");
        registro.put("dv", "1");
        registro.put("region", "Región X");
        registro.put("comuna", "Comuna X");

        // Registrar usuario
        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registro)))
                .andExpect(status().isCreated());

        // Login
        var login = new java.util.HashMap<String, Object>();
        login.put("email", email);
        login.put("password", "test1234");

        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id_usuario").exists())
                .andExpect(jsonPath("$.email").value(email))
                .andExpect(jsonPath("$.rol").value("USUARIO"));
    }

    @Test
    @DisplayName("Login falla con credenciales incorrectas")
    void testLoginFalla() throws Exception {
        var login = new java.util.HashMap<String, Object>();
        login.put("email", "noexiste@mail.com");
        login.put("password", "incorrecta");

        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.mensaje").value("Credenciales inválidas"));
    }
}
