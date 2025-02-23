package com.example.todo.service;

import com.example.todo.model.Account;
import com.example.todo.model.Role;
import com.example.todo.repository.AccountRepository;
import com.example.todo.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Configuration
public class AdminInitializer {

    @Bean
    CommandLineRunner createAdmin(AccountRepository accountRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            String adminUsername = "admin";
            String adminPassword = "admin";

            // Überprüfen, ob der Admin schon existiert
            Optional<Account> existingAdmin = accountRepository.findByUsername(adminUsername);
            if (existingAdmin.isPresent()) {
                System.out.println("ℹ️ Admin existiert bereits.");
                return;
            }

            // Admin-Rolle abrufen oder neu erstellen
            Role adminRole = roleRepository.findByName("ADMIN")
                    .orElseGet(() -> {
                        Role newRole = new Role();
                        newRole.setName("ADMIN");
                        return roleRepository.save(newRole);
                    });

            // Neuen Admin-Account erstellen
            Account admin = new Account();
            admin.setUsername(adminUsername);
            admin.setPassword(passwordEncoder.encode(adminPassword)); // Passwort sicher speichern!

            Set<Role> roles = new HashSet<>();
            roles.add(adminRole);
            admin.setRoles(roles);

            accountRepository.save(admin);
            System.out.println("✅ Admin-Benutzer wurde erstellt.");
        };
    }
}