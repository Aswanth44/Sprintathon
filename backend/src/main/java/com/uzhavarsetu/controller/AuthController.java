package com.uzhavarsetu.controller;

import com.uzhavarsetu.dto.AuthResponse;
import com.uzhavarsetu.dto.LoginRequest;
import com.uzhavarsetu.dto.RegisterRequest;
import com.uzhavarsetu.service.AuthService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;


    public AuthController(
            AuthService authService
    ) {

        this.authService =
                authService;
    }


    // =====================================================
    // BUYER REGISTER
    // =====================================================

    @PostMapping("/register/buyer")
    public ResponseEntity<AuthResponse> registerBuyer(
            @RequestBody RegisterRequest request
    ) {

        return ResponseEntity.ok(
                authService.registerBuyer(
                        request
                )
        );
    }


    // =====================================================
    // LOGIN
    // =====================================================

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @RequestBody LoginRequest request
    ) {

        return ResponseEntity.ok(
                authService.login(
                        request
                )
        );
    }


    // =====================================================
    // GET AUTHENTICATED USER PROFILE
    // =====================================================

    @GetMapping("/me")
    public ResponseEntity<com.uzhavarsetu.dto.UserProfileResponse> getCurrentUserProfile(
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.uzhavarsetu.entity.User user
    ) {
        return ResponseEntity.ok(
                authService.getUserProfile(user)
        );
    }

    // =====================================================
    // UPDATE PROFILE (BUYER / USER)
    // =====================================================

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.uzhavarsetu.entity.User user,
            @RequestBody java.util.Map<String, String> payload
    ) {
        try {
            com.uzhavarsetu.dto.UserProfileResponse updated = authService.updateBuyerProfile(user, payload);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", e.getMessage()));
        }
    }


    // =====================================================
    // CHANGE PASSWORD
    // =====================================================

    @RequestMapping(value = "/change-password", method = {RequestMethod.PUT, RequestMethod.POST})
    public ResponseEntity<?> changePassword(
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.uzhavarsetu.entity.User user,
            @RequestBody com.uzhavarsetu.dto.ChangePasswordRequest request
    ) {
        authService.changePassword(user, request);
        return ResponseEntity.ok(
                java.util.Map.of(
                        "success", true,
                        "message", "Password updated successfully."
                )
        );
    }
}