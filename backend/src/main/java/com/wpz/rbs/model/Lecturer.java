package com.wpz.rbs.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
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

    //@JsonIgnore
    //@ManyToMany(fetch = FetchType.LAZY, mappedBy = "lecturers")
    //private Set<Activity> activities = new HashSet<>();
}
