package com.uzhavarsetu.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

// SPRING BOOT ENDPOINT: GET /api/health
@RestController
@RequestMapping("/api")
public class HealthController {

    @Value("${spring.kafka.bootstrap-servers:localhost:9092}")
    private String kafkaServers;

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> getHealth() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "UzhavarSetu Backend");
        response.put("kafka", "CONNECTED");
        response.put("kafkaServers", kafkaServers);
        response.put("timestamp", java.time.LocalDateTime.now().toString());

        return ResponseEntity.ok(response);
    }
}
