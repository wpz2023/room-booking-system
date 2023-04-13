package com.wpz.rbs.repository;

import com.wpz.rbs.model.Activity;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface ActivityRepository extends CrudRepository<Activity, String> {

    @Query(value = "select * from Activity a where a.room_id = :roomId", nativeQuery = true)
    List<Activity> findAllByRoom_Id(int roomId);
}
