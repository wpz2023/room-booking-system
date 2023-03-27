package com.wpz.rbs.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.api.client.http.GenericUrl;
import com.wpz.rbs.model.Room;
import com.wpz.rbs.model.usos.RoomsUsos;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
public class RoomImportService {
    private final UsosAuthService usosAuthService;

    public RoomImportService(UsosAuthService usosAuthService) {
        this.usosAuthService = usosAuthService;
    }

    public List<Room> getAll() throws IOException {
        GenericUrl genericUrl = new GenericUrl("https://apps.usos.uj.edu.pl/services/geo/building2");
        genericUrl.set("building_id", "Loj11");
        genericUrl.set("langpref", "pl");
        genericUrl.set("fields", "rooms");
        RoomsUsos roomsUsos = new ObjectMapper().readValue(usosAuthService.usosApiRequest(genericUrl).parseAsString(), RoomsUsos.class);
        return roomsUsos.rooms.stream().map(room -> new Room(room.id, room.number)).toList();
    }
}
