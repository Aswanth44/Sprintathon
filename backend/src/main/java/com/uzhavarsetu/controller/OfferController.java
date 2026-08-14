package com.uzhavarsetu.controller;

import com.uzhavarsetu.entity.BuyerOffer;
import com.uzhavarsetu.entity.User;
import com.uzhavarsetu.service.BuyerOfferService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class OfferController {

    @Autowired
    private BuyerOfferService offerService;

    /**
     * Resolves the authenticated user strictly — NEVER falls back to a random/first user.
     */
    private User resolveUser(User principal, Authentication auth) {
        if (principal != null && principal.getId() != null) return principal;
        if (auth != null && auth.getPrincipal() instanceof User u && u.getId() != null) return u;
        return null;
    }

    /**
     * GET /api/offers
     * Returns the authenticated user's offers:
     * - Farmer: offers on their batches
     * - Buyer: offers they have submitted
     */
    @GetMapping("/offers")
    public ResponseEntity<List<BuyerOffer>> getOffers(
            @AuthenticationPrincipal User principal,
            Authentication auth
    ) {
        User activeUser = resolveUser(principal, auth);
        if (activeUser == null) {
            return ResponseEntity.status(401).build();
        }
        if (activeUser.getRole() == User.Role.FARMER) {
            return ResponseEntity.ok(offerService.getOffersForFarmer(activeUser));
        } else if (activeUser.getRole() == User.Role.BUYER) {
            return ResponseEntity.ok(offerService.getOffersForBuyer(activeUser));
        }
        return ResponseEntity.ok(offerService.getAllOffers());
    }

    /**
     * GET /api/batches/{batchId}/offers
     * Returns offers for the authenticated user (scoped to their role).
     */
    @GetMapping("/batches/{batchId}/offers")
    public ResponseEntity<List<BuyerOffer>> getBatchOffers(
            @PathVariable String batchId,
            @AuthenticationPrincipal User principal,
            Authentication auth
    ) {
        return getOffers(principal, auth);
    }

    /**
     * POST /api/buyer/offers
     * Creates a new offer from the authenticated buyer.
     */
    @PostMapping("/buyer/offers")
    public ResponseEntity<BuyerOffer> createOffer(
            @AuthenticationPrincipal User principal,
            Authentication auth,
            @RequestBody Map<String, Object> payload
    ) {
        User activeUser = resolveUser(principal, auth);
        if (activeUser == null) {
            return ResponseEntity.status(401).build();
        }
        BuyerOffer offer = offerService.createOffer(activeUser, payload);
        return ResponseEntity.ok(offer);
    }

    /**
     * PUT /api/farmer/offers/{offerId}/status
     * Accepts, rejects, or counters an offer (farmer action).
     */
    @PutMapping("/farmer/offers/{offerId}/status")
    public ResponseEntity<BuyerOffer> updateOfferStatus(
            @AuthenticationPrincipal User principal,
            Authentication auth,
            @PathVariable String offerId,
            @RequestBody Map<String, Object> payload
    ) {
        User activeUser = resolveUser(principal, auth);
        if (activeUser == null) {
            return ResponseEntity.status(401).build();
        }
        String status = (String) payload.get("status");

        if ("COUNTER".equalsIgnoreCase(status) || "COUNTERED".equalsIgnoreCase(status) || payload.containsKey("counterPrice")) {
            Double counterPrice = null;
            Object cpObj = payload.get("counterPrice");
            if (cpObj instanceof Number n) counterPrice = n.doubleValue();
            else if (cpObj instanceof String s) {
                try { counterPrice = Double.parseDouble(s); } catch (Exception ignored) {}
            }

            Double quantity = null;
            Object qtyObj = payload.get("quantity");
            if (qtyObj instanceof Number n) quantity = n.doubleValue();

            String message = (String) payload.get("message");

            BuyerOffer countered = offerService.counterOffer(activeUser, offerId, counterPrice, quantity, message);
            return ResponseEntity.ok(countered);
        }

        BuyerOffer updated = offerService.updateOfferStatus(activeUser, offerId, status);
        return ResponseEntity.ok(updated);
    }

    /**
     * POST/PUT /api/farmer/offers/{offerId}/counter
     * Submits a counter offer from farmer.
     */
    @RequestMapping(value = "/farmer/offers/{offerId}/counter", method = {RequestMethod.POST, RequestMethod.PUT})
    public ResponseEntity<BuyerOffer> submitCounterOffer(
            @AuthenticationPrincipal User principal,
            Authentication auth,
            @PathVariable String offerId,
            @RequestBody Map<String, Object> payload
    ) {
        User activeUser = resolveUser(principal, auth);
        if (activeUser == null) {
            return ResponseEntity.status(401).build();
        }
        Double counterPrice = null;
        Object cpObj = payload.get("counterPrice");
        if (cpObj instanceof Number n) counterPrice = n.doubleValue();
        else if (cpObj instanceof String s) {
            try { counterPrice = Double.parseDouble(s); } catch (Exception ignored) {}
        }

        Double quantity = null;
        Object qtyObj = payload.get("quantity");
        if (qtyObj instanceof Number n) quantity = n.doubleValue();

        String message = (String) payload.get("message");

        BuyerOffer countered = offerService.counterOffer(activeUser, offerId, counterPrice, quantity, message);
        return ResponseEntity.ok(countered);
    }


    /**
     * PUT /api/buyer/offers/{offerId}/status
     * Responds to counter offer (buyer action).
     */
    @PutMapping("/buyer/offers/{offerId}/status")
    public ResponseEntity<BuyerOffer> respondToCounterOffer(
            @AuthenticationPrincipal User principal,
            Authentication auth,
            @PathVariable String offerId,
            @RequestBody Map<String, String> payload
    ) {
        User activeUser = resolveUser(principal, auth);
        if (activeUser == null) {
            return ResponseEntity.status(401).build();
        }
        String status = payload.get("status");
        String finalStatus = "accept".equalsIgnoreCase(status) ? "ACCEPTED" : "REJECTED";
        BuyerOffer updated = offerService.updateOfferStatus(activeUser, offerId, finalStatus);
        return ResponseEntity.ok(updated);
    }

    /**
     * GET /api/buyer/purchases
     * Returns purchases belonging strictly to the authenticated buyer.
     */
    @GetMapping("/buyer/purchases")
    public ResponseEntity<List<Map<String, Object>>> getBuyerPurchases(
            @AuthenticationPrincipal User principal,
            Authentication auth
    ) {
        User activeUser = resolveUser(principal, auth);
        if (activeUser == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(offerService.getPurchasesForBuyer(activeUser));
    }

    /**
     * GET /api/buyer/orders
     * Returns trackable orders belonging strictly to the authenticated buyer.
     */
    @GetMapping("/buyer/orders")
    public ResponseEntity<List<Map<String, Object>>> getBuyerOrders(
            @AuthenticationPrincipal User principal,
            Authentication auth
    ) {
        User activeUser = resolveUser(principal, auth);
        if (activeUser == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(offerService.getOrdersForBuyer(activeUser));
    }

    /**
     * GET /api/buyer/dashboard
     * Returns DB-driven summary metrics for the authenticated buyer.
     */
    @GetMapping("/buyer/dashboard")
    public ResponseEntity<Map<String, Object>> getBuyerDashboard(
            @AuthenticationPrincipal User principal,
            Authentication auth
    ) {
        User activeUser = resolveUser(principal, auth);
        if (activeUser == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(offerService.getBuyerDashboardSummary(activeUser));
    }
}
