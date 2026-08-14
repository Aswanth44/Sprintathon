package com.uzhavarsetu.controller;

import com.uzhavarsetu.dto.EmailRequest;
import com.uzhavarsetu.dto.VerifyOtpRequest;
import com.uzhavarsetu.service.EmailOtpService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth/email")
public class EmailOtpController {

    private final EmailOtpService emailOtpService;

    public EmailOtpController(
            EmailOtpService emailOtpService
    ) {
        this.emailOtpService = emailOtpService;
    }

    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(
            @Valid @RequestBody EmailRequest request
    ) {

        emailOtpService.sendOtp(
                request.getEmail()
        );

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "OTP sent successfully to your email"
                )
        );
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(
            @Valid @RequestBody VerifyOtpRequest request
    ) {

        emailOtpService.verifyOtp(
                request.getEmail(),
                request.getOtp()
        );

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Email verified successfully"
                )
        );
    }
}