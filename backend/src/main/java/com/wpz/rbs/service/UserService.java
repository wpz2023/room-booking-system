package com.wpz.rbs.service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.wpz.rbs.model.ApiUser;
import com.wpz.rbs.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    UserRepository userRepository;

    public List<ApiUser> getAllExample(){
        List<ApiUser> apiUsers = new ArrayList<ApiUser>();
        userRepository.findAll().forEach(apiUser -> apiUsers.add(apiUser));
        return apiUsers;
    }

    public ApiUser getExampleById(UUID id){
        return userRepository.findById(id).get();
    }

    public UUID saveOrUpdate(ApiUser apiUser){
        return userRepository.save(apiUser).getId();
    }

    public void delete(UUID id){
        userRepository.deleteById(id);
    }
}
