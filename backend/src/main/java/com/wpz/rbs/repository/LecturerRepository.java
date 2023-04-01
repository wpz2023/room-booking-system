package com.wpz.rbs.repository;

import org.springframework.data.repository.CrudRepository;

import com.wpz.rbs.model.Lecturer;

public interface LecturerRepository extends CrudRepository<Lecturer, Integer> {
    
}
