package com.wpz.rbs.model;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
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

    public Activity(String type, String start_time, String end_time, Map<String,String> name,
    String url, Map<String, String> course_name, Map<String, String> classtype_name){
        this.type = type;
        this.start_time = start_time;
        this.end_time = end_time;
        this.name = name;
        this.url = url;
        this.course_name = course_name;
        this.classtype_name = classtype_name; 
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column
    private String type;
    @Column
    private String start_time;
    @Column
    private String end_time;

    @ElementCollection
    @JoinTable(name="activity_name_mapping", 
    joinColumns=@JoinColumn(name="activity_id"))
    @MapKeyColumn (name="lang")
    @Column(name="name")
    private Map<String, String> name;

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
    
    @JsonIgnore
    @ManyToMany(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE, CascadeType.PERSIST})
    @JoinTable(
        name = "activities_lecturers",
        joinColumns = @JoinColumn(name = "activity_id"),
        inverseJoinColumns = @JoinColumn(name = "lecturer_id")
    )
    private Set<Lecturer> lecturers = new HashSet<>();
}
