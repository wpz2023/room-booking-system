package com.wpz.rbs.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Room {
    public Room() {

    }

    public Room(String id, String number) {
        this.id = id;
        this.number = number;
    }

    public String id;
    public String number;
}
