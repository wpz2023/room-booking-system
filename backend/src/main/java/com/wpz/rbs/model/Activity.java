package com.wpz.rbs.model;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.MapKeyColumn;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table
@Getter
@Setter
@NoArgsConstructor
public class Activity {

    public Activity(String type, String start_time, String end_time, String url, 
    Map<String, String> course_name, Map<String, String> classtype_name, int group_number, int room_id, Boolean is_usos){
        this.id = room_id + ":" + group_number + ":" + start_time + ":" + end_time + ":" + url;

        this.type = type;
        this.start_time = start_time;
        this.end_time = end_time;
        this.url = url;
        this.course_name = course_name;
        this.classtype_name = classtype_name; 
        this.group_number = group_number;
        this.room_id = room_id;
        this.is_usos = is_usos;
    }

    @Id
    private String id;
    @Column
    private String type;
    @Column
    private String start_time;
    @Column
    private String end_time;

    @Column
    private String url;
    
    @ElementCollection
    @JoinTable(name="activity_course_name_mapping", 
    joinColumns=@JoinColumn(name="activity_id"))
    @MapKeyColumn (name="lang")
    @Column(name="course_name")
    private Map<String, String> course_name;

    @ElementCollection
    @JoinTable(name="activity_classtype_name_mapping", 
    joinColumns=@JoinColumn(name="activity_id"))
    @MapKeyColumn (name="lang")
    @Column(name="classtype_name")
    private Map<String, String> classtype_name;
    
    @Column
    private int group_number;

    @Column
    private int room_id;

    @Column
    private Boolean is_usos;

    @ManyToMany(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinTable(
        name = "activities_lecturers",
        joinColumns = @JoinColumn(name = "activity_id")
    )
    private Set<Lecturer> lecturers = new HashSet<>();
}
