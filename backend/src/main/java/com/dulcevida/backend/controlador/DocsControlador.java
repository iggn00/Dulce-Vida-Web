package com.dulcevida.backend.controlador;

import io.swagger.v3.oas.models.OpenAPI;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/docs")
public class DocsControlador {

    @Autowired
    private OpenAPI openAPI;

    @GetMapping("/openapi")
    public OpenAPI obtenerOpenApi() {
        // Devuelve el objeto OpenAPI como JSON para documentar si /v3/api-docs está bloqueado.
        return openAPI;
    }
}
