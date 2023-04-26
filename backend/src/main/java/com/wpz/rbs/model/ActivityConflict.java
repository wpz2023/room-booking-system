package com.wpz.rbs.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActivityConflict {
    private List<Activity> usosActivities;
    private Activity userActivity;
}
