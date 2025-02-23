package com.example.todo.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    private static final Logger logger = LoggerFactory.getLogger(SecurityConfig.class);

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        logger.info("🔐 Konfiguriere Security mit CORS & Rollen...");

        http
                .cors (cors -> cors.configurationSource ( corsConfigurationSource() ))
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                                               .requestMatchers("/api/admin/**").hasAuthority("ROLE_ADMIN")
                                               .requestMatchers("/api/todos/**").hasAnyAuthority("ROLE_USER", "ROLE_ADMIN")
                                               .requestMatchers("/api/public/**", "/api/auth/**").permitAll()
                                               .anyRequest().authenticated()
                                      )
                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
                .logout(logout -> logout
                        .logoutUrl("/api/auth/logout")  // Logout-URL richtig setzen
                        .logoutSuccessHandler((request, response, authentication) -> {
                            response.setStatus(200); // Setzt 200 OK als Logout-Response
                        })
                        .invalidateHttpSession(true)
                        .deleteCookies("JSESSIONID")
                        .permitAll()
                       );

        return http.build();
    }

    // CORS-Konfiguration in Spring Security einbinden
    @Bean
    public
    UrlBasedCorsConfigurationSource corsConfigurationSource ( ) {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins ( List.of ( "http://localhost:5173" ) ); // Erlaubt das React-Frontend
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")); // Erlaubt alle wichtigen Methoden
        config.setAllowedHeaders(List.of("Content-Type", "Authorization")); // Erlaubte Header
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }


    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
}