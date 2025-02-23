package com.example.todo.repository;

import com.example.todo.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Long> {
    Optional<Account> findByUsername(String username);

    /** ❌ Rolle direkt aus der DB entfernen */
    @Modifying
    @Transactional
    @Query(value = "DELETE FROM account_roles WHERE account_id = :accountId AND role_id = :roleId", nativeQuery = true)
    void removeRoleFromUser(Long accountId, Long roleId);
}