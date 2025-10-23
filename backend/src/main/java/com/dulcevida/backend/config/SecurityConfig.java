package com.dulcevida.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class SecurityConfig implements WebMvcConfigurer {
    // Seguridad deshabilitada intencionalmente. CORS y recursos estáticos se configuran en clases dedicadas.
}
