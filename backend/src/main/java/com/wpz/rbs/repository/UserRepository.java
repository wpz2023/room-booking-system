package com.wpz.rbs.repository;

import com.wpz.rbs.model.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;

import java.util.Optional;

@PropertySource({"classpath:admin.properties"})
public class UserRepository {

    @Value("${email}")
    private String email;
    @Value("${password}")
    private String password;
    private final User user = new User(email, password);

    Optional<User> findByEmail(String email) {
        if (user.getEmail().equals(email)) {
            return Optional.of(user);
        }
        return Optional.empty();
    }
}
