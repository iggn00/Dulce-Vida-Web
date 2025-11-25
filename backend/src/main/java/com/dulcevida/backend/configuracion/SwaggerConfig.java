package com.dulcevida.backend.configuracion;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    private static final String SECURITY_SCHEME_NAME = "bearerAuth";

    @Bean
    public OpenAPI apiDulceVida() {
        return new OpenAPI()
            .info(apiInfo())
            .components(components())
            .addSecurityItem(new SecurityRequirement().addList(SECURITY_SCHEME_NAME));
    }

    private Info apiInfo() {
        return new Info()
            .title("API DulceVida - Pastelería Online")
            .description("Documentación de la API REST de DulceVida para gestión de usuarios, productos, carrito y pedidos.\n\nProyecto académico DUOC.")
            .version("1.1.0")
            .contact(new Contact().name("Equipo DulceVida").email("equipo@dulcevida.cl"));
    }

    private Components components() {
        return new Components()
            .addSecuritySchemes(SECURITY_SCHEME_NAME,
                new SecurityScheme()
                    .name(SECURITY_SCHEME_NAME)
                    .type(SecurityScheme.Type.HTTP)
                    .scheme("bearer")
                    .bearerFormat("JWT")
                    .description("Introduce el token JWT con el formato: **Bearer &lt;token&gt;**"));
    }
}
