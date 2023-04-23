package com.wpz.rbs.service;

import com.wpz.rbs.model.Activity;
import com.wpz.rbs.model.ActivityConflict;
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
        return new ArrayList<>(activityRepository.findAllByRoomId(roomId));
    }

    public List<Activity> getByRoomIdForNextWeek(int roomId, String startDateString) throws ParseException {
        Date startDate = StaticHelpers.parseDate(startDateString);
        Date endDate = StaticHelpers.addDays(startDate, 6);
        return activityRepository.findAllByRoomId(roomId).stream().filter(a -> {
            try {
                Date date = StaticHelpers.parseDate(a.getStart_time());
                return !(date.before(startDate) || date.after(endDate));
            } catch (ParseException e) {
                throw new RuntimeException(e);
            }
        }).toList();
    }

    public void clearUsosFromTo(int roomId, Date startDate, Date endDate) {
        activityRepository.findAllByRoomId(roomId).forEach(activity -> {
            if (!activity.getIs_usos()) return;

            Date date;
            try {
                date = StaticHelpers.parseDate(activity.getStart_time());
            } catch (ParseException e) {
                return;
            }

            if (date.compareTo(startDate) >= 0 && date.compareTo(endDate) < 0) {
                activityRepository.delete(activity);
            }
        });
    }

    public Activity saveOrUpdate(Activity activity) {
        return activityRepository.save(activity);
    }

    public ActivityConflict getConflictsRoom(int roomId) throws ParseException {
        List<Activity> userActivities = activityRepository.findAllUserActivitiesByRoomId(roomId);

        if (userActivities.isEmpty()) {
            return null;
        }

        List<Activity> usosActivities = activityRepository.findAllUsosActivitiesByRoomId(roomId);

        if (usosActivities.isEmpty()) {
            return null;
        }

        List<String> usosConflictsIds = new ArrayList<>();

        for (Activity userActivity : userActivities) {
            for (Activity usosActivity : usosActivities) {
                Date userActivityStartTime = StaticHelpers.parseDateTime(userActivity.getStart_time());
                Date userActivityEndTime = StaticHelpers.parseDateTime(userActivity.getEnd_time());
                Date usosActivityStartTime = StaticHelpers.parseDateTime(usosActivity.getStart_time());
                Date usosActivityEndTime = StaticHelpers.parseDateTime(usosActivity.getEnd_time());

                if (StaticHelpers.activitiesOverlapping(userActivityStartTime, userActivityEndTime, usosActivityStartTime, usosActivityEndTime)) {
                    usosConflictsIds.add(usosActivity.getId());
                }
            }
            if (!usosConflictsIds.isEmpty()) {
                return new ActivityConflict(usosConflictsIds, userActivity.getId());
            }
        }

        return null;
    }

    public ActivityConflict resolveConflictsRoom(int roomId, List<String> activitiesId) throws ParseException {
        activityRepository.deleteAllById(activitiesId);
        return getConflictsRoom(roomId);
    }
}
