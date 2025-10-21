package com.dulcevida.backend.modelo;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "Contactos")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Contacto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_contacto")
    private Integer idContacto;

    @NotBlank
    @Size(max = 100)
    private String nombre;

    @Email
    @NotBlank
    @Size(max = 100)
    private String email;

    @Size(max = 200)
    private String asunto;

    @NotBlank
    @Lob
    private String mensaje;

    @Column(name = "fecha_envio")
    private LocalDateTime fechaEnvio = LocalDateTime.now();
}
