package com.wpz.rbs.controller;

import com.wpz.rbs.model.Reservation;
import com.wpz.rbs.model.reservation.ReservationDTO;
import com.wpz.rbs.service.ReservationService;
import org.springframework.http.HttpStatus;
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
    public ResponseEntity<?> createReservation(@RequestBody @Validated ReservationDTO reservation) {
        try {
            return reservationService.createReservation(reservation);
        } catch (ParseException e) {
            return ResponseEntity.status(503).body(e.getMessage());
        }
    }

    @GetMapping("manage")
    public List<Reservation> getAllReservations() {
        return reservationService.getAll();
    }

    @GetMapping("manage/{id}")
    public ResponseEntity<Reservation> getReservationById(@PathVariable int id) {
        Reservation reservation = reservationService.getById(id);
        if (reservation != null) {
            return ResponseEntity.ok(reservation);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @GetMapping("manage/room/{roomId}")
    public List<Reservation> getReservationsByRoom(@PathVariable int roomId) {
        return reservationService.getByRoomId(roomId);
    }

    @PutMapping("manage/{id}")
    public ResponseEntity<?> updateAndAcceptReservation(@PathVariable int id, @RequestBody @Validated ReservationDTO editedReservation) {
        try {
            return reservationService.updateAndAcceptReservation(id, editedReservation);
        } catch (ParseException e) {
            return ResponseEntity.status(503).body(e.getMessage());
        }
    }

    @PostMapping("manage/{id}/accept")
    public ResponseEntity<?> acceptReservation(@PathVariable int id) {
        try {
            return reservationService.acceptReservation(id);
        } catch (ParseException e) {
            return ResponseEntity.status(503).body(e.getMessage());
        }
    }

    @PostMapping("manage/{id}/decline")
    public ResponseEntity<?> declineReservation(@PathVariable int id) {
        try {
            return reservationService.declineReservation(id);
        } catch (ParseException e) {
            return ResponseEntity.status(503).body(e.getMessage());
        }
    }
}
