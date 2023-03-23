package com.wpz.rbs.model;

import jakarta.annotation.Nonnull;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

import java.util.Date;
import java.util.UUID;

@Entity
@Table
@Data
public class ApiUser {
    public ApiUser() {
    }

    public ApiUser(String usosPin, String token, String tokenSecret, Date expDate) {
        this.usosPin = usosPin;
        this.token = token;
        this.tokenSecret = tokenSecret;
        this.expDate = expDate;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column
    @Nonnull
    private String token;

    @Column
    @Nonnull
    private String tokenSecret;

    @Column
    @Nonnull
    private String usosPin;

    @Column
    @Nonnull
    private Date expDate;
}