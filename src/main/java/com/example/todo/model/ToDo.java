package com.example.todo.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ToDo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private Account account;

    public
    Long getId ( ) {
        return id;
    }

    public
    String getTitle ( ) {
        return title;
    }

    public
    Account getAccount ( ) {
        return account;
    }
}
