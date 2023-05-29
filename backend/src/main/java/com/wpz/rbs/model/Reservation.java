package com.wpz.rbs.model;

import com.wpz.rbs.model.reservation.ReservationDTO;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table
@Getter
@Setter
public class Reservation {
    @Id
    @GeneratedValue
    private int id;
    @Column
    private String name;
    @Column
    private String email;
    @Column
    private String first_name;
    @Column
    private String last_name;
    @Column
    private String start_time;
    @Column
    private String end_time;
    @Column
    private String phone_number;
    @Column
    private int room_id;
    @Column
    @Enumerated(EnumType.STRING)
    private ReservationStatus status = ReservationStatus.OPEN;

    public Reservation() {
    }

    public Reservation(ReservationDTO reservation) {
        this.start_time = reservation.getStart_time();
        this.end_time = reservation.getEnd_time();
        this.first_name = reservation.getFirst_name();
        this.last_name = reservation.getLast_name();
        this.room_id = reservation.getRoom_id();
        this.name = reservation.getName();
        this.email = reservation.getEmail();
        this.phone_number = reservation.getPhone_number();
    }
}