package com.wpz.rbs.service;

import java.util.UUID;

import com.wpz.rbs.model.ApiUser;
import com.wpz.rbs.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    UserRepository userRepository;

    public UUID saveOrUpdate(ApiUser apiUser){
        return userRepository.save(apiUser).getId();
    }

    public void delete(UUID id){
        userRepository.deleteById(id);
    }
}
