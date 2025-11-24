package com.dulcevida.backend.configuracion;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {
    @Bean
    OpenAPI apiDulceVida() {
        return new OpenAPI()
            .components(new Components().addSecuritySchemes("bearerAuth",
                new SecurityScheme().type(SecurityScheme.Type.HTTP).scheme("bearer").bearerFormat("JWT")))
            // NOTA: mantenemos securityScheme para los endpoints, pero dejaremos
            // libre el acceso a /v3/api-docs via SecurityConfig para que Swagger UI cargue.
            .addSecurityItem(new SecurityRequirement().addList("bearerAuth"))
            .info(new Info()
                .title("API DulceVida - Pastelería Online")
                .description("Documentación de endpoints REST (Usuarios, Productos, Carrito, Auth). Autenticación mediante JWT Bearer.")
                .version("1.1.0"));
    }
}