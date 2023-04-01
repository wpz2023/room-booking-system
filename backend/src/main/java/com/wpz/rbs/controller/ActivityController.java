package com.wpz.rbs.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wpz.rbs.model.Activity;
import com.wpz.rbs.service.ActivityService;

@RestController
@RequestMapping("activity") 
public class ActivityController {
    
    @Autowired
    ActivityService activityService;

    @GetMapping()
    private List<Activity> getAll(){
        return activityService.getAll();
    }

    @GetMapping("room/{id}")
    private List<Activity> getByRoomId(@PathVariable("id") int roomId){
        return activityService.getByRoomId(roomId);
    }
}
