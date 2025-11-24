package com.dulcevida.backend.configuracion;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SeguridadConfig {

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http
			// Para APIs REST se suele deshabilitar CSRF
			.csrf(AbstractHttpConfigurer::disable)

			// Stateless (ideal para JWT)
			.sessionManagement(session ->
				session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
			)

			// Reglas de autorización
			.authorizeHttpRequests(auth -> auth
				// Rutas de documentación Swagger / OpenAPI públicas
				.requestMatchers(
					"/v3/api-docs",
					"/v3/api-docs/**",
					"/swagger-ui.html",
					"/swagger-ui/**"
				).permitAll()
				// Aquí podrías agregar otras rutas públicas si lo necesitas
				// .requestMatchers("/auth/login", "/auth/register").permitAll()

				// El resto de las rutas requieren autenticación
				.anyRequest().authenticated()
			)

			// CORS por defecto (ajusta si tienes configuración específica)
			.cors(Customizer.withDefaults());

		return http.build();
	}
}