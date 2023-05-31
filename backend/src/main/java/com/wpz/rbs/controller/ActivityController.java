package com.wpz.rbs.controller;

import com.wpz.rbs.model.Activity;
import com.wpz.rbs.service.ActivityService;
import jakarta.validation.constraints.NotEmpty;
import org.springframework.http.ResponseEntity;
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
    private ResponseEntity<?> getByRoomIdForNextWeek(@PathVariable("id") int roomId, @NotEmpty String startTime) {
        try {
            return ResponseEntity.ok(activityService.getByRoomIdForNextWeek(roomId, startTime));
        } catch (ParseException e) {
            return ResponseEntity.status(503).body(e.getMessage());
        }
    }

    @PostMapping("conflicts")
    private ResponseEntity<?> getConflictsFromAllRooms(@RequestBody List<String> request) {
        try {
            return ResponseEntity.ok(activityService.resolveConflictsAllRoom(request));
        } catch (ParseException e) {
            return ResponseEntity.status(503).body(e.getMessage());
        }
    }

    @GetMapping("room/{id}/conflicts")
    private ResponseEntity<?> getConflictsByRoomId(@PathVariable("id") int roomId) {
        try {
            return ResponseEntity.ok(activityService.getConflictsRoom(roomId));
        } catch (ParseException e) {
            return ResponseEntity.status(503).body(e.getMessage());
        }
    }

    @PostMapping("room/{id}/conflicts")
    private ResponseEntity<?> getConflictsByRoomId(@PathVariable("id") int roomId, @RequestBody List<String> request) {
        try {
            return ResponseEntity.ok(activityService.resolveConflictsRoom(roomId, request));
        } catch (ParseException e) {
            return ResponseEntity.status(503).body(e.getMessage());
        }
    }
}