package com.example.todo.controller;

import com.example.todo.model.Account;
import com.example.todo.model.Role;
import com.example.todo.model.ToDo;
import com.example.todo.repository.AccountRepository;
import com.example.todo.repository.RoleRepository;
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
    private static final Long ADMIN_ROLE_ID = 2L; // 🔥 Admin-Rolle hat die ID 2

    private final AccountRepository accountRepository;
    private final RoleRepository roleRepository;
    private final ToDoRepository toDoRepository;

    @PersistenceContext
    private EntityManager entityManager;

    public AdminController(AccountRepository accountRepository, RoleRepository roleRepository, ToDoRepository toDoRepository) {
        this.accountRepository = accountRepository;
        this.roleRepository = roleRepository;
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

    /** 🚀 Admin-Rolle hinzufügen oder entfernen */
    @Transactional
    protected ResponseEntity<String> modifyRole(String username, Authentication authentication, boolean adding) {
        Account requestingAdmin = getAccountOrThrow(authentication.getName());
        Account targetUser = getAccountOrThrow(username);

        logger.debug("📌 Admin '{}' versucht die Rolle zu ändern für Benutzer '{}'", requestingAdmin.getUsername(), targetUser.getUsername());

        Role adminRole = roleRepository.findById(ADMIN_ROLE_ID)
                .orElseThrow(() -> new RuntimeException("❌ Admin-Rolle nicht gefunden!"));

        if (adding) {
            if (!targetUser.getRoles().contains(adminRole)) {
                targetUser.getRoles().add(adminRole);
                accountRepository.save(targetUser);
                entityManager.flush();
                entityManager.clear();
                logger.info("✅ Admin '{}' hat die Admin-Rolle zugewiesen an '{}'", requestingAdmin.getUsername(), targetUser.getUsername());
                return ResponseEntity.ok("✅ Admin-Rolle erfolgreich zugewiesen!");
            } else {
                return ResponseEntity.badRequest().body("❌ Benutzer hat die Admin-Rolle bereits!");
            }
        } else {
            if (targetUser.getRoles().contains(adminRole)) {
                accountRepository.removeRoleFromUser(targetUser, adminRole);
                entityManager.flush();
                entityManager.clear();
                logger.info("✅ Admin '{}' hat die Admin-Rolle entfernt von '{}'", requestingAdmin.getUsername(), targetUser.getUsername());
                return ResponseEntity.ok("✅ Admin-Rolle erfolgreich entfernt!");
            } else {
                return ResponseEntity.badRequest().body("❌ Benutzer hat keine Admin-Rolle!");
            }
        }
    }
}