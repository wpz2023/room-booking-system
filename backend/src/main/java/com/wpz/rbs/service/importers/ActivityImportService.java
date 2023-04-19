package com.wpz.rbs.service.importers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.api.client.http.GenericUrl;
import com.wpz.rbs.model.Activity;
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

        //Check if first import, based on first week activities of previous october
        var lastOctober = StaticHelpers.getPreviousOctober(date);
        var firstWeekActivities = activityService.getByRoomIdForNextWeek(roomId, StaticHelpers.dateToString(lastOctober))
                .stream().filter(Activity::getIs_usos).toList();
        if (firstWeekActivities.size() == 0)
            date = lastOctober;

        date = StaticHelpers.dateTimeToDate(date);
        activityService.clearUsosFromTo(roomId, date, StaticHelpers.addDays(date, 365));

        List<Activity> activities = new ArrayList<>();

        for (var i = 0; i < 365; i += 7) {
            var weekActivities = importRoomActivitiesWeek(roomId, date);
            activities.addAll(weekActivities);

            date = StaticHelpers.addDays(date, 7);
        }

        return activities;
    }

    private List<Activity> importRoomActivitiesWeek(int roomId, Date date) throws IOException, ParseException {

        List<ActivityUsos> activitiesUsos = fetchRoomActivities(roomId, date);

        List<Activity> activities = new ArrayList<>();
        for (var au : activitiesUsos) {
            Activity activity = new Activity(au.type, au.start_time, au.end_time, au.url, au.course_name, au.classtype_name, au.group_number, au.room_id, true);

            for (int lecturer_id : au.lecturer_ids) {
                var lecturer = lecturerImportService.getOrImportLecturer(lecturer_id);
                activity.getLecturers().add(lecturer);
            }

            var saved = activityService.saveOrUpdate(activity);
            activities.add(saved);
        }

        return activities;
    }

    private List<ActivityUsos> fetchRoomActivities(int roomId, Date startDate) throws IOException, ParseException {

        String startDateString = StaticHelpers.dateToString(startDate);

        GenericUrl genericUrl = new GenericUrl("https://apps.usos.uj.edu.pl/services/tt/room");

        genericUrl.set("room_id", roomId);
        genericUrl.set("start", startDateString);
        genericUrl.set("fields", "type|start_time|end_time|url|course_name|classtype_name|lecturer_ids|group_number|room_id");

        String jsonResponse = usosAuthService.executeUsosApiRequest(genericUrl).parseAsString();

        return Arrays.asList(mapper.readValue(jsonResponse, ActivityUsos[].class));
    }
}