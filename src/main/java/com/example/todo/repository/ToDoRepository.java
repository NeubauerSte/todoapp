package com.example.todo.repository;
import com.example.todo.model.ToDo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ToDoRepository extends JpaRepository< ToDo, Long> { }
