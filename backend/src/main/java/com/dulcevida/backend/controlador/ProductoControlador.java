package com.dulcevida.backend.controlador;

import com.dulcevida.backend.modelo.Producto;
import com.dulcevida.backend.servicio.ProductoServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.validation.annotation.Validated;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/productos")
@Validated
public class ProductoControlador {

    private static final Logger log = LoggerFactory.getLogger(ProductoControlador.class);

    @Autowired
    private ProductoServicio productoServicio;

    @Value("${app.uploads.dir:uploads/imagenes_productos}")
    private String directorioUploads;

    @GetMapping
    public List<Producto> listar() {
        List<Producto> productos = productoServicio.listar();
        log.info("Productos devueltos: {}", productos);
        return productos;
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> detalle(@PathVariable Integer id) {
        Optional<Producto> opt = productoServicio.buscarPorId(id);
        return opt.<ResponseEntity<?>>map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/buscar")
    public List<Producto> buscar(@RequestParam(required = false) String q,
                                 @RequestParam(value = "categoria", required = false) String categoriaNombre,
                                 @RequestParam(required = false) Integer idCategoria) {
        if (idCategoria != null) {
            return productoServicio.buscarPorCategoriaId(idCategoria);
        }
        if (categoriaNombre != null && !categoriaNombre.isBlank()) {
            return productoServicio.buscarPorCategoriaNombre(categoriaNombre);
        }
        if (q != null && !q.isBlank()) {
            return productoServicio.buscarPorNombre(q);
        }
        return productoServicio.listar();
    }

    @PostMapping
    public ResponseEntity<Producto> crear(@Valid @RequestBody Producto producto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(productoServicio.crear(producto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Integer id, @Valid @RequestBody Producto cambios) {
        Optional<Producto> opt = productoServicio.actualizar(id, cambios);
        return opt.<ResponseEntity<?>>map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> inhabilitar(@PathVariable Integer id) {
        Optional<Producto> opt = productoServicio.inhabilitar(id);
        return opt.<ResponseEntity<?>>map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/imagen")
    public ResponseEntity<?> subirImagen(@PathVariable Integer id, @RequestParam MultipartFile archivo) {
        Optional<Producto> opt = productoServicio.buscarPorId(id);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        if (archivo.isEmpty()) {
            return ResponseEntity.badRequest().body("El archivo de imagen es requerido");
        }
        String contentType = archivo.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            return ResponseEntity.badRequest().body("El archivo debe ser una imagen válida");
        }
        if (archivo.getSize() > 5 * 1024 * 1024) { // 5MB
            return ResponseEntity.badRequest().body("La imagen no debe superar 5MB");
        }
        try {
            // Crear directorio si no existe
            Path rutaDir = Path.of(directorioUploads).toAbsolutePath().normalize();
            Files.createDirectories(rutaDir);
            // Nombre único
            String original = archivo.getOriginalFilename();
            String nombreOriginal = StringUtils.cleanPath(original != null ? original : "unnamed");
            String nombreFinal = UUID.randomUUID() + "_" + nombreOriginal;
            Path rutaArchivo = rutaDir.resolve(nombreFinal);
            Files.copy(archivo.getInputStream(), rutaArchivo);
            // Guardar URL relativa
            Producto p = opt.get();
            p.setImagenUrl("/" + directorioUploads + "/" + nombreFinal);
            productoServicio.actualizar(id, p);
            return ResponseEntity.ok(p);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al subir la imagen");
        }
    }

    @GetMapping("/bajo-stock")
    public List<Producto> bajoStock(@RequestParam(defaultValue = "5") @Min(0) Integer umbral) {
        return productoServicio.bajoStock(umbral);
    }
}