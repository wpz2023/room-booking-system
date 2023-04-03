package com.wpz.rbs.controller;

import com.wpz.rbs.model.Activity;
import com.wpz.rbs.service.ActivityService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("activity")
public class ActivityController {

    private final ActivityService activityService;

    public ActivityController(ActivityService activityService) {
        this.activityService = activityService;
    }

    @GetMapping()
    private List<Activity> getAll() {
        return activityService.getAll();
    }

    @GetMapping("room/{id}")
    private List<Activity> getByRoomId(@PathVariable("id") int roomId) {
        return activityService.getByRoomId(roomId);
    }
}
