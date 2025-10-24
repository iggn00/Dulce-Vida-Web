package com.dulcevida.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.lang.NonNull;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;

import java.nio.file.Path;

@Configuration
public class RecursosEstaticosConfig implements WebMvcConfigurer {

    @Value("${app.uploads.dir:uploads/imagenes_productos}")
    private String uploadsDir; 

    @Value("${app.uploads.url-prefix:/uploads/imagenes_productos}")
    private String urlPrefix; 

    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        
        String fsLocation = Path.of(uploadsDir).toAbsolutePath().toUri().toString();
        
        String normalizedPrefix = urlPrefix.startsWith("/") ? urlPrefix : "/" + urlPrefix;
        if (!normalizedPrefix.endsWith("/**")) {
            if (normalizedPrefix.endsWith("/")) {
                normalizedPrefix = normalizedPrefix + "**";
            } else {
                normalizedPrefix = normalizedPrefix + "/**";
            }
        }
        registry.addResourceHandler(normalizedPrefix)
                .addResourceLocations(fsLocation);
    }

    @Override
    public void addViewControllers(@NonNull ViewControllerRegistry registry) {
        registry.addViewController("/").setViewName("forward:/index.html");
        registry.addViewController("/{path:[^\\.]*}").setViewName("forward:/index.html");
    }
}