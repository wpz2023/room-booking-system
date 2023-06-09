package com.wpz.rbs.service.importers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.api.client.http.GenericUrl;
import com.wpz.rbs.model.Room;
import com.wpz.rbs.model.usos.RoomsUsos;
import com.wpz.rbs.service.RoomService;
import com.wpz.rbs.service.UsosAuthService;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;

@Service
public class RoomImportService {
    private final UsosAuthService usosAuthService;
    private final RoomService roomService;
    private final ObjectMapper mapper = new ObjectMapper();

    public RoomImportService(UsosAuthService usosAuthService, RoomService roomService) {
        this.usosAuthService = usosAuthService;
        this.roomService = roomService;
    }

    public List<Room> getAll() throws IOException {
        GenericUrl genericUrl = new GenericUrl("https://apps.usos.uj.edu.pl/services/geo/building2");
        genericUrl.set("building_id", "Loj11");
        genericUrl.set("langpref", "pl");
        genericUrl.set("fields", "rooms[id|number|type|capacity]");

        String jsonResponse = usosAuthService.executeUsosApiRequest(genericUrl).parseAsString();
        RoomsUsos roomsUsos = mapper.readValue(jsonResponse, RoomsUsos.class);

        List<Room> filteredRooms = roomsUsos.rooms
                .stream()
                .filter(room -> Objects.equals(room.getType(), "didactics_room"))
                .toList();

        for (Room room : filteredRooms) {
            roomService.saveOrUpdate(room);
        }

        return filteredRooms.stream()
                .sorted(Comparator.comparing(Room::getNumber))
                .toList();
    }
}