package com.dulcevida.backend.controlador;

import com.dulcevida.backend.modelo.Contacto;
import com.dulcevida.backend.repositorio.ContactoRepositorio;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contactos")
public class ContactoControlador {

    @Autowired
    private ContactoRepositorio contactoRepositorio;

    @PostMapping
    public ResponseEntity<Contacto> crear(@Valid @RequestBody Contacto contacto) {
        return ResponseEntity.ok(contactoRepositorio.save(contacto));
    }

    @GetMapping
    public List<Contacto> listar() {
        return contactoRepositorio.findAll();
    }
}
