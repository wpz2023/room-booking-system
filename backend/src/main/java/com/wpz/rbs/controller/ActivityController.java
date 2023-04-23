package com.wpz.rbs.controller;

import com.wpz.rbs.model.Activity;
import com.wpz.rbs.model.ActivityConflict;
import com.wpz.rbs.model.auth.AuthenticationRequest;
import com.wpz.rbs.service.ActivityService;
import jakarta.validation.constraints.NotEmpty;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
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

    @GetMapping("room/{id}/week")
    private List<Activity> getByRoomIdForNextWeek(@PathVariable("id") int roomId, @NotEmpty String startTime) throws ParseException {
        return activityService.getByRoomIdForNextWeek(roomId, startTime);
    }

    @GetMapping("room/{id}/conflicts")
    private ActivityConflict getConflictsByRoomId(@PathVariable("id") int roomId) {
        return activityService.getConflictsRoom(roomId);
    }

    @PostMapping("room/{id}/conflicts")
    private ActivityConflict getConflictsByRoomId(@PathVariable("id") int roomId, @RequestBody List<String> request) {
        return activityService.resolveConflictsRoom(roomId, request);
    }
}
