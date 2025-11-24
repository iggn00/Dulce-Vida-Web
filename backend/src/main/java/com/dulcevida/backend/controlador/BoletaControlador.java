package com.dulcevida.backend.controlador;

import com.dulcevida.backend.modelo.Boleta;
import com.dulcevida.backend.modelo.Usuario;
import com.dulcevida.backend.repositorio.BoletaRepositorio;
import com.dulcevida.backend.repositorio.DetalleBoletaRepositorio;
import com.dulcevida.backend.servicio.UsuarioServicio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/boletas")
public class BoletaControlador {

    @Autowired
    private BoletaRepositorio boletaRepositorio;
    @Autowired
    private DetalleBoletaRepositorio detalleBoletaRepositorio;
    @Autowired
    private UsuarioServicio usuarioServicio;

    private Usuario usuarioSesion(HttpSession session){
        Object id = session.getAttribute("usuarioId");
        if (id == null) return null;
        return usuarioServicio.buscarPorId((Integer)id).orElse(null);
    }

    @GetMapping("/mias")
    public ResponseEntity<?> misBoletas(@RequestParam(defaultValue = "0") int page,
                                        @RequestParam(defaultValue = "10") int size,
                                        HttpSession session){
        Usuario u = usuarioSesion(session);
        if (u == null) return ResponseEntity.status(401).build();
        Page<Boleta> boletas = boletaRepositorio.findByPedido_Cliente_EmailOrderByFechaEmisionDesc(u.getEmail(), PageRequest.of(page, size));
        return ResponseEntity.ok(boletas);
    }

    @GetMapping("/admin")
    public ResponseEntity<?> todas(@RequestParam(defaultValue = "0") int page,
                                   @RequestParam(defaultValue = "10") int size,
                                   HttpSession session){
        Usuario u = usuarioSesion(session);
        if (u == null || u.getRol()==null || !u.getRol().equalsIgnoreCase("ADMINISTRADOR")){
            return ResponseEntity.status(403).build();
        }
        Page<Boleta> boletas = boletaRepositorio.findAllByOrderByFechaEmisionDesc(PageRequest.of(page,size));
        return ResponseEntity.ok(boletas);
    }

    @GetMapping("/{id}/detalles")
    public ResponseEntity<?> detalles(@PathVariable Integer id, HttpSession session){
        Usuario u = usuarioSesion(session);
        if (u == null) return ResponseEntity.status(401).build();
        return boletaRepositorio.findById(id)
                .map(b->{
                    var dets = detalleBoletaRepositorio.findByBoleta(b);
                    return ResponseEntity.ok(java.util.Map.of(
                            "boleta", b,
                            "detalles", dets
                    ));
                })
                .orElseGet(()->ResponseEntity.notFound().build());
    }
}
