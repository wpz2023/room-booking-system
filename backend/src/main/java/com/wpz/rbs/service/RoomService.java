package com.wpz.rbs.service;

import com.wpz.rbs.model.Room;
import com.wpz.rbs.model.RoomAnnotation;
import com.wpz.rbs.repository.ActivityRepository;
import com.wpz.rbs.repository.RoomRepository;
import org.springframework.data.domain.Example;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
public class RoomService {

    private final RoomRepository roomRepository;
    private final ActivityRepository activityRepository;

    public RoomService(RoomRepository roomRepository, ActivityRepository activityRepository) {
        this.roomRepository = roomRepository;
        this.activityRepository = activityRepository;
    }

    public List<Room> getAllFiltered(String number, String type, Integer capacityMin, String annotation, String startTime, String endTime) {
        Room exampleRoom = new Room();
        exampleRoom.setNumber(number);
        exampleRoom.setType(type);
        exampleRoom.setRoomAnnotation(RoomAnnotation.getByAnnotation(annotation));

        List<Room> rooms = new ArrayList<>();
        roomRepository.findAll(Example.of(exampleRoom)).forEach((room) -> {
            if (capacityMin != null) {
                if (room.getCapacity() < capacityMin) return;
            }

            if (startTime != null && endTime != null) {
                var activities = activityRepository.findAllByRoomIdAndOverlappingStartTimeAndEndTime(room.getId(), startTime, endTime);
                if (activities.size() != 0) return;
            }

            rooms.add(room);
        });
        return rooms.stream()
                .sorted(Comparator.comparing(Room::getNumber))
                .toList();
    }

    public Room getById(int id) {
        return roomRepository.findById(id).orElse(null);
    }

    public void saveOrUpdate(Room room) {
        Optional<Room> roomOptional = roomRepository.findById(room.getId());
        if (roomOptional.isPresent()) {
            RoomAnnotation existingRoomType = roomOptional.get().getRoomAnnotation();
            room.setRoomAnnotation(existingRoomType);
        }
        roomRepository.save(room);
    }

    public Room updateRoomAnnotation(int roomId, String roomAnnotation) {
        Optional<Room> roomOptional = roomRepository.findById(roomId);
        if (roomOptional.isPresent() && RoomAnnotation.checkIfCorrectAnnotation(roomAnnotation)) {
            Room room = roomOptional.get();
            room.setRoomAnnotation(RoomAnnotation.getByAnnotation(roomAnnotation));
            roomRepository.save(room);
            return room;
        }
        return null;
    }
}
