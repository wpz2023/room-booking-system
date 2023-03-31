package com.wpz.rbs.model.usos;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.wpz.rbs.model.Room;

@JsonIgnoreProperties(ignoreUnknown = true)
public class RoomsUsos {
    @JsonProperty("rooms")
    public List<Room> rooms;
}