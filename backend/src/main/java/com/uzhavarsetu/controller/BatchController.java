package com.uzhavarsetu.controller;

import com.uzhavarsetu.entity.ProduceBatch;
import com.uzhavarsetu.entity.User;
import com.uzhavarsetu.service.ProduceBatchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/batches")
public class BatchController {

    @Autowired
    private ProduceBatchService batchService;

    /**
     * Resolves the authenticated user from @AuthenticationPrincipal or Authentication.
     * NEVER falls back to a random/first user — returns null if not authenticated.
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
     * GET /api/batches
     * Returns produce batches belonging strictly to the authenticated farmer from MySQL.
     * Returns 401 if not authenticated.
     */
    @GetMapping
    public ResponseEntity<List<ProduceBatch>> getBatches(
            @AuthenticationPrincipal User principal,
            Authentication auth
    ) {
        User activeUser = resolveUser(principal, auth);
        if (activeUser == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(batchService.getBatchesForFarmer(activeUser));
    }

    /**
     * GET /api/batches/marketplace
     * Returns ALL available farmer produce batches from MySQL for buyers to browse.
     */
    @GetMapping("/marketplace")
    public ResponseEntity<List<ProduceBatch>> getMarketplaceBatches() {
        return ResponseEntity.ok(batchService.getAllBatches());
    }

    /**
     * POST /api/batches
     * Creates a produce batch in MySQL for the authenticated farmer.
     * Returns 401 if not authenticated.
     */
    @PostMapping
    public ResponseEntity<ProduceBatch> createBatch(
            @AuthenticationPrincipal User principal,
            Authentication auth,
            @RequestBody Map<String, Object> payload
    ) {
        User activeUser = resolveUser(principal, auth);
        if (activeUser == null) {
            return ResponseEntity.status(401).build();
        }
        ProduceBatch newBatch = batchService.createBatch(activeUser, payload);
        return ResponseEntity.ok(newBatch);
    }

    /**
     * GET /api/batches/{batchId}
     * Restricted regex mapping to prevent URL route collision with /marketplace
     */
    @GetMapping("/{batchId:UZH-.*}")
    public ResponseEntity<ProduceBatch> getBatch(@PathVariable String batchId) {
        ProduceBatch batch = batchService.getBatchByBatchId(batchId);
        if (batch == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(batch);
    }

    /**
     * DELETE /api/batches/{batchId}
     * Deletes a produce batch from MySQL after verifying JWT farmer ownership and status.
     */
    @DeleteMapping("/{batchId:UZH-.*}")
    public ResponseEntity<?> deleteBatch(
            @PathVariable String batchId,
            @AuthenticationPrincipal User principal,
            Authentication auth
    ) {
        User activeUser = resolveUser(principal, auth);
        if (activeUser == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }
        try {
            batchService.deleteBatch(activeUser, batchId);
            return ResponseEntity.ok(Map.of("success", true, "message", "Batch deleted successfully"));
        } catch (SecurityException e) {
            return ResponseEntity.status(403).body(Map.of("error", e.getMessage()));
        } catch (IllegalStateException | IllegalArgumentException e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Failed to delete batch: " + e.getMessage()));
        }
    }
}
