package com.wpz.rbs.service;

import com.wpz.rbs.model.Activity;
import com.wpz.rbs.model.ActivityConflict;
import com.wpz.rbs.model.Reservation;
import com.wpz.rbs.model.Room;
import com.wpz.rbs.repository.ActivityRepository;
import com.wpz.rbs.repository.RoomRepository;
import com.wpz.rbs.utils.StaticHelpers;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.function.Consumer;
import java.util.function.Predicate;
import java.util.stream.Collectors;

@Service
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final RoomRepository roomRepository;
    private final EmailService emailService;
    private final ReservationService reservationService;

    public ActivityService(ActivityRepository activityRepository, RoomRepository roomRepository, EmailService emailService, ReservationService reservationService) {
        this.activityRepository = activityRepository;
        this.roomRepository = roomRepository;
        this.emailService = emailService;
        this.reservationService = reservationService;
    }

    public List<Activity> getAll() {
        List<Activity> activities = new ArrayList<>();
        activityRepository.findAll().forEach(activities::add);
        return activities;
    }

    public List<Activity> getByRoomId(int roomId) {
        return new ArrayList<>(activityRepository.findAllByRoomId(roomId));
    }

    public List<Activity> getByRoomIdForNextWeek(int roomId, String startDateString) throws ParseException {
        Date startDate = StaticHelpers.parseDate(startDateString);
        Date endDate = StaticHelpers.addDays(startDate, 6);

        try {
            return activityRepository.findAllByRoomId(roomId)
                    .stream()
                    .filter(checked(a -> {
                        Date date = StaticHelpers.parseDate(a.getStart_time());
                        return !(date.before(startDate) || date.after(endDate));
                    }))
                    .collect(Collectors.toList());
        } catch (UncheckedParseException e) {
            throw e.getCause();
        }
    }

    public void clearUsosFromTo(int roomId, Date startDate, Date endDate) throws ParseException {
        try {
            activityRepository.findAllByRoomId(roomId).forEach(checked(activity -> {
                if (!activity.getIs_usos()) return;

                Date date = StaticHelpers.parseDate(activity.getStart_time());

                if (date.compareTo(startDate) >= 0 && date.compareTo(endDate) < 0) {
                    activityRepository.delete(activity);
                }
            }));
        } catch (UncheckedParseException e) {
            throw e.getCause();
        }
    }

    public Activity saveOrUpdate(Activity activity) {
        return activityRepository.save(activity);
    }

    public ActivityConflict getConflictsRoom(int roomId) throws ParseException {
        List<Activity> userActivities = activityRepository.findAllUserActivitiesByRoomId(roomId);
        if (userActivities.isEmpty()) {
            return null;
        }

        List<Activity> usosActivities = activityRepository.findAllUsosActivitiesByRoomId(roomId);
        if (usosActivities.isEmpty()) {
            return null;
        }

        List<Activity> usosConflicts = new ArrayList<>();
        for (Activity userActivity : userActivities) {
            for (Activity usosActivity : usosActivities) {
                if (StaticHelpers.activitiesOverlapping(userActivity, usosActivity)) {
                    usosConflicts.add(usosActivity);
                }
            }
            if (!usosConflicts.isEmpty()) {
                return new ActivityConflict(usosConflicts, userActivity);
            }
        }

        return null;
    }

    public ActivityConflict resolveConflictsAllRoom(List<String> activitiesId) throws ParseException {
        checkIfReservationAndSendMail(activitiesId);
        activityRepository.deleteAllById(activitiesId);
        Iterable<Room> rooms = roomRepository.findAll();
        for (Room room : rooms) {
            ActivityConflict conflict = getConflictsRoom(room.getId());
            if (conflict != null) return conflict;
        }
        return null;
    }

    public ActivityConflict resolveConflictsRoom(int roomId, List<String> activitiesId) throws ParseException {
        checkIfReservationAndSendMail(activitiesId);
        activityRepository.deleteAllById(activitiesId);
        return getConflictsRoom(roomId);
    }

    private void checkIfReservationAndSendMail(List<String> activitiesId) {
        activitiesId.forEach(activityId -> {
            Optional<Activity> activity = activityRepository.findById(activityId);
            if (activity.isPresent() && !activity.get().getIs_usos()) {
                String reservationId = activity.get().getUrl();
                Reservation reservation = reservationService.getById(Integer.parseInt(reservationId));

                if (reservation != null) {
                    emailService.sendDeclinedMessageToUser(reservation);
                    reservationService.declineReservationNoChecks(reservation);
                }
            }
        });
    }

    private <T> Predicate<T> checked(CheckedPredicate<T> predicate) {
        return t -> {
            try {
                return predicate.test(t);
            } catch (ParseException e) {
                throw new UncheckedParseException(e);
            }
        };
    }

    private <T> Consumer<T> checked(CheckedConsumer<T> consumer) {
        return t -> {
            try {
                consumer.accept(t);
            } catch (ParseException e) {
                throw new UncheckedParseException(e);
            }
        };
    }

    @FunctionalInterface
    private interface CheckedPredicate<T> {
        boolean test(T t) throws ParseException;
    }

    @FunctionalInterface
    private interface CheckedConsumer<T> {
        void accept(T t) throws ParseException;
    }

    private static class UncheckedParseException extends RuntimeException {
        private final ParseException cause;

        public UncheckedParseException(ParseException cause) {
            super(cause);
            this.cause = cause;
        }

        @Override
        public synchronized ParseException getCause() {
            return cause;
        }
    }
}
