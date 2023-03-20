package com.wpz.rbs.controllers.auth.models;

public record RequestTokenResultModel(String url, String temporaryToken, String temporaryTokenSecret) {

}
