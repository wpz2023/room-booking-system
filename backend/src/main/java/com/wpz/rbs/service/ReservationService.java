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

    public ReservationService(ReservationRepository reservationRepository, ActivityRepository activityRepository, RoomRepository roomRepository) {
        this.reservationRepository = reservationRepository;
        this.activityRepository = activityRepository;
        this.roomRepository = roomRepository;
    }

    public Reservation getById(int id) {
        return reservationRepository.findById(id).get();
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
            return ResponseEntity.status(409).body("Start date is later than end date");
        if (collisionExists(reservation.getRoom_id(), startDate, endDate))
            throw new RuntimeException("Room reservation collision detected");
        return ResponseEntity.ok(reservationRepository.save(new Reservation(reservation)).getId());
    }

    private boolean collisionExists(int roomId, Date newStartDate, Date newEndDate) {
        return activityRepository.findAllByRoom_Id(roomId).stream().anyMatch(a -> compareDates(newStartDate, newEndDate, a.getStart_time(), a.getEnd_time()));
    }

    private boolean compareDates(Date newStartDate, Date newEndDate, String startDateString, String endDateString) {
        try {
            Date startDate = StaticHelpers.parseDateTime(startDateString);
            Date endDate = StaticHelpers.parseDateTime(endDateString);
            return ((newStartDate.compareTo(startDate) >= 0 && newStartDate.compareTo(endDate) <= 0) || (newEndDate.compareTo(startDate) >= 0 && newEndDate.compareTo(endDate) <= 0) || (newStartDate.compareTo(startDate) <= 0 && newEndDate.compareTo(endDate) >= 0));
        } catch (ParseException e) {
            throw new RuntimeException(e);
        }
    }
}
