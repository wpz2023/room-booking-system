package com.wpz.rbs.model;

import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table
@Getter
@Setter
public class Lecturer {
    
    @Id
    private int id; 

    @Column
    private String first_name;

    @Column
    private String last_name;

    @JsonIgnore
    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "lecturers")
    private Set<Activity> activities = new HashSet<>();
}
