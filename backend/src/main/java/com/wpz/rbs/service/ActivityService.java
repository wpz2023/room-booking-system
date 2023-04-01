package com.wpz.rbs.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wpz.rbs.model.Activity;
import com.wpz.rbs.repository.ActivityRepository;

@Service
public class ActivityService {
    
    @Autowired
    ActivityRepository activityRepository;

    public List<Activity> getAll(){  
        List<Activity> activities = new ArrayList<Activity>();  
        activityRepository.findAll().forEach(activity -> activities.add(activity));  
        return activities;  
    }  
 
    public Activity getById(int id){  
        return activityRepository.findById(id).get();  
    }  

    public Activity saveOrUpdate(Activity activity){  
        return activityRepository.save(activity);
    }  
}