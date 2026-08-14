package com.uzhavarsetu.dto;

public record AuthResponse(

        boolean success,

        String message,

        String token,

        Long userId,

        String role,

        String email

) {
}