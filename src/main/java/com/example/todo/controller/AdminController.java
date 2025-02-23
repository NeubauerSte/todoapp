package com.example.todo.controller;

import com.example.todo.model.Account;
import com.example.todo.model.Role;
import com.example.todo.model.ToDo;
import com.example.todo.repository.AccountRepository;
import com.example.todo.repository.ToDoRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class AdminController {
    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);
    private static final Long ADMIN_ROLE_ID = 2L; // 🔥 Admin-Rolle ist ID 2

    private final AccountRepository accountRepository;
    private final ToDoRepository toDoRepository;

    @PersistenceContext
    private EntityManager entityManager; // Hibernate Cache-Kontrolle

    public AdminController(AccountRepository accountRepository, ToDoRepository toDoRepository) {
        this.accountRepository = accountRepository;
        this.toDoRepository = toDoRepository;
    }

    /** 🔍 Alle Benutzer abrufen */
    @GetMapping("/users")
    public ResponseEntity<List<Account>> getAllUsers() {
        logger.info("🔍 Admin ruft alle Benutzer ab");
        return ResponseEntity.ok(accountRepository.findAll());
    }

    /** 🔑 Admin-Rolle zuweisen */
    @PostMapping("/roles")
    @Transactional
    public ResponseEntity<String> assignRole(@RequestParam String username, Authentication authentication) {
        return modifyRole(username, authentication, true);
    }

    /** ❌ Admin-Rolle entziehen */
    @DeleteMapping("/roles")
    @Transactional
    public ResponseEntity<String> removeRole(@RequestParam String username, Authentication authentication) {
        return modifyRole(username, authentication, false);
    }

    /** 📌 Todos eines bestimmten Benutzers abrufen */
    @GetMapping("/todos/{username}")
    public ResponseEntity<List<ToDo>> getUserTodos(@PathVariable String username) {
        logger.info("📌 Admin ruft Todos von Benutzer '{}' ab", username);
        Account account = getAccountOrThrow(username);
        return ResponseEntity.ok(toDoRepository.findByAccount(account));
    }

    /** 🗑 Admin kann jedes Todo löschen */
    @DeleteMapping("/todos/{id}")
    public ResponseEntity<?> deleteTodoByAdmin(@PathVariable Long id) {
        logger.info("🗑 Admin löscht ToDo mit ID '{}'", id);
        ToDo todo = toDoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ToDo nicht gefunden"));
        toDoRepository.delete(todo);
        return ResponseEntity.ok("ToDo erfolgreich gelöscht!");
    }

    /** 🔍 Benutzer holen oder Fehler werfen */
    private Account getAccountOrThrow(String username) {
        return accountRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Benutzer nicht gefunden"));
    }

    /** 🚀 Admin-Rolle hinzufügen oder entfernen mit **RAW SQL** */
    @Transactional
    protected ResponseEntity<String> modifyRole(String username, Authentication authentication, boolean adding) {
        Account requestingAdmin = getAccountOrThrow(authentication.getName());
        Account targetUser = getAccountOrThrow(username);

        logger.debug("📌 Benutzer '{}' hat folgende Rollen vor Änderung: {}", targetUser.getUsername(), targetUser.getRoles());

        if (adding) {
            if (targetUser.getRoles().stream().noneMatch(r -> r.getId().equals(ADMIN_ROLE_ID))) {
                targetUser.getRoles().add(new Role(ADMIN_ROLE_ID, "ADMIN"));
                accountRepository.save(targetUser);
                entityManager.flush();
                entityManager.clear();
                logger.info("✅ Admin-Rolle erfolgreich zugewiesen an '{}'", targetUser.getUsername());
                return ResponseEntity.ok("✅ Admin-Rolle erfolgreich zugewiesen!");
            }
        } else {
            accountRepository.removeRoleFromUser(targetUser.getId(), ADMIN_ROLE_ID);
            entityManager.flush();
            entityManager.clear();
            logger.info("✅ Admin-Rolle erfolgreich entfernt von '{}'", targetUser.getUsername());
            return ResponseEntity.ok("✅ Admin-Rolle erfolgreich entfernt!");
        }

        return ResponseEntity.badRequest().body("🚨 Fehler: Konnte Admin-Rolle nicht zuweisen/entfernen!");
    }
}