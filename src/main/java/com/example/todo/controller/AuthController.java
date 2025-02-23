package com.example.todo.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @GetMapping("/check")
    public ResponseEntity<?> checkAuth(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.ok(Collections.singletonMap("authenticated", false));
        }

        // Rollen aus der Spring Security Authentication extrahieren
        var roles = authentication.getAuthorities().stream()
                .map(authority -> authority.getAuthority().replace("ROLE_", "")) // "ROLE_ADMIN" -> "ADMIN"
                .toList();

        return ResponseEntity.ok( Map.of (
                "username", authentication.getName(),
                "roles", roles
                                         ));
    }

    @GetMapping("/debug")
    public ResponseEntity<?> debugAuth(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Nicht authentifiziert");
        }

        return ResponseEntity.ok("Authentifiziert als: " + authentication.getName() + " | Rollen: " + authentication.getAuthorities());
    }
}