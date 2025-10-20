package com.dulcevida.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.lang.NonNull;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;

@Configuration
public class RecursosEstaticosConfig implements WebMvcConfigurer {

    @Value("${app.uploads.dir:uploads/imagenes_productos}")
    private String directorioUploads;

    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        String ruta = Path.of(directorioUploads).toAbsolutePath().toUri().toString();
        registry.addResourceHandler("/" + directorioUploads + "/**")
                .addResourceLocations(ruta);
    }
}