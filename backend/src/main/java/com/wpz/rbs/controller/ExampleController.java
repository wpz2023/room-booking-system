package com.wpz.rbs.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.wpz.rbs.model.Example;
import com.wpz.rbs.service.ExampleService;

@RestController
public class ExampleController {
    
    @Autowired
    ExampleService exampleService;

    @GetMapping("/example")
    private List<Example> getAllExample(){
        return exampleService.getAllExample();
    }

    @GetMapping("example/{id}")
    private Example getExample(@PathVariable("id") int id){
        return exampleService.getExampleById(id);
    }

    @DeleteMapping("/example/{id}")  
    private void deleteStudent(@PathVariable("id") int id){  
        exampleService.delete(id);  
    }  

    @PostMapping("/example")  
    private int saveStudent(@RequestBody Example example){  
        exampleService.saveOrUpdate(example);  
        return example.getId();  
    }  
}
