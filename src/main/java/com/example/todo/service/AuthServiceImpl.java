package com.example.todo.service;

import com.example.todo.service.AuthService;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    @Override
    public boolean authenticate(String username, String password) {
        return "admin".equals(username) && "admin".equals(password);
    }
}
