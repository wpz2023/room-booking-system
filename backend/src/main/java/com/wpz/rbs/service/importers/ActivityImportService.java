package com.wpz.rbs.service.importers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.api.client.http.GenericUrl;
import org.springframework.stereotype.Service;
import com.wpz.rbs.model.Activity;
import com.wpz.rbs.model.usos.ActivityUsos;

import com.wpz.rbs.service.ActivityService;
import com.wpz.rbs.service.UsosAuthService;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
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

    public List<Activity> getRoomActivities(int roomId) throws IOException {
        GenericUrl genericUrl = new GenericUrl("https://apps.usos.uj.edu.pl/services/tt/room");
        genericUrl.set("room_id", roomId);
        genericUrl.set("fields", "type|start_time|end_time|url|course_name|classtype_name|lecturer_ids|group_number|room_id");

        String jsonResponse = usosAuthService.executeUsosApiRequest(genericUrl).parseAsString();

        var activitiesUsos = Arrays.asList(mapper.readValue(jsonResponse, ActivityUsos[].class));
        
        List<Activity> activities = new ArrayList<>();
        for(var au: activitiesUsos){

            Activity activity = new Activity(au.type, au.start_time, au.end_time, au.url, au.course_name, au.classtype_name, au.group_number, au.room_id);
            
            for(int lecturer_id: au.lecturer_ids){
                var lecturer = lecturerImportService.getOrImportLecturer(lecturer_id);

                activity.getLecturers().add(lecturer);
            }

            var saved = activityService.saveOrUpdate(activity);
            activities.add(saved);
        }

        return activities;
    }
}