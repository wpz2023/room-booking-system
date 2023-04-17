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

    public void clearUsosFromTo(Date startDate, Date endDate){
        activityRepository.findAll().forEach(activity -> {
            if(activity.getIs_usos() == false) return;

            Date date = new Date();
            try{
                date = StaticHelpers.parseDate(activity.getStart_time());
            } catch(ParseException e){
                return;
            }

            if( date.compareTo(startDate) >= 0 && date.compareTo(endDate) < 0 ){
                activityRepository.delete(activity);
            }
        });
    }

    public Activity saveOrUpdate(Activity activity) {
        return activityRepository.save(activity);
    }

    public List<ActivityConflict> getConflictsRoom(int roomId){
        var activities = activityRepository.findAllByRoom_Id(roomId);

        var conflicts = new ArrayList<ActivityConflict>();

        for(var i = 0; i < activities.size(); ++i){
            var activity1 = activities.get(i);
            for(var j = i + 1; j < activities.size(); ++j){
                var activity2 = activities.get(j);

                if(activity1.getIs_usos() && activity2.getIs_usos())
                    continue;

                var s1 = activity1.getStart_time(); var e1 = activity1.getEnd_time(); 
                var s2 = activity1.getStart_time(); var e2 = activity1.getEnd_time(); 

                if( (s2.compareTo(s1) >= 0 && s2.compareTo(e1) <= 0) || (s1.compareTo(s2) >= 0 && s1.compareTo(e2) <= 0) ){
                    conflicts.add(new ActivityConflict(activity1.getId(), activity2.getId()));
                }
            }
        }

        return conflicts;
    }
}
