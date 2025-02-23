package com.example.todo.controller;

import com.example.todo.model.Account;
import com.example.todo.model.ToDo;
import com.example.todo.repository.AccountRepository;
import com.example.todo.repository.ToDoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/todos")
public class ToDoController {
    private static final Logger logger = LoggerFactory.getLogger(ToDoController.class);
    private final ToDoRepository toDoRepository;
    private final AccountRepository accountRepository;

    public ToDoController(ToDoRepository toDoRepository, AccountRepository accountRepository) {
        this.toDoRepository = toDoRepository;
        this.accountRepository = accountRepository;
    }

    @PreAuthorize("hasAnyAuthority('ROLE_USER', 'ROLE_ADMIN')")
    @GetMapping
    public ResponseEntity<List<ToDo>> getUserTodos(Authentication authentication) {
        logger.info("🔍 Benutzer '{}' ruft seine ToDo-Liste ab", authentication.getName());

        Account account = accountRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Benutzer nicht gefunden"));

        return ResponseEntity.ok(toDoRepository.findByAccount(account));
    }

    @PreAuthorize("hasAnyAuthority('ROLE_USER', 'ROLE_ADMIN')")
    @PostMapping
    public ResponseEntity<ToDo> createTodo(@RequestBody ToDo todo, Authentication authentication) {
        logger.info("📌 Benutzer '{}' erstellt ein neues ToDo", authentication.getName());

        Account account = accountRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Benutzer nicht gefunden"));

        todo.setAccount(account);
        return ResponseEntity.ok(toDoRepository.save(todo));
    }

    @PreAuthorize("hasAnyAuthority('ROLE_USER', 'ROLE_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTodo(@PathVariable Long id, Authentication authentication) {
        logger.info("🗑 Benutzer '{}' versucht, ToDo '{}' zu löschen", authentication.getName(), id);

        ToDo todo = toDoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ToDo nicht gefunden"));

        if (!todo.getAccount().getUsername().equals(authentication.getName())) {
            return ResponseEntity.status(403).body("Nicht erlaubt, fremde Todos zu löschen!");
        }

        toDoRepository.delete(todo);
        return ResponseEntity.ok("ToDo gelöscht!");
    }
}