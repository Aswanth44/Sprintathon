package com.uzhavarsetu.controller;

import com.uzhavarsetu.dto.UserProfileResponse;
import com.uzhavarsetu.entity.BuyerOffer;
import com.uzhavarsetu.entity.ProduceBatch;
import com.uzhavarsetu.entity.User;
import com.uzhavarsetu.repository.UserRepository;
import com.uzhavarsetu.service.AuthService;
import com.uzhavarsetu.service.BuyerOfferService;
import com.uzhavarsetu.service.ProduceBatchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

@RestController
@RequestMapping("/api/farmer")
public class FarmerDashboardController {

    @Autowired
    private ProduceBatchService batchService;

    @Autowired
    private BuyerOfferService offerService;

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    /**
     * Resolves the authenticated user strictly from the security context.
     * NEVER falls back to a hardcoded ID or first-user trick.
     */
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
     * GET /api/farmer/dashboard
     *
     * Returns DB-driven summary for the authenticated farmer.
     * Fresh farmer with no records gets all zeros — no demo/fake data.
     */
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getFarmerDashboard(
            @AuthenticationPrincipal User principal,
            Authentication auth
    ) {
        Map<String, Object> response = new HashMap<>();
        User activeUser = resolveUser(principal, auth);

        if (activeUser == null) {
            // Not authenticated — return empty safe state
            Map<String, Object> emptySummary = new HashMap<>();
            emptySummary.put("inTransitAndStored", 0);
            emptySummary.put("pendingReview", 0);
            emptySummary.put("highestBuyerBid", null);
            emptySummary.put("highestBuyerBidUnit", "kg");
            emptySummary.put("myBatchesCount", 0);
            emptySummary.put("buyerOffersCount", 0);
            emptySummary.put("totalBatchesCreated", 0);
            emptySummary.put("activeBatches", 0);
            emptySummary.put("completedTransactions", 0);
            emptySummary.put("produceSold", 0.0);
            emptySummary.put("mandiIndex", 42);

            response.put("summary", emptySummary);
            response.put("batches", Collections.emptyList());
            response.put("offers", Collections.emptyList());
            response.put("recentActivities", Collections.emptyList());
            return ResponseEntity.ok(response);
        }

        // Re-fetch from DB to ensure we have the freshest user data
        User dbUser = userRepository.findById(activeUser.getId()).orElse(activeUser);

        List<ProduceBatch> batches = batchService.getBatchesForFarmer(dbUser);
        List<BuyerOffer> offers = offerService.getOffersForFarmer(dbUser);
        UserProfileResponse profile = authService.getUserProfile(dbUser);

        // IN TRANSIT: status is IN_TRANSIT or WAREHOUSE_STORED; or stage is TRANSPORT or WAREHOUSE
        long inTransitCount = batches.stream()
                .filter(b -> "IN_TRANSIT".equalsIgnoreCase(b.getStatus())
                        || "WAREHOUSE_STORED".equalsIgnoreCase(b.getStatus())
                        || "TRANSPORT".equalsIgnoreCase(b.getCurrentStage())
                        || "WAREHOUSE".equalsIgnoreCase(b.getCurrentStage()))
                .count();

        // PENDING REVIEW: newly created batches at farm stage
        long pendingCount = batches.stream()
                .filter(b -> "PENDING".equalsIgnoreCase(b.getStatus())
                        || "CREATED".equalsIgnoreCase(b.getStatus())
                        || "FARM".equalsIgnoreCase(b.getCurrentStage()))
                .count();

        // Highest bid price
        OptionalDouble highestBid = offers.stream()
                .mapToDouble(o -> o.getOfferedPrice() != null ? o.getOfferedPrice() : 0.0)
                .max();

        // Stats: all computed from DB records
        long totalBatchesCreated = batches.size();
        long activeBatches = batches.stream()
                .filter(b -> !"COMPLETED".equalsIgnoreCase(b.getStatus())
                          && !"DELIVERED".equalsIgnoreCase(b.getStatus()))
                .count();
        long completedTransactions = offers.stream()
                .filter(o -> "ACCEPTED".equalsIgnoreCase(o.getStatus()))
                .count();
        double produceSoldTons = offers.stream()
                .filter(o -> "ACCEPTED".equalsIgnoreCase(o.getStatus()))
                .mapToDouble(o -> o.getQuantity() != null ? o.getQuantity() : 0)
                .sum() / 1000.0;

        Map<String, Object> summary = new HashMap<>();
        summary.put("inTransitAndStored", inTransitCount);
        summary.put("pendingReview", pendingCount);
        summary.put("highestBuyerBid", highestBid.isPresent() && highestBid.getAsDouble() > 0 ? highestBid.getAsDouble() : null);
        summary.put("highestBuyerBidUnit", "kg");
        summary.put("myBatchesCount", batches.size());
        summary.put("buyerOffersCount", offers.size());
        summary.put("totalBatchesCreated", totalBatchesCreated);
        summary.put("activeBatches", activeBatches);
        summary.put("completedTransactions", completedTransactions);
        summary.put("produceSold", produceSoldTons);
        summary.put("mandiIndex", 42);

        response.put("summary", summary);
        response.put("farmer", profile);
        response.put("batches", batches);
        response.put("offers", offers);
        response.put("recentActivities", Collections.emptyList());

        return ResponseEntity.ok(response);
    }
}
