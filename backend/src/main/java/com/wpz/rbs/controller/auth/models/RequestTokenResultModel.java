package com.wpz.rbs.controller.auth.models;

public record RequestTokenResultModel(String url, String temporaryToken, String temporaryTokenSecret) {

}
