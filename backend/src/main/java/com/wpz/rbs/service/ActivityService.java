package com.wpz.rbs.service;

import com.wpz.rbs.model.Activity;
import com.wpz.rbs.model.ActivityConflict;
import com.wpz.rbs.model.Room;
import com.wpz.rbs.repository.ActivityRepository;
import com.wpz.rbs.repository.RoomRepository;
import com.wpz.rbs.utils.StaticHelpers;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final RoomRepository roomRepository;

    public ActivityService(ActivityRepository activityRepository, RoomRepository roomRepository) {
        this.activityRepository = activityRepository;
        this.roomRepository = roomRepository;
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

    public ActivityConflict resolveConflictsAllRoom(List<String> activitiesId) throws ParseException {
        activityRepository.deleteAllById(activitiesId);
        Iterable<Room> rooms = roomRepository.findAll();
        for (Room room : rooms) {
            ActivityConflict conflict = getConflictsRoom(room.getId());
            if (conflict != null) return conflict;
        }
        return null;
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

        List<Activity> usosConflicts = new ArrayList<>();

        for (Activity userActivity : userActivities) {
            for (Activity usosActivity : usosActivities) {
                if (StaticHelpers.activitiesOverlapping(userActivity, usosActivity)) {
                    usosConflicts.add(usosActivity);
                }
            }
            if (!usosConflicts.isEmpty()) {
                return new ActivityConflict(usosConflicts, userActivity);
            }
        }

        return null;
    }

    public ActivityConflict resolveConflictsRoom(int roomId, List<String> activitiesId) throws ParseException {
        activityRepository.deleteAllById(activitiesId);
        return getConflictsRoom(roomId);
    }
}
