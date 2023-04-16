package com.wpz.rbs.controller;

import com.wpz.rbs.model.Reservation;
import com.wpz.rbs.model.reservation.CreateReservation;
import com.wpz.rbs.service.ReservationService;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.util.List;


@RestController
@RequestMapping("reservation")
public class ReservationController {
    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @PostMapping()
    public ResponseEntity<?> createReservation(@RequestBody @Validated CreateReservation reservation) throws ParseException {
        return reservationService.createReservation(reservation);
    }

    @GetMapping("{id}")
    public Reservation getReservationById(@PathVariable int id) {
        return reservationService.getById(id);
    }

    @GetMapping("room/{roomId}")
    public List<Reservation> getReservationsByRoom(@PathVariable int roomId) {
        return reservationService.getByRoomId(roomId);
    }

    @GetMapping()
    public List<Reservation> getAllReservations() {
        return reservationService.getAll();
    }

}
