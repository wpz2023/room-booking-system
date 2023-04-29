package com.wpz.rbs.service;

import com.wpz.rbs.model.Activity;
import com.wpz.rbs.model.Lecturer;
import com.wpz.rbs.model.Reservation;
import com.wpz.rbs.model.reservation.PutReservation;
import com.wpz.rbs.repository.ActivityRepository;
import com.wpz.rbs.repository.ReservationRepository;
import com.wpz.rbs.repository.RoomRepository;
import com.wpz.rbs.utils.StaticHelpers;
import jakarta.transaction.Transactional;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.util.*;

@Service
public class ReservationService {
    private final ReservationRepository reservationRepository;
    private final ActivityRepository activityRepository;
    private final RoomRepository roomRepository;
    private final EmailService emailService;
    private final LecturerService lecturerService;

    public ReservationService(ReservationRepository reservationRepository, ActivityRepository activityRepository, RoomRepository roomRepository, EmailService emailService, LecturerService lecturerService) {
        this.reservationRepository = reservationRepository;
        this.activityRepository = activityRepository;
        this.roomRepository = roomRepository;
        this.emailService = emailService;
        this.lecturerService = lecturerService;
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

    public ResponseEntity<?> createReservation(PutReservation reservation) throws ParseException {
        ResponseEntity<?> result = checkNewOrEditedReservation(reservation);
        if (result != null)
            return result;

        Reservation savedReservation = reservationRepository.save(new Reservation(reservation));
        emailService.sendMessageToAdmin(savedReservation);
        return ResponseEntity.ok(savedReservation.getId());
    }

    @Transactional
    public ResponseEntity<?> confirmReservation(int id) throws ParseException {
        Optional<Reservation> reservationOptional = reservationRepository.findById(id);
        if (reservationOptional.isEmpty())
            return ResponseEntity.status(400).body("Reservation with given id doesn't exist");

        Reservation reservation = reservationOptional.get();
        if (reservation.is_confirmed())
            return ResponseEntity.status(409).body("Reservation is already confirmed");
        if (collisionExists(reservation.getRoom_id(), StaticHelpers.parseDateTime(reservation.getStart_time()), StaticHelpers.parseDateTime(reservation.getEnd_time())))
            return ResponseEntity.status(409).body("Room reservation collision detected");

        Activity activity = new Activity("classgroup", reservation.getStart_time(), reservation.getEnd_time(), String.valueOf(reservation.getId()), new HashMap<>() {{
            put("pl", reservation.getName());
            put("en", reservation.getName());
        }}, new HashMap<>() {{
            put("pl", "Rezerwacja");
            put("en", "Reservation");
        }}, 1, reservation.getRoom_id(), false);

        Lecturer lecturer = lecturerService.getById(reservation.getEmail());
        if (lecturer == null)
            lecturer = lecturerService.saveOrUpdate(new Lecturer(reservation.getEmail(), reservation.getFirst_name(), reservation.getLast_name()));

        activity.setLecturers(new HashSet<>(Collections.singletonList(lecturer)));
        activityRepository.save(activity);

        reservation.set_confirmed(true);
        reservationRepository.save(reservation);

        emailService.sendAcceptedMessageToUser(reservation);
        return ResponseEntity.status(200).body(activity.getId());
    }

    public ResponseEntity<?> updateReservation(int reservationId, PutReservation editedReservation) throws ParseException {
        Optional<Reservation> reservationOptional = reservationRepository.findById(reservationId);
        if (reservationOptional.isEmpty())
            return ResponseEntity.status(400).body("Reservation with given id doesn't exist");

        Reservation reservation = reservationOptional.get();
        if (reservation.is_confirmed())
            return ResponseEntity.status(409).body("Reservation is already confirmed");

        ResponseEntity<?> result = checkNewOrEditedReservation(editedReservation);
        if (result != null)
            return result;

        reservation = new Reservation(editedReservation);
        reservation.setId(reservationId);
        reservationRepository.save(reservation);
        emailService.sendChangedMessageToUser(reservation);

        return ResponseEntity.status(200).build();
    }

    private ResponseEntity<?> checkNewOrEditedReservation(PutReservation reservation) throws ParseException {
        if (!roomRepository.existsById(reservation.getRoom_id()))
            return ResponseEntity.status(400).body("Wrong room id");

        Date startDate = StaticHelpers.parseDateTime(reservation.getStart_time());
        Date endDate = StaticHelpers.parseDateTime(reservation.getEnd_time());

        if (startDate.compareTo(endDate) >= 0)
            return ResponseEntity.status(400).body("Start date is later than end date");
        if (collisionExists(reservation.getRoom_id(), startDate, endDate))
            return ResponseEntity.status(409).body("Room reservation collision detected");

        return null;
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
