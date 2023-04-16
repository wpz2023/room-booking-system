package com.wpz.rbs.repository;

import com.wpz.rbs.model.Reservation;
import lombok.NonNull;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface ReservationRepository extends CrudRepository<Reservation, Integer> {
    @Query(value = "select * from Reservation r where r.room_id = :roomId", nativeQuery = true)
    List<Reservation> findAllByRoom_Id(int roomId);

    @NonNull List<Reservation> findAll();
}
