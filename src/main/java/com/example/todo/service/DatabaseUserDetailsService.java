package com.example.todo.service;

import com.example.todo.model.Account;
import com.example.todo.repository.AccountRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DatabaseUserDetailsService implements UserDetailsService {

    private final AccountRepository accountRepository;

    public DatabaseUserDetailsService ( AccountRepository accountRepository) {
        System.out.println("🛠️ DatabaseUserDetailsService wird erstellt!");
        this.accountRepository = accountRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        System.out.println("🔍 `loadUserByUsername` AUFGERUFEN! Benutzer: " + username);

        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> {
                    System.out.println("⚠ Benutzer nicht gefunden: " + username);
                    return new UsernameNotFoundException("Benutzer nicht gefunden: " + username);
                });

        System.out.println("✅ Benutzer gefunden: " + account.getUsername());

        return new User( account.getUsername(), account.getPassword(), List.of ( new SimpleGrantedAuthority ( account.getRole ( )) ));
    }






}
