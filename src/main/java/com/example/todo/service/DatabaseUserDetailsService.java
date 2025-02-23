package com.example.todo.service;

import com.example.todo.model.Account;
import com.example.todo.repository.AccountRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DatabaseUserDetailsService implements UserDetailsService {
    private static final Logger logger = LoggerFactory.getLogger(DatabaseUserDetailsService.class);
    private final AccountRepository accountRepository;

    public DatabaseUserDetailsService(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        logger.info("🔍 Lade Benutzer '{}' mit Rollen...", username);

        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> {
                    logger.warn("❌ Benutzer '{}' nicht gefunden!", username);
                    return new UsernameNotFoundException("Benutzer nicht gefunden: " + username);
                });

        // Rollen in SimpleGrantedAuthority umwandeln
        List<SimpleGrantedAuthority> authorities = account.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.getName()))
                .collect(Collectors.toList());

        logger.info("✅ Benutzer '{}' hat folgende Rollen: {}", username, authorities);

        return new User(
                account.getUsername(),
                account.getPassword(),
                authorities
        );
    }
}