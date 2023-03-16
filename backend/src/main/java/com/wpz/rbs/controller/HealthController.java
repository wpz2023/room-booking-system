package com.wpz.rbs.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class HealthController {

    @GetMapping("/health")
    public Map<String, String> health() {
        HashMap<String, String> map = new HashMap<>();
        map.put("status", "UP");
        return map;
    }
}
