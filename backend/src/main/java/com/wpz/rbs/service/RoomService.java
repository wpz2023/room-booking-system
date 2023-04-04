package com.wpz.rbs.service;

import com.wpz.rbs.model.Room;
import com.wpz.rbs.model.RoomAnnotation;
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
        List<Room> rooms = new ArrayList<>();
        roomRepository.findAll().forEach(rooms::add);
        return rooms;
    }

    public Room getById(int id) {
        return roomRepository.findById(id).get();
    }

    public void saveOrUpdate(Room room) {
        var optional = roomRepository.findById(room.getId());
        if (optional.isPresent()) {
            var existingRoomType = optional.get().getRoomAnnotation();
            room.setRoomAnnotation(existingRoomType);
        }
        roomRepository.save(room);
    }

    public Room updateRoomAnnotation(int roomId, String roomAnnotation) {
        var optional = roomRepository.findById(roomId);
        if (optional.isPresent() && RoomAnnotation.checkIfCorrectAnnotation(roomAnnotation)) {
            Room room = optional.get();
            room.setRoomAnnotation(RoomAnnotation.getByAnnotation(roomAnnotation));
            roomRepository.save(room);
            return room;
        }
        return null;
    }
}
