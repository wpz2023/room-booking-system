package com.wpz.rbs.service.importers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.api.client.http.GenericUrl;
import com.wpz.rbs.model.Activity;
import com.wpz.rbs.model.Lecturer;
import com.wpz.rbs.model.usos.ActivityUsos;
import com.wpz.rbs.service.ActivityService;
import com.wpz.rbs.service.UsosAuthService;
import com.wpz.rbs.utils.StaticHelpers;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

@Service
public class ActivityImportService {
    private final UsosAuthService usosAuthService;
    private final ActivityService activityService;
    private final LecturerImportService lecturerImportService;
    private final ObjectMapper mapper = new ObjectMapper();

    public ActivityImportService(UsosAuthService usosAuthService, ActivityService activityService, LecturerImportService lecturerImportService) {
        this.usosAuthService = usosAuthService;
        this.activityService = activityService;
        this.lecturerImportService = lecturerImportService;
    }

    @Transactional(rollbackOn = {Exception.class})
    public List<Activity> importRoomActivitiesYear(int roomId, Date date) throws IOException, ParseException {
        Date lastOctober = StaticHelpers.getPreviousOctober(date);
        if (checkIfFirstImport(roomId, lastOctober)) {
            date = lastOctober;
        }

        date = StaticHelpers.dateTimeToDate(date);
        activityService.clearUsosFromTo(roomId, date, StaticHelpers.addDays(date, 365));

        List<Activity> activities = new ArrayList<>();

        for (int i = 0; i < 365; i += 7) {
            List<Activity> weekActivities = importRoomActivitiesWeek(roomId, date);
            activities.addAll(weekActivities);
            date = StaticHelpers.addDays(date, 7);
        }

        return activities;
    }

    private boolean checkIfFirstImport(int roomId, Date date) throws ParseException {
        List<Activity> firstWeekActivities = activityService
                .getByRoomIdForNextWeek(roomId, StaticHelpers.dateToString(date))
                .stream()
                .filter(Activity::getIs_usos)
                .toList();

        return firstWeekActivities.size() == 0;
    }

    private List<Activity> importRoomActivitiesWeek(int roomId, Date date) throws IOException {
        List<ActivityUsos> activitiesUsos = fetchRoomActivities(roomId, date);
        List<Activity> activities = new ArrayList<>();
        
        for (ActivityUsos activityUsos : activitiesUsos) {
            Activity activity = new Activity(activityUsos.type, activityUsos.start_time, activityUsos.end_time, activityUsos.url, activityUsos.course_name, activityUsos.classtype_name, activityUsos.group_number, activityUsos.room_id, true);

            for (String lecturer_id : activityUsos.lecturer_ids) {
                Lecturer lecturer = lecturerImportService.getOrImportLecturer(lecturer_id);
                activity.getLecturers().add(lecturer);
            }

            Activity saved = activityService.saveOrUpdate(activity);
            activities.add(saved);
        }

        return activities;
    }

    private List<ActivityUsos> fetchRoomActivities(int roomId, Date startDate) throws IOException {
        String startDateString = StaticHelpers.dateToString(startDate);
        
        GenericUrl genericUrl = new GenericUrl("https://apps.usos.uj.edu.pl/services/tt/room");
        genericUrl.set("room_id", roomId);
        genericUrl.set("start", startDateString);
        genericUrl.set("fields", "type|start_time|end_time|url|course_name|classtype_name|lecturer_ids|group_number|room_id");

        String jsonResponse = usosAuthService.executeUsosApiRequest(genericUrl).parseAsString();
        return Arrays.asList(mapper.readValue(jsonResponse, ActivityUsos[].class));
    }
}