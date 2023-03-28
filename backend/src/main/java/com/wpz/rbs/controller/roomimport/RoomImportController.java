package com.wpz.rbs.controller.roomimport;

import com.wpz.rbs.model.Room;
import com.wpz.rbs.service.RoomImportService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("roomsImport")
public class RoomImportController {
    private final RoomImportService roomImportService;

    public RoomImportController(RoomImportService roomImportService) {
        this.roomImportService = roomImportService;
    }

    @GetMapping()
    public List<Room> importAllRooms() throws IOException {
        return roomImportService.getAll();
    }
}
