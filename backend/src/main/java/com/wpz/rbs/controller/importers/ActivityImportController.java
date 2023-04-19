package com.wpz.rbs.controller.importers;

import com.wpz.rbs.model.Activity;
import com.wpz.rbs.service.importers.ActivityImportService;
import com.wpz.rbs.utils.StaticHelpers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.text.ParseException;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/import/activity")
public class ActivityImportController {
    private final ActivityImportService activityImportService;

    public ActivityImportController(ActivityImportService activityImportService) {
        this.activityImportService = activityImportService;
    }

    @GetMapping("/{id}")
    public List<Activity> importRoomActivitiesToday(@PathVariable("id") int roomId) throws IOException, ParseException {
        var today = new Date();
        return activityImportService.importRoomActivitiesYear(roomId, today);
    }

    @GetMapping("/{id}/{date}")
    public List<Activity> importRoomActivitiesDate(@PathVariable("id") int roomId, @PathVariable("date") String dateStr) throws IOException, ParseException {
        var date = StaticHelpers.parseDate(dateStr);
        return activityImportService.importRoomActivitiesYear(roomId, date);
    }
}
