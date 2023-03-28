package com.wpz.rbs.model.usos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class RoomUsos {
    public RoomUsos() {

    }

    public String id;
    public String number;
    public String type;
}
