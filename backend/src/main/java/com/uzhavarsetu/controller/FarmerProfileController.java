package com.uzhavarsetu.controller;

import com.uzhavarsetu.dto.UserProfileResponse;
import com.uzhavarsetu.entity.BuyerOffer;
import com.uzhavarsetu.entity.FarmerProfile;
import com.uzhavarsetu.entity.ProduceBatch;
import com.uzhavarsetu.entity.User;
import com.uzhavarsetu.repository.FarmerProfileRepository;
import com.uzhavarsetu.repository.UserRepository;
import com.uzhavarsetu.service.AuthService;
import com.uzhavarsetu.service.BuyerOfferService;
import com.uzhavarsetu.service.ProduceBatchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * FARMER PROFILE CONTROLLER
 *
 * Endpoints:
 *   GET  /api/farmer/profile          - return full profile + stats
 *   PUT  /api/farmer/profile          - update personal info (name, mobile, village, district, state)
 *   PUT  /api/farmer/farm-details     - update farm details (farmSize, primaryCrops, otherCrops, farmingType, experience, farmLocation)
 *
 * All endpoints require a valid JWT token (the authenticated farmer is
 * resolved via @AuthenticationPrincipal or SecurityContextHolder).
 * NO hardcoded farmer IDs are used.
 */
@RestController
@RequestMapping("/api/farmer")
public class FarmerProfileController {

    @Autowired
    private AuthService authService;

    @Autowired
    private ProduceBatchService batchService;

    @Autowired
    private BuyerOfferService offerService;

    @Autowired
    private FarmerProfileRepository farmerProfileRepository;

    @Autowired
    private UserRepository userRepository;

    // =========================================================
    // RESOLVE AUTHENTICATED USER
    // =========================================================

    private User resolveUser(User principal, Authentication auth) {
        if (principal != null && principal.getId() != null) {
            return principal;
        }
        if (auth != null && auth.getPrincipal() instanceof User u && u.getId() != null) {
            return u;
        }
        return null;
    }

    // =========================================================
    // GET /api/farmer/profile
    // =========================================================

    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> getFarmerProfile(
            @AuthenticationPrincipal User principal,
            Authentication auth
    ) {
        User activeUser = resolveUser(principal, auth);
        if (activeUser == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }

        // Re-fetch from DB to get fresh data
        User dbUser = userRepository.findById(activeUser.getId()).orElse(null);
        if (dbUser == null) {
            return ResponseEntity.status(404).body(Map.of("error", "User not found"));
        }

        // Build profile response
        UserProfileResponse profile = authService.getUserProfile(dbUser);

        // Compute real stats from DB
        List<ProduceBatch> batches = batchService.getBatchesForFarmer(dbUser);
        List<BuyerOffer> offers = offerService.getOffersForFarmer(dbUser);

        long totalBatchesCreated = batches.size();
        long activeBatches = batches.stream()
                .filter(b -> !"COMPLETED".equalsIgnoreCase(b.getStatus())
                          && !"DELIVERED".equalsIgnoreCase(b.getStatus()))
                .count();
        long completedTransactions = offers.stream()
                .filter(o -> "ACCEPTED".equalsIgnoreCase(o.getStatus()))
                .count();
        double produceSoldKg = offers.stream()
                .filter(o -> "ACCEPTED".equalsIgnoreCase(o.getStatus()))
                .mapToDouble(o -> o.getQuantity() != null ? o.getQuantity() : 0)
                .sum();

        // Set computed stats onto the profile
        profile.setTotalBatchesCreated(totalBatchesCreated);
        profile.setActiveBatches(activeBatches);
        profile.setCompletedTransactions(completedTransactions);
        profile.setProduceSold(produceSoldKg / 1000.0); // convert kg → tons

        Map<String, Object> response = new HashMap<>();
        response.put("profile", profile);
        response.put("stats", Map.of(
                "totalBatchesCreated", totalBatchesCreated,
                "activeBatches", activeBatches,
                "completedTransactions", completedTransactions,
                "produceSold", produceSoldKg / 1000.0
        ));

        return ResponseEntity.ok(response);
    }

    // =========================================================
    // PUT /api/farmer/profile
    // Updates: name, mobile, village, district, state
    // =========================================================

