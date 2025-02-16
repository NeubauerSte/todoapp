package com.example.todo.controller;

import com.example.todo.model.Account;
import com.example.todo.model.ToDo;
import com.example.todo.repository.AccountRepository;
import com.example.todo.repository.ToDoRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/todos")
public class ToDoController {

    private final ToDoRepository toDoRepository;
    private final AccountRepository accountRepository;

    public ToDoController(ToDoRepository toDoRepository, AccountRepository accountRepository) {
        this.toDoRepository = toDoRepository;
        this.accountRepository = accountRepository;
    }

    // ✅ Nur eigene Todos abrufen
    @GetMapping
    public ResponseEntity<List<ToDo>> getUserTodos(Authentication authentication) {
        Account account = accountRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new UsernameNotFoundException("Benutzer nicht gefunden"));

        return ResponseEntity.ok(toDoRepository.findByAccount(account));
    }

    @PostMapping
    public ResponseEntity<ToDo> createTodo(@RequestBody ToDo todo, Authentication authentication) {
        Account account = accountRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new UsernameNotFoundException("Benutzer nicht gefunden"));

        todo.setAccount(account); // To-Do mit Benutzer verknüpfen
        ToDo savedTodo = toDoRepository.save(todo); // Speichern und Rückgabe des gespeicherten Objekts

        return ResponseEntity.ok(savedTodo);
    }



    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTodo(@PathVariable("id") Long id, Authentication authentication) {
        // Pickt den richtigen Account
        Account account = accountRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new UsernameNotFoundException("Benutzer nicht gefunden"));

        // Holt das To-Do aus der Datenbank, ansonsten NOT_FOUND Response
        ToDo todo = toDoRepository.findById(id)
                .orElseThrow(() -> {
                    System.out.println("Löschversuch für nicht vorhandenes ToDo mit ID: " + id);
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "ToDo nicht gefunden: " + id);
                });


        // Vergleicht den eingeloggten Account mit Besitzer des TODOS
        if (!todo.getAccount().getId().equals(account.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Nicht erlaubt, fremde Todos zu löschen!");
        }

        toDoRepository.delete(todo);
        return ResponseEntity.ok("ToDo gelöscht!");
    }

}
