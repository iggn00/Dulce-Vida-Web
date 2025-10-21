package com.dulcevida.backend.modelo;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Usuario")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Integer idUsuario;

    @NotBlank
    @Size(max = 100, message = "El nombre no debe superar 100 caracteres")
    private String nombre;

    @Email
    @NotBlank
    @Size(max = 100, message = "El email no debe superar 100 caracteres")
    @Column(unique = true)
    private String email;

    @NotBlank
    @Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres")
    private String password; // Almacenada temporalmente en texto plano (sin cifrar)

    @NotBlank
    @Pattern(regexp = "ADMINISTRADOR|USUARIO", message = "El rol debe ser ADMINISTRADOR o USUARIO")
    private String rol; 
}