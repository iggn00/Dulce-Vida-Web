package com.dulcevida.backend.controlador;

import com.dulcevida.backend.modelo.Usuario;
import com.dulcevida.backend.servicio.UsuarioServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;
// Eliminado HttpSession

@RestController
@RequestMapping("/api")
public class AutenticacionControlador {

    @Autowired
    private UsuarioServicio usuarioServicio;


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credenciales) {
        String email = credenciales.get("email");
        String password = credenciales.get("password");
        Optional<Usuario> opt = usuarioServicio.buscarPorEmail(email);
        if (opt.isPresent() && password != null && password.equals(opt.get().getPassword())) {
            Usuario u = opt.get();
            // Aquí deberías generar y devolver el JWT
            String token = "GENERAR_JWT_AQUI"; // Reemplazar por lógica real
            return ResponseEntity.ok(Map.of(
                    "exito", true,
                    "token", token,
                    "id_usuario", u.getIdUsuario(),
                    "nombre", u.getNombre(),
                    "email", u.getEmail(),
                    "rol", u.getRol()
            ));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("exito", false, "mensaje", "Credenciales inválidas"));
    }

    // Eliminar endpoint de sesión, ya no es necesario con JWT

    // Eliminar endpoint de logout, ya no es necesario con JWT
}