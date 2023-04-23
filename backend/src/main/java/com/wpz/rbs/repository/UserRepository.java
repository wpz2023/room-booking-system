package com.wpz.rbs.repository;

import com.wpz.rbs.model.User;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class UserRepository {
    private final User user;

    public UserRepository() {
        user = new User();
    }

    public Optional<User> findByEmail(String email) {
        if (user.getUsername().equals(email)) {
            return Optional.of(user);
        }
        return Optional.empty();
    }
}
