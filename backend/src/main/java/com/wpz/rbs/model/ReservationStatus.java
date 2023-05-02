package com.wpz.rbs.model;

import com.fasterxml.jackson.annotation.JsonValue;


public enum ReservationStatus {
    OPEN("open"),
    ACCEPTED("accepted"),
    DECLINED("declined");

    private final String status;

    ReservationStatus(String status) {
        this.status = status;
    }

    @JsonValue
    public String getStatus() {
        return status;
    }

    public static ReservationStatus getByStatus(String status) {
        for (ReservationStatus reservationStatus: values()) {
            if (reservationStatus.getStatus().equalsIgnoreCase(status)) {
                return reservationStatus;
            }
        }
        return null;
    }

    public static boolean checkIfCorrectStatus(String status) {
        for (ReservationStatus reservationStatus : values()) {
            if (reservationStatus.getStatus().equalsIgnoreCase(status)) {
                return true;
            }
        }
        return false;
    }
}
