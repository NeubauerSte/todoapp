package com.example.todo.controller;

import com.example.todo.model.Account;
import com.example.todo.repository.AccountRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class RegisterController {

    private final AccountRepository accountRepository;
    private final PasswordEncoder   passwordEncoder;

    public RegisterController ( AccountRepository accountRepository , PasswordEncoder passwordEncoder ) {
        this.accountRepository = accountRepository;
        this.passwordEncoder   = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Account account) {
        if (accountRepository.findByUsername(account.getUsername()).isPresent()) {
            return ResponseEntity.status ( HttpStatus.BAD_REQUEST ).body ( "Benutzername bereits vergeben." );
        }

        account.setPassword(passwordEncoder.encode(account.getPassword())); // Passwort hashen
        account.setRole("USER"); // Standardrolle setzen
        Account savedAccount = accountRepository.save(account);

        // Anstatt nur "Registrierung erfolgreich" zurückzugeben, schicken wir das Benutzerobjekt
        return ResponseEntity.ok(savedAccount);
    }


}
