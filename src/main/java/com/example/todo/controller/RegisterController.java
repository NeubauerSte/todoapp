package com.example.todo.controller;

import com.example.todo.model.Account;
import com.example.todo.model.Role;
import com.example.todo.repository.AccountRepository;
import com.example.todo.repository.RoleRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class RegisterController {
    private final AccountRepository accountRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public RegisterController(AccountRepository accountRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.accountRepository = accountRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Account account) {
        if (accountRepository.findByUsername(account.getUsername()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Benutzername bereits vergeben.");
        }

        // ❌ Sicherheitscheck: Niemand kann sich als "admin" registrieren!
        if ("admin".equalsIgnoreCase(account.getUsername())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Registrierung mit diesem Benutzernamen ist nicht erlaubt.");
        }

        account.setPassword(passwordEncoder.encode(account.getPassword()));

        // Sicherstellen, dass die USER-Rolle existiert
        Optional<Role> userRole = roleRepository.findByName("USER");
        if (userRole.isEmpty()) {
            Role newRole = new Role();
            newRole.setName("USER");
            roleRepository.save(newRole);
            userRole = Optional.of(newRole);
        }

        account.setRoles(Collections.singleton(userRole.get()));
        Account savedAccount = accountRepository.save(account);

        return ResponseEntity.ok(savedAccount);
    }
}