package com.example.todo.repository;
import com.example.todo.model.Account;
import com.example.todo.model.ToDo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ToDoRepository extends JpaRepository< ToDo, Long> {
    List <ToDo> findByAccount ( Account account );
}
