package com.dulcevida.backend.modelo;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;


@Entity
@Table(name = "Usuario")
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
    private String password; // Se almacena cifrada (BCrypt)

    @NotBlank
    @Pattern(regexp = "ADMINISTRADOR|EMPLEADO|CLIENTE", message = "El rol debe ser ADMINISTRADOR, EMPLEADO o CLIENTE")
    private String rol; // ADMINISTRADOR, EMPLEADO, etc.



    public Integer getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Integer idUsuario) { this.idUsuario = idUsuario; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }

    // El campo 'estado' se elimina para ajustar al esquema actualizado

}