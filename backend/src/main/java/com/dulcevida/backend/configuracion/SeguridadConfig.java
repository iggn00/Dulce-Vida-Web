package com.dulcevida.backend.configuracion;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

// Configuración de seguridad antigua. Mantener como referencia, pero sin registrar beans
// para evitar conflictos con `SecurityConfig`.

@Configuration
public class SeguridadConfig {

	// Bean deshabilitado para no duplicar `securityFilterChain`.
	// Si necesitas reglas alternativas, agrégalas en `SecurityConfig`.

}