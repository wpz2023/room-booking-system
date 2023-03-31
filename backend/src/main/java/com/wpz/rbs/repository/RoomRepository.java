package com.wpz.rbs.repository;

import org.springframework.data.repository.CrudRepository;

import com.wpz.rbs.model.Room;

public interface RoomRepository extends CrudRepository<Room, Integer> {
    
}
