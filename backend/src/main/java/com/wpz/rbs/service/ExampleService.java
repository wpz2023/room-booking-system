package com.wpz.rbs.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wpz.rbs.model.Example;
import com.wpz.rbs.repository.ExampleRepository;

@Service
public class ExampleService {
    
    @Autowired
    ExampleRepository exampleRepository;

    public List<Example> getAllExample(){  
        List<Example> examples = new ArrayList<Example>();  
        exampleRepository.findAll().forEach(example -> examples.add(example));  
        return examples;  
    }  
 
    public Example getExampleById(int id){  
        return exampleRepository.findById(id).get();  
    }  

    public void saveOrUpdate(Example example){  
        exampleRepository.save(example);  
    }  

    public void delete(int id){  
        exampleRepository.deleteById(id);  
    }  
}
