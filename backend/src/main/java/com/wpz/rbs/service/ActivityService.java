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

    public void clearUsosFromTo(int roomId, Date startDate, Date endDate) {
        activityRepository.findAllByRoom_Id(roomId).forEach(activity -> {
            if (!activity.getIs_usos()) return;

            Date date = new Date();
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

    public List<ActivityConflict> getConflictsRoom(int roomId) throws ParseException {
        var activities = activityRepository.findAllByRoom_Id(roomId);

        var conflicts = new ArrayList<ActivityConflict>();

        for (var i = 0; i < activities.size(); ++i) {
            var activity1 = activities.get(i);
            for (var j = i + 1; j < activities.size(); ++j) {
                var activity2 = activities.get(j);

                if (activity1.getIs_usos() && activity2.getIs_usos())
                    continue;


                if (StaticHelpers.activitiesOverlapping(
                        StaticHelpers.parseDateTime(activity1.getStart_time()),
                        StaticHelpers.parseDateTime(activity1.getEnd_time()),
                        StaticHelpers.parseDateTime(activity2.getStart_time()),
                        StaticHelpers.parseDateTime(activity2.getEnd_time()))) {
                    conflicts.add(new ActivityConflict(activity1.getId(), activity2.getId()));
                }
            }
        }

        return conflicts;
    }

    public ActivityConflict getConflictsRoom(int roomId) {
        return null;
    }

    public ActivityConflict resolveConflictsRoom(int roomId, List<String> activitiesId) {
        activityRepository.deleteAllById(activitiesId);
        return getConflictsRoom(roomId);
    }
}
