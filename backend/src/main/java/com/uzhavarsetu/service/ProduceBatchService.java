package com.uzhavarsetu.service;

import com.uzhavarsetu.entity.BuyerOffer;
import com.uzhavarsetu.entity.FarmerProfile;
import com.uzhavarsetu.entity.ProduceBatch;
import com.uzhavarsetu.entity.User;
import com.uzhavarsetu.repository.BuyerOfferRepository;
import com.uzhavarsetu.repository.FarmerProfileRepository;
import com.uzhavarsetu.repository.ProduceBatchRepository;
import com.uzhavarsetu.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Random;

@Service
public class ProduceBatchService {

    @Autowired
    private ProduceBatchRepository batchRepository;

    @Autowired
    private FarmerProfileRepository farmerProfileRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BuyerOfferRepository offerRepository;

    @Autowired
    private NotificationService notificationService;

    public List<ProduceBatch> getBatchesForFarmer(User farmer) {
        if (farmer == null || farmer.getId() == null) return Collections.emptyList();
        return batchRepository.findByUserId(farmer.getId());
    }

    public List<ProduceBatch> getAllBatches() {
        return batchRepository.findAll().stream()
                .filter(b -> !"COMPLETED".equalsIgnoreCase(b.getStatus())
                          && !"DELIVERED".equalsIgnoreCase(b.getStatus())
                          && !"SOLD".equalsIgnoreCase(b.getStatus())
                          && !"DELETED".equalsIgnoreCase(b.getStatus()))
                .toList();
    }


    public ProduceBatch getBatchByBatchId(String batchId) {
        return batchRepository.findByBatchId(batchId).orElse(null);
    }

    @Transactional
    public ProduceBatch createBatch(User farmer, Map<String, Object> payload) {
        User managedFarmer = (farmer != null && farmer.getId() != null) ? userRepository.findById(farmer.getId()).orElse(farmer) : farmer;

        ProduceBatch batch = new ProduceBatch();
        batch.setUser(managedFarmer);

        String crop = (String) payload.getOrDefault("crop", "Tomato");
        batch.setCrop(crop);

        Object qtyObj = payload.get("quantity");
        if (qtyObj instanceof Number) {
            batch.setQuantity(((Number) qtyObj).doubleValue());
        } else if (qtyObj instanceof String) {
            try {
                batch.setQuantity(Double.parseDouble((String) qtyObj));
            } catch (Exception e) {
                batch.setQuantity(500.0);
            }
        } else {
            batch.setQuantity(500.0);
        }

        batch.setUnit((String) payload.getOrDefault("unit", "kg"));
        String qualRaw = (String) payload.getOrDefault("quality", "Grade A");
        batch.setQuality(qualRaw.contains("Grade B") ? "Grade B" : qualRaw.contains("Grade C") ? "Grade C" : "Grade A");

        Object priceObj = payload.get("expectedPrice");
        if (priceObj instanceof Number) {
            batch.setExpectedPrice(((Number) priceObj).doubleValue());
        } else {
            batch.setExpectedPrice(42.0);
        }
        batch.setMarketPrice(batch.getExpectedPrice() > 2 ? batch.getExpectedPrice() - 2 : 40.0);

        FarmerProfile profile = farmerProfileRepository.findByUser(managedFarmer).orElse(null);
        String village = profile != null ? profile.getVillage() : (String) payload.getOrDefault("village", "Coimbatore");
        String district = profile != null ? profile.getDistrict() : (String) payload.getOrDefault("district", "Coimbatore");
        String state = profile != null ? profile.getState() : (String) payload.getOrDefault("state", "Tamil Nadu");

        batch.setVillage(village);
        batch.setDistrict(district);
        batch.setState(state);
        batch.setFarmLocation(village + ", " + district);

        batch.setStatus("CREATED");
        batch.setCurrentStage("FARM");
        batch.setCurrentStageIndex(0);
        batch.setHarvestDate((String) payload.getOrDefault("harvestDate", java.time.LocalDate.now().toString()));

        // Generate unique batch code e.g. UZH-TOM-00128
        String cropPrefix = crop.length() >= 3 ? crop.substring(0, 3).toUpperCase() : "AGR";
        int randNum = 10000 + new Random().nextInt(90000);
        String generatedBatchId = "UZH-" + cropPrefix + "-" + randNum;
        batch.setBatchId(generatedBatchId);

        ProduceBatch saved = batchRepository.saveAndFlush(batch);


        // Generate real notification for farmer
        try {
            notificationService.createNotification(
                    managedFarmer,
                    "Batch Created",
                    String.format("Batch %s (%s, %.0f %s) has been created successfully.", generatedBatchId, crop, saved.getQuantity(), saved.getUnit()),
                    "BATCH_CREATED",
                    generatedBatchId
            );
        } catch (Exception e) {
            System.err.println("Failed to create batch notification: " + e.getMessage());
        }

        return saved;
    }

    /**
     * DELETE BATCH WITH SECURITY & BUSINESS RULE VALIDATION
     */
    @Transactional
    public void deleteBatch(User farmer, String batchId) {
        if (farmer == null || farmer.getId() == null) {
            throw new IllegalArgumentException("User not authenticated.");
        }
        ProduceBatch batch = batchRepository.findByBatchId(batchId)
                .orElseThrow(() -> new IllegalArgumentException("Batch not found: " + batchId));

        // SECURITY CHECK: Verify ownership strictly against authenticated farmer ID
        if (batch.getUser() == null || !batch.getUser().getId().equals(farmer.getId())) {
            throw new SecurityException("Unauthorized: You do not own this batch.");
        }

        // BATCH STATUS SAFETY: Prevent deletion if batch is completed, delivered, sold, or in transit
        String status = batch.getStatus() != null ? batch.getStatus().toUpperCase() : "";
        if ("COMPLETED".equals(status) || "DELIVERED".equalsIgnoreCase(status) || "SOLD".equalsIgnoreCase(status) || "IN_TRANSIT".equalsIgnoreCase(status) || "WAREHOUSE_STORED".equalsIgnoreCase(status)) {
            throw new IllegalStateException("This batch cannot be deleted because it is already part of an active or completed transaction.");
        }

        // Check if there are accepted buyer offers on this batch
        List<BuyerOffer> offers = offerRepository.findByBatch(batch);
        boolean hasAcceptedOffer = offers.stream().anyMatch(o -> "ACCEPTED".equalsIgnoreCase(o.getStatus()));
        if (hasAcceptedOffer) {
            throw new IllegalStateException("This batch cannot be deleted because an offer for it has already been accepted.");
        }

        // Delete unaccepted offers associated with this batch first
        if (!offers.isEmpty()) {
            offerRepository.deleteAll(offers);
            offerRepository.flush();
        }

        // Delete batch from MySQL
        batchRepository.delete(batch);
        batchRepository.flush();
    }
}
