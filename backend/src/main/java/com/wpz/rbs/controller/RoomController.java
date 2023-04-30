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
    private List<Room> getAllFiltered(String number, String type, Integer capacity, String annotation) {
        return roomService.getAllFiltered(number, type, capacity, annotation);
    }

    @GetMapping("/room/{id}")
    private Room get(@PathVariable("id") int id) {
        return roomService.getById(id);
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
