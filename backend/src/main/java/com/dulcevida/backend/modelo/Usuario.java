package com.dulcevida.backend.modelo;


import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Usuario")
@Data
@NoArgsConstructor
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    @JsonProperty("id_usuario")
    private Integer idUsuario;

    @NotBlank(message = "El nombre no debe estar vacío")
    @Size(max = 150, message = "El nombre no debe superar 150 caracteres")
    @JsonProperty("nombre")
    private String nombre;

    @NotBlank(message = "El email no debe estar vacío")
    @Email(message = "El email debe ser válido")
    @Size(max = 150, message = "El email no debe superar 150 caracteres")
    @Column(unique = true)
    @JsonProperty("email")
    private String email;

    @Size(min = 6, message = "La contraseña debe tener al menos 6 caracteres")
    @JsonProperty("password")
    private String password;

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @NotBlank(message = "El rol no debe estar vacío")
    @Pattern(regexp = "ADMINISTRADOR|USUARIO", message = "El rol debe ser ADMINISTRADOR o USUARIO")
    @JsonProperty("rol")
    private String rol; 

    @Pattern(regexp = "activo|inactivo", message = "El estado debe ser 'activo' o 'inactivo'")
    @JsonProperty("estado")
    private String estado = "activo";

    @Size(min = 7, max = 8, message = "El RUT debe tener entre 7 y 8 dígitos")
    @Pattern(regexp = "^\\d{7,8}$", message = "El RUT debe contener entre 7 y 8 dígitos")
    @Column(name = "rut")
    @JsonProperty("rut")
    private String rut;

    @Size(min = 1, max = 1, message = "El dígito verificador debe tener 1 carácter")
    @Pattern(regexp = "^[0-9Kk]$", message = "El dígito verificador debe ser del 0 al 9 o 'K'")
    @Column(name = "dv")
    @JsonProperty("dv")
    private String dv;

    @Size(max = 150, message = "La región no debe superar 150 caracteres")
    @Column(name = "region")
    @JsonProperty("region")
    private String region;

    @Size(max = 150, message = "La comuna no debe superar 150 caracteres")
    @Column(name = "comuna")
    @JsonProperty("comuna")
    private String comuna;
}