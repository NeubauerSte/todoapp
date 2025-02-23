package com.example.todo.controller;

import com.example.todo.model.Account;
import com.example.todo.payload.requests.LoginRequest;
import com.example.todo.repository.AccountRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class LoginController {
    private static final Logger logger = LoggerFactory.getLogger(LoginController.class);

    private final AuthenticationManager authenticationManager;
    private final AccountRepository accountRepository;

    public LoginController(AuthenticationManager authenticationManager, AccountRepository accountRepository) {
        this.authenticationManager = authenticationManager;
        this.accountRepository = accountRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest, HttpSession session) {
        logger.info("🔑 Login-Versuch für Benutzer: {}", loginRequest.getUsername());

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
                                                                              );

            session.setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());
            SecurityContextHolder.getContext().setAuthentication(authentication);

            Optional<Account> account = accountRepository.findByUsername(loginRequest.getUsername());

            if (account.isPresent()) {
                logger.info("✅ Erfolgreich eingeloggt: {}", loginRequest.getUsername());
                return ResponseEntity.ok(account.get());
            } else {
                logger.warn("❌ Benutzer nicht gefunden: {}", loginRequest.getUsername());
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Benutzer nicht gefunden");
            }

        } catch (Exception e) {
            logger.error("❌ Fehler beim Login für Benutzer {}: {}", loginRequest.getUsername(), e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Ungültige Anmeldedaten");
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpSession session) {
        session.invalidate();
        SecurityContextHolder.clearContext();
        logger.info("✅ Benutzer wurde erfolgreich ausgeloggt.");
        return ResponseEntity.ok("Logout erfolgreich!");
    }
}