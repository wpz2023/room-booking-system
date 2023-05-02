package com.wpz.rbs.controller;

import com.wpz.rbs.model.Reservation;
import com.wpz.rbs.model.reservation.ReservationDTO;
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
    public ResponseEntity<?> createReservation(@RequestBody @Validated ReservationDTO reservation) throws ParseException {
        return reservationService.createReservation(reservation);
    }

    @GetMapping("manage")
    public List<Reservation> getAllReservations() {
        return reservationService.getAll();
    }

    @GetMapping("manage/{id}")
    public Reservation getReservationById(@PathVariable int id) {
        return reservationService.getById(id);
    }

    @GetMapping("manage/room/{roomId}")
    public List<Reservation> getReservationsByRoom(@PathVariable int roomId) {
        return reservationService.getByRoomId(roomId);
    }

    @PutMapping("manage/{id}")
    public ResponseEntity<?> updateAndAcceptReservation(@PathVariable int id, @RequestBody @Validated ReservationDTO editedReservation) throws ParseException {
        return reservationService.updateAndAcceptReservation(id, editedReservation);
    }

    @PostMapping("manage/{id}/accept")
    public ResponseEntity<?> acceptReservation(@PathVariable int id) throws ParseException {
        return reservationService.acceptReservation(id);
    }

    @PostMapping("manage/{id}/decline")
    public ResponseEntity<?> declineReservation(@PathVariable int id) throws ParseException {
        return reservationService.declineReservation(id);
    }
}
