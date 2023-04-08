package com.wpz.rbs.controller;

import com.wpz.rbs.model.Reservation;
import com.wpz.rbs.model.reservation.CreateReservation;
import com.wpz.rbs.service.ReservationService;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("reservation")
public class ReservationController {
    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @PostMapping()
    public int createReservation(@RequestBody @Validated CreateReservation reservation) throws Exception {
        return this.reservationService.createReservation(reservation);
    }

    @GetMapping("{id}")
    public Reservation getReservationById(@PathVariable int id) {
        return reservationService.getById(id);
    }
}
