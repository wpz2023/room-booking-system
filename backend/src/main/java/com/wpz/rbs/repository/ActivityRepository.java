package com.wpz.rbs.repository;

import com.wpz.rbs.model.Activity;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface ActivityRepository extends CrudRepository<Activity, String> {

    @Query(value = "select * from Activity a where a.room_id = :roomId", nativeQuery = true)
    List<Activity> findAllByRoomId(int roomId);

    @Query(value = "select * from Activity a where a.room_id = :roomId and a.is_usos = true", nativeQuery = true)
    List<Activity> findAllUsosActivitiesByRoomId(int roomId);

    @Query(value = "select * from Activity a where a.room_id = :roomId and a.is_usos = false", nativeQuery = true)
    List<Activity> findAllUserActivitiesByRoomId(int roomId);

    @Query(value = "select * from Activity a where a.room_id = :roomId and a.end_time > :start_time and a.start_time < :end_time", nativeQuery = true)
    List<Activity> findAllByRoomIdAndOverlappingStartTimeAndEndTime(int roomId, String start_time, String end_time);
}
