package com.wpz.rbs.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.wpz.rbs.model.Room;
import com.wpz.rbs.service.RoomService;

@RestController
public class RoomController {
    
    @Autowired
    RoomService roomService;

    @GetMapping("/room")
    private List<Room> getAll(){
        return roomService.getAll();
    }

    @GetMapping("/room/{id}")
    private Room get(@PathVariable("id") int id){
        return roomService.getById(id);
    }

    @DeleteMapping("/room/{id}")  
    private void delete(@PathVariable("id") int id){  
        roomService.delete(id);  
    }  

    @PostMapping("/room")  
    private int save(@RequestBody Room room){  
        roomService.saveOrUpdate(room);  
        return room.getId();  
    }  
}
