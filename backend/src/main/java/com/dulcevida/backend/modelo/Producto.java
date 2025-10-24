package com.dulcevida.backend.modelo;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "Productos")
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_producto")
    private Integer idProducto;

    @NotBlank
    @Size(max = 100, message = "El nombre no debe superar 100 caracteres")
    private String nombre;

    @NotBlank
    @Size(max = 1000, message = "La descripción no debe superar 1000 caracteres")
    @Column(length = 1000)
    private String descripcion;

    @Positive
    private BigDecimal precio;

    @Min(0)
    private Integer stock;

    @NotBlank
    @Pattern(regexp = "disponible|agotado", message = "El estado debe ser 'disponible' o 'agotado'")
    private String estado;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "id_categoria", nullable = false)
    private Categoria categoria;

    @Size(max = 255, message = "La URL de imagen no debe superar 255 caracteres")
    @Column(name = "imagen_url")
    private String imagenUrl;

    @Column(columnDefinition = "TEXT")
    private String ingredientes;
    
    


    
}