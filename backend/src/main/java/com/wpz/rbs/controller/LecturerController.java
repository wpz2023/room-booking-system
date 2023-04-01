package com.wpz.rbs.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wpz.rbs.model.Lecturer;
import com.wpz.rbs.service.LecturerService;

@RestController
@RequestMapping("lecturer") 
public class LecturerController {
    
    @Autowired
    LecturerService lecturerService;

    @GetMapping()
    private List<Lecturer> getAll(){
        return lecturerService.getAll();
    }

    @GetMapping("{id}")
    private Lecturer get(@PathVariable("id") int id){
        return lecturerService.getById(id);
    }
}
