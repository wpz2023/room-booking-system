package com.wpz.rbs.controller.importers;

import com.wpz.rbs.model.Room;
import com.wpz.rbs.service.importers.RoomImportService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("import/room")
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
