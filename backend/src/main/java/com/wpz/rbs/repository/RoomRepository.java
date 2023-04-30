package com.wpz.rbs.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.QueryByExampleExecutor;

import com.wpz.rbs.model.Room;

public interface RoomRepository extends CrudRepository<Room, Integer>, QueryByExampleExecutor<Room> {
    
}
