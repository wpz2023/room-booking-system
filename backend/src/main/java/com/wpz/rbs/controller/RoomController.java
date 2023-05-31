package com.wpz.rbs.controller;

import com.wpz.rbs.model.Room;
import com.wpz.rbs.service.RoomService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
public class RoomController {

    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @GetMapping("/room")
    private ResponseEntity<List<Room>> getAllFiltered(String number, String type, Integer capacityMin, String annotation, String startTime, String endTime) {
        if ((startTime == null && endTime != null) || (startTime != null && endTime == null)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }

        List<Room> rooms = roomService.getAllFiltered(number, type, capacityMin, annotation, startTime, endTime);
        return ResponseEntity.ok(rooms);
    }

    @GetMapping("/room/{id}")
    private ResponseEntity<Room> get(@PathVariable("id") int id) {
        Room room = roomService.getById(id);
        if (room != null) {
            return ResponseEntity.ok(room);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PatchMapping("/room/update/{id}")
    private ResponseEntity<Room> updateType(@PathVariable("id") int id, @RequestBody Map<String, String> updates) {
        if (!updates.isEmpty() && updates.containsKey("roomAnnotation")) {
            Room room = roomService.updateRoomAnnotation(id, updates.get("roomAnnotation"));
            if (room != null) {
                return ResponseEntity.ok(room);
            }
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }
}
