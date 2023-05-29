package com.wpz.rbs.controller.importers;

import com.wpz.rbs.service.importers.RoomImportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping("import/room")
public class RoomImportController {
    private final RoomImportService roomImportService;

    public RoomImportController(RoomImportService roomImportService) {
        this.roomImportService = roomImportService;
    }

    @GetMapping()
    public ResponseEntity<?> importAllRooms() {
        try {
            return ResponseEntity.ok(roomImportService.getAll());
        } catch (IOException e) {
            return ResponseEntity.status(503).body(e.getMessage());
        }
    }
}
