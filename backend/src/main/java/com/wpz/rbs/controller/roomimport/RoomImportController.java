package com.wpz.rbs.controller.roomimport;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("roomsImport")
public class RoomImportController {
    @GetMapping()
    public void importAllRooms() {

    }
}
