package com.example.todo.repository;

import com.example.todo.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AccountRepository extends JpaRepository< Account, Long> {
    Optional< Account > findByUsername ( String username );
}
