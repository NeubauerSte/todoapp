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

    public
    Long getId ( ) {return id;}

    public
    String getTitle ( ) {return title;}
}
