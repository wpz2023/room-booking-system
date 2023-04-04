package com.wpz.rbs.service;

import com.wpz.rbs.model.Room;
import com.wpz.rbs.repository.RoomRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class RoomService {

    private final RoomRepository roomRepository;

    public RoomService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    public List<Room> getAll() {
        List<Room> rooms = new ArrayList<Room>();
        roomRepository.findAll().forEach(rooms::add);
        return rooms;
    }

    public Room getById(int id) {
        return roomRepository.findById(id).get();
    }

    // When updating, keeps the "annotation" member, unless it's empty ("")
    public void saveOrUpdate(Room room) {
        var optional = roomRepository.findById(room.getId());
        if (optional.isPresent()) {
            var existingAnnotation = optional.get().getAnnotation();

            if (!existingAnnotation.equals("")) {
                room.setAnnotation(existingAnnotation);
            }
        }
        roomRepository.save(room);
    }

}
