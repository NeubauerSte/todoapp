package com.example.todo.config;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.session.HttpSessionEventPublisher;

import static org.springframework.security.config.http.SessionCreationPolicy.ALWAYS;
import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                                               .requestMatchers("/login", "/public/**", "/api/auth/login").permitAll()
                                               .requestMatchers("/todos/**").authenticated()
                                               .anyRequest().authenticated()
                                      )
                .sessionManagement(session -> session
                                           .sessionCreationPolicy(ALWAYS) // **Sorgt dafür, dass Sessions immer erstellt werden**
                                  )
                .exceptionHandling(exception -> exception
                                           .authenticationEntryPoint((request, response, authException) -> {
                                               response.setStatus ( HttpServletResponse.SC_UNAUTHORIZED );
                                               response.getWriter().write("Unauthorized");
                                           })
                                  )
                .formLogin(login -> login
                                   .loginPage("/login").permitAll()
                                   .defaultSuccessUrl("/todos", true)
                                   .failureHandler((request, response, exception) -> {
                                       response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                                       response.getWriter().write("Login failed");
                                   })
                          )
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessUrl("/public")
                        .permitAll()
                       );

        return http.build();
    }

    @Bean
    public UserDetailsService userDetailsService(PasswordEncoder passwordEncoder) {
        UserDetails user = User.builder()
                .username("admin")
                .password(passwordEncoder.encode("admin")) // **Passwort wird mit BCrypt gespeichert**
                .roles("USER")
                .build();
        return new InMemoryUserDetailsManager(user);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // **Benutzt sichere Verschlüsselung**
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public HttpSessionEventPublisher httpSessionEventPublisher() {
        return new HttpSessionEventPublisher(); // **Damit Spring Security Sessions trackt**
    }
}
