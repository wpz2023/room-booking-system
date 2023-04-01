package com.wpz.rbs.repository;

import org.springframework.data.repository.CrudRepository;

import com.wpz.rbs.model.Activity;

public interface ActivityRepository extends CrudRepository<Activity, Integer> {
    
}
