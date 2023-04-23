package com.wpz.rbs.service;

import com.wpz.rbs.model.Reservation;
import com.wpz.rbs.model.reservation.CreateReservation;
import com.wpz.rbs.repository.ActivityRepository;
import com.wpz.rbs.repository.ReservationRepository;
import com.wpz.rbs.repository.RoomRepository;
import com.wpz.rbs.utils.StaticHelpers;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.util.Date;
import java.util.List;

@Service
public class ReservationService {
    private final ReservationRepository reservationRepository;
    private final ActivityRepository activityRepository;
    private final RoomRepository roomRepository;
    private final EmailService emailService;

    public ReservationService(ReservationRepository reservationRepository, ActivityRepository activityRepository, RoomRepository roomRepository, EmailService emailService) {
        this.reservationRepository = reservationRepository;
        this.activityRepository = activityRepository;
        this.roomRepository = roomRepository;
        this.emailService = emailService;
    }

    public Reservation getById(int id) {
        return reservationRepository.findById(id).orElse(null);
    }

    public List<Reservation> getByRoomId(int roomId) {
        return reservationRepository.findAllByRoom_Id(roomId);
    }

    public List<Reservation> getAll() {
        return reservationRepository.findAll();
    }

    public ResponseEntity<?> createReservation(CreateReservation reservation) throws ParseException {
        Date startDate = StaticHelpers.parseDateTime(reservation.getStart_time());
        Date endDate = StaticHelpers.parseDateTime(reservation.getEnd_time());
        if (!roomRepository.existsById(reservation.getRoom_id()))
            return ResponseEntity.status(400).body("Wrong room id");
        if (startDate.compareTo(endDate) >= 0)
            return ResponseEntity.status(400).body("Start date is later than end date");
        if (collisionExists(reservation.getRoom_id(), startDate, endDate))
            return ResponseEntity.status(409).body("Room reservation collision detected");

        Reservation savedReservation = reservationRepository.save(new Reservation(reservation));
        emailService.sendMessageToAdmin(savedReservation);
        return ResponseEntity.ok(savedReservation.getId());
    }

    private boolean collisionExists(int roomId, Date newStartDate, Date newEndDate) {
        return activityRepository.findAllByRoomId(roomId).stream().anyMatch(a -> {
            try {
                Date startDate = StaticHelpers.parseDateTime(a.getStart_time());
                Date endDate = StaticHelpers.parseDateTime(a.getEnd_time());
                return StaticHelpers.activitiesOverlapping(newStartDate, newEndDate, startDate, endDate);
            } catch (ParseException e) {
                throw new RuntimeException(e);
            }
        });
    }
}
