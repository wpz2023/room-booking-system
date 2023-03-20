package com.wpz.rbs.controllers.auth.models;

public record LoggedInAuthModel (String usosPin, String token, String tokenSecret) {
}
