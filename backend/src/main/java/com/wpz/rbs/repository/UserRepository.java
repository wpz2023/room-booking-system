package com.wpz.rbs.repository;

import com.wpz.rbs.model.ApiUser;
import org.springframework.data.repository.CrudRepository;

import java.util.UUID;

public interface UserRepository extends CrudRepository<ApiUser, UUID> {
    
}
