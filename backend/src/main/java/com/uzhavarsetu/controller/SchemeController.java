package com.uzhavarsetu.controller;

import com.uzhavarsetu.dto.SchemeRecommendationResponse;
import com.uzhavarsetu.entity.User;
import com.uzhavarsetu.service.EligibilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class SchemeController {

    @Autowired
    private EligibilityService eligibilityService;

    private User resolveUser(User principal, Authentication auth) {
        if (principal != null && principal.getId() != null) {
            return principal;
        }
        if (auth != null && auth.getPrincipal() instanceof User u && u.getId() != null) {
            return u;
        }
        return null;
    }

    /**
     * GET /api/farmer/schemes
     * Returns personalized government scheme recommendations for authenticated farmer.
     */
    @GetMapping("/api/farmer/schemes")
    public ResponseEntity<List<SchemeRecommendationResponse>> getFarmerSchemes(
            @AuthenticationPrincipal User principal,
            Authentication auth
    ) {
        User activeUser = resolveUser(principal, auth);
        if (activeUser == null) {
            return ResponseEntity.status(401).build();
        }
        List<SchemeRecommendationResponse> list = eligibilityService.getPersonalizedSchemesForFarmer(activeUser);
        return ResponseEntity.ok(list);
    }

    /**
     * GET /api/farmer/schemes/{schemeId}
     * Returns personalized scheme details and evaluation analysis for authenticated farmer.
     */
    @GetMapping("/api/farmer/schemes/{schemeId}")
    public ResponseEntity<SchemeRecommendationResponse> getFarmerSchemeDetails(
            @PathVariable Long schemeId,
            @AuthenticationPrincipal User principal,
            Authentication auth
    ) {
        User activeUser = resolveUser(principal, auth);
        if (activeUser == null) {
            return ResponseEntity.status(401).build();
        }
        SchemeRecommendationResponse dto = eligibilityService.getSingleSchemeForFarmer(activeUser, schemeId);
        return ResponseEntity.ok(dto);
    }

    /**
     * GET /api/schemes
     * Public endpoint returning active government schemes.
     */
    @GetMapping("/api/schemes")
    public ResponseEntity<List<SchemeRecommendationResponse>> getPublicSchemes() {
        return ResponseEntity.ok(eligibilityService.getPublicSchemes());
    }
}
