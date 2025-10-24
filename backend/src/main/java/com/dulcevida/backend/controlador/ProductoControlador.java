package com.dulcevida.backend.controlador;

import com.dulcevida.backend.modelo.Producto;
import com.dulcevida.backend.servicio.ProductoServicio;
import com.dulcevida.backend.servicio.UsuarioServicio;
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
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@RestController
@RequestMapping("/api/productos")
@Validated
public class ProductoControlador {

    private static final Logger log = LoggerFactory.getLogger(ProductoControlador.class);

    @Autowired
    private ProductoServicio productoServicio;

    @Autowired
    private UsuarioServicio usuarioServicio;

    @Value("${app.uploads.dir:uploads/imagenes_productos}")
    private String uploadsDir;

    @Value("${app.uploads.url-prefix:/uploads/imagenes_productos}")
    private String urlPrefix;

    private boolean esAdminPermitido(HttpSession session){
        Object id = session.getAttribute("usuarioId");
        if (id == null) return false;
    return usuarioServicio.buscarPorId((Integer) id)
        .map(u -> u.getRol() != null && u.getRol().equalsIgnoreCase("ADMINISTRADOR"))
        .orElse(false);
    }

    @GetMapping
    public List<Producto> listar() {
        List<Producto> productos = productoServicio.listar();
        log.info("Productos devueltos: {}", productos);
        return productos;
    }

    
    @GetMapping(params = {"page", "size"})
    public Page<Producto> listarPaginado(Pageable pageable) {
        return productoServicio.listar(pageable);
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
    public ResponseEntity<?> crear(@Valid @RequestBody Producto producto, HttpSession session) {
        if (!esAdminPermitido(session)) return ResponseEntity.status(HttpStatus.FORBIDDEN).body("No autorizado");
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(productoServicio.crear(producto));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("mensaje", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Integer id, @Valid @RequestBody Producto cambios, HttpSession session) {
        if (!esAdminPermitido(session)) return ResponseEntity.status(HttpStatus.FORBIDDEN).body("No autorizado");
        try {
            Optional<Producto> opt = productoServicio.actualizar(id, cambios);
            return opt.<ResponseEntity<?>>map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("mensaje", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> inhabilitar(@PathVariable Integer id, HttpSession session) {
        if (!esAdminPermitido(session)) return ResponseEntity.status(HttpStatus.FORBIDDEN).body("No autorizado");
        Optional<Producto> opt = productoServicio.inhabilitar(id);
        return opt.<ResponseEntity<?>>map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}/hard")
    public ResponseEntity<?> eliminar(@PathVariable Integer id, HttpSession session) {
        if (!esAdminPermitido(session)) return ResponseEntity.status(HttpStatus.FORBIDDEN).body("No autorizado");
        Optional<Producto> opt = productoServicio.buscarPorId(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();

        
        try {
            Producto p = opt.get();
            String img = p.getImagenUrl();
            if (img != null && !img.isBlank()) {
                
                String pref = urlPrefix.startsWith("/") ? urlPrefix : "/" + urlPrefix;
                String nombreArchivo;
                if (img.startsWith(pref)) {
                    nombreArchivo = img.substring(pref.length());
                    if (nombreArchivo.startsWith("/")) nombreArchivo = nombreArchivo.substring(1);
                } else {
                    
                    int i = img.lastIndexOf('/');
                    nombreArchivo = (i >= 0 && i + 1 < img.length()) ? img.substring(i + 1) : img;
                }
                Path rutaDir = Path.of(uploadsDir).toAbsolutePath().normalize();
                Path rutaArchivo = rutaDir.resolve(nombreArchivo);
                try {
                    Files.deleteIfExists(rutaArchivo);
                } catch (IOException ex) {
                    log.warn("No se pudo eliminar el archivo de imagen {}: {}", rutaArchivo, ex.toString());
                }
            }
        } catch (Exception ex) {
            log.warn("Error al preparar eliminación de imagen para producto {}: {}", id, ex.toString());
        }

        productoServicio.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<?> actualizarEstado(@PathVariable Integer id, @RequestBody Map<String, String> body, HttpSession session) {
        if (!esAdminPermitido(session)) return ResponseEntity.status(HttpStatus.FORBIDDEN).body("No autorizado");
        String estado = body != null ? body.get("estado") : null;
        if (estado == null || !(estado.equalsIgnoreCase("disponible") || estado.equalsIgnoreCase("agotado"))) {
            return ResponseEntity.badRequest().body("Estado inválido. Use 'disponible' o 'agotado'");
        }
        Optional<Producto> opt = productoServicio.actualizarEstado(id, estado.toLowerCase());
        return opt.<ResponseEntity<?>>map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/restaurar")
    public ResponseEntity<?> restaurar(@PathVariable Integer id, HttpSession session) {
        if (!esAdminPermitido(session)) return ResponseEntity.status(HttpStatus.FORBIDDEN).body("No autorizado");
        Optional<Producto> opt = productoServicio.actualizarEstado(id, "disponible");
        return opt.<ResponseEntity<?>>map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/imagen")
    public ResponseEntity<?> subirImagen(@PathVariable Integer id, @RequestParam MultipartFile archivo, HttpSession session) {
        if (!esAdminPermitido(session)) return ResponseEntity.status(HttpStatus.FORBIDDEN).body("No autorizado");
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
        if (archivo.getSize() > 10 * 1024 * 1024) { 
            return ResponseEntity.badRequest().body("La imagen no debe superar 10MB");
        }
        try {
            
            Path rutaDir = Path.of(uploadsDir).toAbsolutePath().normalize();
            Files.createDirectories(rutaDir);
            
            String original = archivo.getOriginalFilename();
            String nombreOriginal = StringUtils.cleanPath(original != null ? original : "unnamed");
            String nombreFinal = UUID.randomUUID() + "_" + nombreOriginal;
            Path rutaArchivo = rutaDir.resolve(nombreFinal);
            Files.copy(archivo.getInputStream(), rutaArchivo);
            
            Producto p = opt.get();
            String pref = urlPrefix.startsWith("/") ? urlPrefix : "/" + urlPrefix;
            if (pref.endsWith("/")) {
                p.setImagenUrl(pref + nombreFinal);
            } else {
                p.setImagenUrl(pref + "/" + nombreFinal);
            }
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