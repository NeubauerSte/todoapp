package com.example.todo.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "roles")
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name;

    public
    Long getId ( ) {
        return id;
    }

    public
    String getName ( ) {
        return name;
    }
}