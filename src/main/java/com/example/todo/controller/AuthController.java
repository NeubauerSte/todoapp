package com.example.todo.controller;

import com.example.todo.model.Account;
import com.example.todo.repository.AccountRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AccountRepository accountRepository;

    public AuthController(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    @GetMapping("/check")
    public ResponseEntity<?> checkAuth() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            return ResponseEntity.ok(false);
        }

        if (authentication.getPrincipal() instanceof UserDetails userDetails) {
            Optional<Account> accountOptional = accountRepository.findByUsername(userDetails.getUsername());

            if (accountOptional.isPresent()) {
                Account account = accountOptional.get();

                // JSON-Objekt mit relevanten Daten zurückgeben
                Map<String, Object> userData = new HashMap<>();
                userData.put("id", account.getId());
                userData.put("username", account.getUsername());
                userData.put("role", account.getRole());

                return ResponseEntity.ok(userData);
            }
        }

        return ResponseEntity.ok(false);
    }
}
