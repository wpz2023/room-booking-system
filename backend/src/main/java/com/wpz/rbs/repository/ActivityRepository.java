package com.wpz.rbs.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import com.wpz.rbs.model.Activity;

public interface ActivityRepository extends CrudRepository<Activity, Integer> {

    @Query(value="select * from Activity a where a.room_id = :roomId",nativeQuery=true)
    List<Activity> findAllByRoom_Id(int roomId);
}
