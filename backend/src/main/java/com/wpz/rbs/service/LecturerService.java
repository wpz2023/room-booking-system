package com.wpz.rbs.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wpz.rbs.model.Lecturer;
import com.wpz.rbs.repository.LecturerRepository;

@Service
public class LecturerService {
    
    @Autowired
    LecturerRepository lecturerRepository;

    public List<Lecturer> getAll(){  
        List<Lecturer> lecturers = new ArrayList<Lecturer>();  
        lecturerRepository.findAll().forEach(lecturer -> lecturers.add(lecturer));  
        return lecturers;  
    }  
 
    public Lecturer getById(int id){  
        return lecturerRepository.findById(id).get();  
    }  
    public Optional<Lecturer> getByIdOptional(int id){  
        return lecturerRepository.findById(id); 
    }  

    public Lecturer saveOrUpdate(Lecturer lecturer){  
        return lecturerRepository.save(lecturer);
    }  
}
