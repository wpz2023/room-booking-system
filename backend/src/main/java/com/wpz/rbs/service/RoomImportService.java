package com.wpz.rbs.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.api.client.http.GenericUrl;
import com.wpz.rbs.model.Room;
import com.wpz.rbs.model.usos.RoomsUsos;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.Objects;

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
        genericUrl.set("fields", "rooms[id|number|type]");
        String json = usosAuthService.usosApiRequest(genericUrl).parseAsString();
        RoomsUsos roomsUsos = new ObjectMapper().readValue(json, RoomsUsos.class);
        return roomsUsos.rooms.stream().filter(room -> Objects.equals(room.type, "didactics_room")).map(room -> new Room(room.id, room.number)).toList();
    }
}
