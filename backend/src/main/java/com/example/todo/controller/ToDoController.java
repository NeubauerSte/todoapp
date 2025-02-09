package com.example.todo.controller;

import com.example.todo.model.ToDo;
import com.example.todo.repository.ToDoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/todos")
@CrossOrigin(origins = "http://localhost:5173") // Erlaubt Zugriff von React
public class ToDoController {
    @Autowired
    private ToDoRepository repository;

    @PostMapping
    public ToDo create(@RequestBody ToDo todo) {
        return repository.save(todo);
    }

    @GetMapping
    public List< ToDo > getAll ( ) {
        return repository.findAll();
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable("id") Long id) {
        repository.deleteById(id);
    }
}
