package com.wpz.rbs.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class Room {
    @Id
    private Integer id;
    @Column
    private String number;
    @Column
    private String type;
    @Column
    private Integer capacity;
    @Column
    @Enumerated(EnumType.STRING)
    private RoomAnnotation roomAnnotation = RoomAnnotation.EMPTY;
}
