package com.dulcevida.backend.configuracion;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {
    @Bean
    OpenAPI apiDulceVida() {
        return new OpenAPI().info(new Info()
                .title("API DulceVida - Pastelería Online")
                .description("Documentación de endpoints REST para gestión de usuarios y productos")
                .version("1.0.0"));
    }
}