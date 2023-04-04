package com.wpz.rbs.service;

import com.wpz.rbs.model.Activity;
import com.wpz.rbs.repository.ActivityRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ActivityService {

    private final ActivityRepository activityRepository;

    public ActivityService(ActivityRepository activityRepository) {
        this.activityRepository = activityRepository;
    }

    public List<Activity> getAll() {
        List<Activity> activities = new ArrayList<Activity>();
        activityRepository.findAll().forEach(activities::add);
        return activities;
    }

    public List<Activity> getByRoomId(int roomId) {
        return new ArrayList<>(activityRepository.findAllByRoom_Id(roomId));
    }

    public Activity saveOrUpdate(Activity activity) {
        return activityRepository.save(activity);
    }
}
