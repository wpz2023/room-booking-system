package com.wpz.rbs.controller.importers;

import com.wpz.rbs.model.Activity;
import com.wpz.rbs.service.importers.ActivityImportService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/import/activity")
public class ActivityImportController {
    private final ActivityImportService activityImportService;

    public ActivityImportController(ActivityImportService activityImportService) {
        this.activityImportService = activityImportService;
    }

    @GetMapping("/{id}")
    public List<Activity> importRoomActivities(@PathVariable("id") int roomId) throws IOException {
        return activityImportService.getRoomActivities(roomId);
    }
}
