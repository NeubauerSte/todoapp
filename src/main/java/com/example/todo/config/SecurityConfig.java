package com.example.todo.config;

import com.example.todo.repository.AccountRepository;
import com.example.todo.service.DatabaseUserDetailsService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.session.HttpSessionEventPublisher;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import static org.springframework.security.config.Customizer.withDefaults;
import static org.springframework.security.config.http.SessionCreationPolicy.*;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .headers(headers -> headers
                                 .frameOptions(HeadersConfigurer.FrameOptionsConfig::disable) // **X-Frame-Options deaktivieren**
                        )
                .authorizeHttpRequests(auth -> auth
                                               .requestMatchers("/login", "/public/**", "/api/auth/login", "/api/auth/register", "/api/auth/check").permitAll() // <-- `/api/auth/check` hinzugefügt
                                               .requestMatchers("/todos/**").authenticated()
                                               .requestMatchers(new AntPathRequestMatcher("/h2-console/**")).permitAll()
                                               .anyRequest().authenticated()
                                      )

                .sessionManagement(session -> session
                                           .sessionCreationPolicy ( IF_REQUIRED ) // **Sorgt dafür, dass Sessions immer erstellt werden**
                                  )
                .exceptionHandling(exception -> exception
                                           .authenticationEntryPoint((request, response, authException) -> {
                                               System.out.println("🚨 AUTH ERROR: " + authException.getMessage());
                                               response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                                               response.getWriter().write("Unauthorized");
                                           })
                                  )
                .logout(logout -> logout
                        .logoutUrl("/api/auth/logout") // Klar definierter API-Pfad
                        .logoutSuccessHandler((request, response, authentication) -> {
                            response.setStatus(HttpServletResponse.SC_OK);
                            response.getWriter().write("Logout erfolgreich");
                        })
                        .invalidateHttpSession(true) // Session löschen
                        .deleteCookies("JSESSIONID") // Cookies löschen
                        .permitAll()
                       );



        return http.build();
    }


    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // **Benutzt sichere Verschlüsselung**
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        System.out.println("✅ AuthenticationManager wird mit UserDetailsService konfiguriert!");
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public HttpSessionEventPublisher httpSessionEventPublisher() {
        return new HttpSessionEventPublisher(); // **Damit Spring Security Sessions trackt**
    }
}
