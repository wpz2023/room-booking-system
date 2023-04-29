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
    private String id;

    @Column
    private String first_name;

    @Column
    private String last_name;

    public Lecturer() {
    }

    public Lecturer(String id, String first_name, String last_name) {
        this.id = id;
        this.first_name = first_name;
        this.last_name = last_name;
    }
}
