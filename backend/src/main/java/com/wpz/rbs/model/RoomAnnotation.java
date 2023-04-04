package com.wpz.rbs.model;

import com.fasterxml.jackson.annotation.JsonValue;


public enum RoomAnnotation {
    LAB("laboratoryjna"),
    LECTURE("wykładowa"),
    EXERCISE("ćwiczeniowa"),
    COMPUTER("komputerowa"),
    EMPTY("");

    private final String annotation;

    RoomAnnotation(String annotation) {
        this.annotation = annotation;
    }

    @JsonValue
    public String getAnnotation() {
        return annotation;
    }

    public static RoomAnnotation getByAnnotation(String annotation) {
        for (RoomAnnotation roomAnnotation : values()) {
            if (roomAnnotation.getAnnotation().equalsIgnoreCase(annotation)) {
                return roomAnnotation;
            }
        }
        return null;
    }

    public static boolean checkIfCorrectAnnotation(String annotation) {
        for (RoomAnnotation roomAnnotation : values()) {
            if (roomAnnotation.getAnnotation().equalsIgnoreCase(annotation)) {
                return true;
            }
        }
        return false;
    }
}
