package com.example.todo.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "to_do")
public class ToDo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @ManyToOne
    @JoinColumn(name = "account_id", nullable = false)  // Fix: Klarstellen, dass das die Verbindung zur `Account`-Tabelle ist
    private Account account;

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public Account getAccount() {
        return account;
    }
}