package com.example.todo.controller;

import com.example.todo.model.ToDo;
import com.example.todo.repository.ToDoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.List;

@RestController
@RequestMapping("/todos")
public class ToDoController {

    private static final Logger logger = LoggerFactory.getLogger(ToDoController.class);

    private ToDoRepository repository;

    public
    ToDoController ( ToDoRepository repository ) {
        this.repository = repository;
    }

    @PostMapping
    public ToDo create(@RequestBody ToDo todo) {
        logger.info ( "Neues Todo wird erstellt: {}" , todo.getTitle ( ) );
        return repository.save(todo);
    }

    @GetMapping
    public List< ToDo > getAll ( ) {
        logger.info("Alle Todos werden abgerufen");
        return repository.findAll();
    }

    @DeleteMapping("/{id}")
    public
    ResponseEntity <?> delete ( @PathVariable("id") Long id ) {
        if (!repository.existsById(id)) {
            return ResponseEntity.status ( HttpStatus.NOT_FOUND ).body ( "Todo nicht gefunden!" );
        }
        logger.warn ( "Todo mit ID {} wird gelöscht!" , id );
        repository.deleteById(id);
        return ResponseEntity.ok("Todo gelöscht!");
    }

}
