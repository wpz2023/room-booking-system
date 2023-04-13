package com.wpz.rbs.service;

import com.wpz.rbs.model.Activity;
import com.wpz.rbs.repository.ActivityRepository;
import com.wpz.rbs.utils.StaticHelpers;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class ActivityService {

    private final ActivityRepository activityRepository;

    public ActivityService(ActivityRepository activityRepository) {
        this.activityRepository = activityRepository;
    }

    public List<Activity> getAll() {
        List<Activity> activities = new ArrayList<>();
        activityRepository.findAll().forEach(activities::add);
        return activities;
    }

    public List<Activity> getByRoomId(int roomId) {
        return new ArrayList<>(activityRepository.findAllByRoom_Id(roomId));
    }

    public List<Activity> getByRoomIdForNextWeek(int roomId, String startDateString) throws ParseException {
        Date startDate = StaticHelpers.parseDate(startDateString);
        Date endDate = StaticHelpers.addDays(startDate, 6);
        return activityRepository.findAllByRoom_Id(roomId).stream().filter(a -> {
            try {
                Date date = StaticHelpers.parseDate(a.getStart_time());
                return !(date.before(startDate) || date.after(endDate));
            } catch (ParseException e) {
                throw new RuntimeException(e);
            }
        }).toList();
    }

    public Activity saveOrUpdate(Activity activity) {
        return activityRepository.save(activity);
    }
}
