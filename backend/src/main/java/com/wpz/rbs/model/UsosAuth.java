package com.wpz.rbs.model;

import jakarta.annotation.Nonnull;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

import java.util.Date;

@Entity
@Table
@Data
public class UsosAuth {
    public UsosAuth() {
    }

    public UsosAuth(String usosPin, String token, String tokenSecret) {
        this.usosPin = usosPin;
        this.token = token;
        this.tokenSecret = tokenSecret;
        // add a bit less than 2hrs to exp time - USOS token lifetime is 2hrs
        this.expDate = new Date(new Date().getTime() + 7000000L);
    }

    @Id
    private int id = 1;

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