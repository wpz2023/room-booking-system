package com.wpz.rbs.model.reservation;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReservationDTO {
    @NotEmpty
    private String name;
    @NotEmpty
    private String email;
    @NotEmpty
    private String first_name;
    @NotEmpty
    private String last_name;
    @NotEmpty
    private String start_time;
    @NotEmpty
    private String end_time;
    @Nullable
    private String phone_number;
    @NotNull
    private int room_id;
}