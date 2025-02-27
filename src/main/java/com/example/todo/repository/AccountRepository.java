package com.example.todo.repository;

import com.example.todo.model.Account;
import com.example.todo.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Long> {
    Optional<Account> findByUsername(String username);

    /** ❌ Rolle direkt aus der DB entfernen */
    @Modifying
    @Transactional
    default void removeRoleFromUser(Account account, Role role) {
        account.getRoles().remove(role);
    }
}