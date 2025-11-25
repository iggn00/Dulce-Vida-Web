package com.dulcevida.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegistroUsuarioDTO {
    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 150)
    private String nombre;

    @NotBlank(message = "El email es obligatorio")
    @Email(message = "El email debe ser válido")
    @Size(max = 150)
    private String email;

    @NotBlank(message = "La contraseña es obligatoria")
    @Size(min = 6, max = 100)
    private String password;

    @NotBlank(message = "El rol es obligatorio")
    private String rol;

    @Size(min = 7, max = 8, message = "El RUT debe tener entre 7 y 8 dígitos")
    private String rut;

    @Size(min = 1, max = 1, message = "El dígito verificador debe tener 1 carácter")
    private String dv;

    @Size(max = 150)
    private String region;

    @Size(max = 150)
    private String comuna;

    public RegistroUsuarioDTO() {}

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }
    public String getRut() { return rut; }
    public void setRut(String rut) { this.rut = rut; }
    public String getDv() { return dv; }
    public void setDv(String dv) { this.dv = dv; }
    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }
    public String getComuna() { return comuna; }
    public void setComuna(String comuna) { this.comuna = comuna; }
}