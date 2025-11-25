package com.dulcevida.backend.config;

import com.dulcevida.backend.config.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
		return config.getAuthenticationManager();
	}

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthenticationFilter jwtFilter) throws Exception {
		http
			.csrf(csrf -> csrf.disable())
			.cors(cors -> {})
			.sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
			.authorizeHttpRequests(auth -> auth
                                .requestMatchers("/auth/**").permitAll()
                                .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/productos/**").permitAll()
                                .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/contactos/**").permitAll()
                                .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/categorias/**").permitAll()
                                // Carrito debe ser accesible para usuarios invitados (usa HttpSession)
                                .requestMatchers("/api/cart/**").permitAll()
                                .anyRequest().authenticated()
                        )
			.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
		return http.build();
	}
}
