package com.wpz.rbs.controller.auth.models;

public record LoggedInAuthModel (String usosPin, String token, String tokenSecret) {
}
