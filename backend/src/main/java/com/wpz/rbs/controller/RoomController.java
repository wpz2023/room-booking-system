package com.wpz.rbs.controller;

import com.wpz.rbs.model.Room;
import com.wpz.rbs.service.RoomService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class RoomController {

    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @GetMapping("/room")
    private List<Room> getAll() {
        return roomService.getAll();
    }

    @GetMapping("/room/{id}")
    private Room get(@PathVariable("id") int id) {
        return roomService.getById(id);
    }

    @PutMapping("/room")
    private int save(@RequestBody Room room) {
        roomService.saveOrUpdate(room);
        return room.getId();
    }
}
