package com.wpz.rbs.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wpz.rbs.model.Room;
import com.wpz.rbs.repository.RoomRepository;

@Service
public class RoomService {
    
    @Autowired
    RoomRepository roomRepository;

    public List<Room> getAll(){  
        List<Room> rooms = new ArrayList<Room>();  
        roomRepository.findAll().forEach(room -> rooms.add(room));  
        return rooms;  
    }  
 
    public Room getById(int id){  
        return roomRepository.findById(id).get();  
    }  

    // When updating, keeps the "annotation" member, unless it's empty ("")
    public void saveOrUpdate(Room room){  
        var optional = roomRepository.findById(room.getId());
        if(optional.isPresent()){
            var existingAnnotation = optional.get().getAnnotation();

            if(existingAnnotation.equals("") == false){
                room.setAnnotation(existingAnnotation);
            }
        }
        roomRepository.save(room);  
    }  

}
