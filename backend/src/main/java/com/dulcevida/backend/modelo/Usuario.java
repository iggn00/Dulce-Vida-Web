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
    private String password; 

    @NotBlank
    @Pattern(regexp = "ADMINISTRADOR|USUARIO", message = "El rol debe ser ADMINISTRADOR o USUARIO")
    private String rol; 

    @NotBlank
    @Pattern(regexp = "activo|inactivo", message = "El estado debe ser 'activo' o 'inactivo'")
    private String estado = "activo";

    
    @NotBlank
    @Size(min = 8, max = 8, message = "El RUT debe tener 8 dígitos (sin puntos ni guion)")
    @Pattern(regexp = "^\\d{8}$", message = "El RUT debe contener exactamente 8 dígitos (sin puntos ni guion)")
    @Column(name = "rut")
    private String rut;

    
    @NotBlank
    @Size(min = 1, max = 1, message = "El dígito verificador debe tener 1 carácter")
    @Pattern(regexp = "^[1-9Kk]$", message = "El dígito verificador debe ser del 1 al 9 o 'K'")
    @Column(name = "dv")
    private String dv;

    
    @NotBlank
    @Size(max = 100, message = "La región no debe superar 100 caracteres")
    @Column(name = "region")
    private String region;

    @NotBlank
    @Size(max = 100, message = "La comuna no debe superar 100 caracteres")
    @Column(name = "comuna")
    private String comuna;
}