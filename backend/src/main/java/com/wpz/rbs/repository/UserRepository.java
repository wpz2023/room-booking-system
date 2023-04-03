package com.wpz.rbs.repository;

import com.wpz.rbs.model.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@PropertySource({"classpath:admin.properties"})
public class UserRepository {
    private final User user;

    public UserRepository(@Value("${email}") String email, @Value("${password}") String password) {
        user = new User(email, "{noop}" + password);
    }

    public Optional<User> findByEmail(String email) {
        if (user.getEmail().equals(email)) {
            return Optional.of(user);
        }
        return Optional.empty();
    }
}