    @PutMapping("/profile")
    public ResponseEntity<Map<String, Object>> updateFarmerProfile(
            @AuthenticationPrincipal User principal,
            Authentication auth,
            @RequestBody Map<String, Object> payload
    ) {
        User activeUser = resolveUser(principal, auth);
        if (activeUser == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }

        User dbUser = userRepository.findById(activeUser.getId()).orElse(null);
        if (dbUser == null) {
            return ResponseEntity.status(404).body(Map.of("error", "User not found"));
        }

        // Update User fields
        if (payload.containsKey("name") && payload.get("name") instanceof String s && !s.isBlank()) {
            dbUser.setName(s.trim());
        }
        if (payload.containsKey("mobile") && payload.get("mobile") instanceof String s && !s.isBlank()) {
            dbUser.setMobile(s.trim());
        }
        userRepository.save(dbUser);

        // Update FarmerProfile location fields
        FarmerProfile fp = farmerProfileRepository.findByUser(dbUser).orElse(null);
        if (fp != null) {
            if (payload.containsKey("mobile") && payload.get("mobile") instanceof String s && !s.isBlank()) {
                fp.setMobile(s.trim());
            }
            if (payload.containsKey("village") && payload.get("village") instanceof String s && !s.isBlank()) {
                fp.setVillage(s.trim());
            }
            if (payload.containsKey("district") && payload.get("district") instanceof String s && !s.isBlank()) {
                fp.setDistrict(s.trim());
            }
            if (payload.containsKey("state") && payload.get("state") instanceof String s && !s.isBlank()) {
                fp.setState(s.trim());
            }
            farmerProfileRepository.save(fp);
        }

        // Return fresh profile
        return getFarmerProfile(principal, auth);
    }

    // =========================================================
    // PUT /api/farmer/farm-details
    // Updates: farmSize, primaryCrops, otherCrops, farmingType, experience, farmLocation
    // =========================================================

    @PutMapping("/farm-details")
    public ResponseEntity<Map<String, Object>> updateFarmDetails(
            @AuthenticationPrincipal User principal,
            Authentication auth,
            @RequestBody Map<String, Object> payload
    ) {
        User activeUser = resolveUser(principal, auth);
        if (activeUser == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }

        User dbUser = userRepository.findById(activeUser.getId()).orElse(null);
        if (dbUser == null) {
            return ResponseEntity.status(404).body(Map.of("error", "User not found"));
        }

        FarmerProfile fp = farmerProfileRepository.findByUser(dbUser).orElse(null);
        if (fp == null) {
            return ResponseEntity.status(404).body(Map.of("error", "Farmer profile not found"));
        }

        if (payload.containsKey("farmSize")) {
            Object val = payload.get("farmSize");
            if (val instanceof Number n) {
                fp.setFarmSize(n.doubleValue());
            } else if (val instanceof String s && !s.isBlank()) {
                try {
                    fp.setFarmSize(Double.parseDouble(s.replaceAll("[^0-9.]", "")));
                } catch (NumberFormatException ignored) {}
            }
        }
        if (payload.containsKey("primaryCrops") && payload.get("primaryCrops") instanceof String s) {
            fp.setPrimaryCrops(s.trim());
        }
        if (payload.containsKey("otherCrops") && payload.get("otherCrops") instanceof String s) {
            fp.setOtherCrops(s.trim());
        }
        if (payload.containsKey("farmingType") && payload.get("farmingType") instanceof String s) {
            fp.setFarmingType(s.trim());
        }
        if (payload.containsKey("experience") && payload.get("experience") instanceof String s) {
            fp.setExperience(s.trim());
        }
        if (payload.containsKey("farmLocation") && payload.get("farmLocation") instanceof String s) {
            fp.setFarmLocation(s.trim());
        }
        // Also allow updating location from farm-details
        if (payload.containsKey("village") && payload.get("village") instanceof String s && !s.isBlank()) {
            fp.setVillage(s.trim());
        }
        if (payload.containsKey("district") && payload.get("district") instanceof String s && !s.isBlank()) {
            fp.setDistrict(s.trim());
        }
        if (payload.containsKey("state") && payload.get("state") instanceof String s && !s.isBlank()) {
            fp.setState(s.trim());
        }

        farmerProfileRepository.save(fp);

        // Return fresh profile
        return getFarmerProfile(principal, auth);
    }
}
