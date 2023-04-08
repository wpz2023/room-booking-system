package com.wpz.rbs.service;

import com.wpz.rbs.model.Reservation;
import com.wpz.rbs.model.reservation.CreateReservation;
import com.wpz.rbs.repository.ActivityRepository;
import com.wpz.rbs.repository.ReservationRepository;
import com.wpz.rbs.repository.RoomRepository;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class ReservationService {
    private final ReservationRepository reservationRepository;
    private final ActivityRepository activityRepository;
    private final RoomRepository roomRepository;
    private final SimpleDateFormat dateFormat;

    public ReservationService(ReservationRepository reservationRepository, ActivityRepository activityRepository, RoomRepository roomRepository) {
        this.reservationRepository = reservationRepository;
        this.activityRepository = activityRepository;
        this.roomRepository = roomRepository;
        this.dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    }

    public Reservation getById(int id) {
        return reservationRepository.findById(id).get();
    }

    public List<Reservation> getByRoomId(int roomId) {
        return new ArrayList<>(reservationRepository.findAllByRoom_Id(roomId));
    }

    public int createReservation(CreateReservation reservation) throws ParseException {
        Date startDate = dateFormat.parse(reservation.getStart_time());
        Date endDate = dateFormat.parse(reservation.getEnd_time());
        if (!roomRepository.existsById(reservation.getRoom_id())) throw new RuntimeException("Wrong room id");
        if (startDate.compareTo(endDate) >= 0) throw new RuntimeException("Start date is later than end date");
        if (collisionExists(reservation.getRoom_id(), startDate, endDate))
            throw new RuntimeException("Room reservation collision detected");
        return reservationRepository.save(new Reservation(reservation)).getId();
    }

    private boolean collisionExists(int roomId, Date newStartDate, Date newEndDate) {
        return activityRepository.findAllByRoom_Id(roomId).stream().anyMatch(a -> compareDates(newStartDate, newEndDate, a.getStart_time(), a.getEnd_time())) || getByRoomId(roomId).stream().anyMatch(r -> compareDates(newStartDate, newEndDate, r.getStart_time(), r.getEnd_time()));
    }

    private boolean compareDates(Date newStartDate, Date newEndDate, String startDateString, String endDateString) {
        try {
            Date startDate = dateFormat.parse(startDateString);
            Date endDate = dateFormat.parse(endDateString);
            return ((newStartDate.compareTo(startDate) >= 0 && newStartDate.compareTo(endDate) <= 0) || (newEndDate.compareTo(startDate) >= 0 && newEndDate.compareTo(endDate) <= 0) || (newStartDate.compareTo(startDate) <= 0 && newEndDate.compareTo(endDate) >= 0));
        } catch (ParseException e) {
            throw new RuntimeException(e);
        }
    }
}
