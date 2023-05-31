package com.wpz.rbs.controller.importers;

import com.wpz.rbs.service.importers.ActivityImportService;
import com.wpz.rbs.utils.StaticHelpers;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.text.ParseException;
import java.util.Date;

@RestController
@RequestMapping("/import/activity")
public class ActivityImportController {
    private final ActivityImportService activityImportService;

    public ActivityImportController(ActivityImportService activityImportService) {
        this.activityImportService = activityImportService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> importRoomActivitiesToday(@PathVariable("id") int roomId) {
        try {
            Date today = new Date();
            return ResponseEntity.ok(activityImportService.importRoomActivitiesYear(roomId, today));
        } catch (IOException | ParseException e) {
            return ResponseEntity.status(503).body(e.getMessage());
        }
    }

    @GetMapping("/{id}/{date}")
    public ResponseEntity<?> importRoomActivitiesDate(@PathVariable("id") int roomId, @PathVariable("date") String dateStr) {
        try {
            Date date = StaticHelpers.parseDate(dateStr);
            return ResponseEntity.ok(activityImportService.importRoomActivitiesYear(roomId, date));
        } catch (ParseException | IOException e) {
            return ResponseEntity.status(503).body(e.getMessage());
        }
    }
}
