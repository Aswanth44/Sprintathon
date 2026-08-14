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

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Random;

@Service
public class BuyerOfferService {

    @Autowired
    private BuyerOfferRepository offerRepository;

    @Autowired
    private ProduceBatchRepository batchRepository;

    @Autowired
    private FarmerProfileRepository farmerProfileRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    public List<BuyerOffer> getOffersForFarmer(User farmer) {
        if (farmer == null || farmer.getId() == null) return Collections.emptyList();
        return offerRepository.findByFarmerId(farmer.getId());
    }

    public List<BuyerOffer> getOffersForBuyer(User buyer) {
        if (buyer == null || buyer.getId() == null) return Collections.emptyList();
        return offerRepository.findByBuyerId(buyer.getId());
    }

    public List<BuyerOffer> getAllOffers() {
        return offerRepository.findAll();
    }

    public BuyerOffer createOffer(User buyer, Map<String, Object> payload) {
        User managedBuyer = (buyer != null && buyer.getId() != null) ? userRepository.findById(buyer.getId()).orElse(buyer) : buyer;

        String batchIdStr = (String) payload.get("batchId");
        ProduceBatch batch = batchRepository.findByBatchId(batchIdStr)
                .orElseThrow(() -> new IllegalArgumentException("Produce batch not found for ID: " + batchIdStr));


        User farmer = batch.getUser();

        BuyerOffer offer = new BuyerOffer();
        offer.setBatch(batch);
        offer.setBuyer(managedBuyer);
        offer.setFarmer(farmer);

        offer.setCrop(batch.getCrop());
        offer.setQuantity(batch.getQuantity());
        offer.setUnit(batch.getUnit());

        // Fill authentic buyer details
        offer.setBuyerName(managedBuyer.getBusinessName() != null ? managedBuyer.getBusinessName() : managedBuyer.getName());
        offer.setBuyerLocation(managedBuyer.getBusinessLocation() != null ? managedBuyer.getBusinessLocation() : "Coimbatore Market");
        offer.setBuyerType(managedBuyer.getBuyerType() != null ? managedBuyer.getBuyerType() : "Procurement");

        // Fill authentic farmer details
        FarmerProfile fProfile = farmerProfileRepository.findByUser(farmer).orElse(null);
        offer.setFarmerName(farmer.getName());
        offer.setFarmerLocation(fProfile != null ? fProfile.getVillage() + ", " + fProfile.getDistrict() : "Tamil Nadu");

        Object offeredPriceObj = payload.get("offeredPrice");
        Double offeredPrice = 44.0;
        if (offeredPriceObj instanceof Number) {
            offeredPrice = ((Number) offeredPriceObj).doubleValue();
        }
        offer.setOfferedPrice(offeredPrice);

        Object transObj = payload.get("transportCost");
        Double transportCost = 2.0;
        if (transObj instanceof Number) {
            transportCost = ((Number) transObj).doubleValue();
        }
        offer.setTransportCost(transportCost);
        offer.setNetPayout(offeredPrice - transportCost);
        offer.setMarketPrice(batch.getMarketPrice() != null ? batch.getMarketPrice() : 42.0);

        offer.setStatus("PENDING");
        offer.setStatusLabel("Pending Review");

        int randNum = 1000 + new Random().nextInt(9000);
        offer.setOfferId("OFF-" + randNum);

        BuyerOffer savedOffer = offerRepository.save(offer);

        // Generate real notification for farmer
        try {
            if (farmer != null) {
                notificationService.createNotification(
                        farmer,
                        "New Buyer Offer Received",
                        String.format("%s submitted an offer of ₹%.0f/kg for %s (%s).", offer.getBuyerName(), offer.getOfferedPrice(), offer.getCrop(), batch.getBatchId()),
                        "OFFER_RECEIVED",
                        batch.getBatchId()
                );
            }
        } catch (Exception e) {
            System.err.println("Failed to create offer notification: " + e.getMessage());
        }

        return savedOffer;
    }

    public BuyerOffer counterOffer(User farmer, String offerId, Double counterPrice, Double quantity, String message) {
        BuyerOffer offer = offerRepository.findByOfferId(offerId)
                .orElseThrow(() -> new IllegalArgumentException("Offer not found: " + offerId));

        offer.setStatus("COUNTERED");
        double finalCounterPrice = counterPrice != null && counterPrice > 0 ? counterPrice : (offer.getOfferedPrice() != null ? offer.getOfferedPrice() : 44.0);
        offer.setStatusLabel(String.format("Counter Offered (₹%.0f/kg)", finalCounterPrice));
        offer.setCounterPrice(finalCounterPrice);
        offer.setOfferedPrice(finalCounterPrice);
        double transport = offer.getTransportCost() != null ? offer.getTransportCost() : 0.0;
        offer.setNetPayout(finalCounterPrice - transport);

        if (quantity != null && quantity > 0) {
            offer.setQuantity(quantity);
        }

        if (message != null && !message.trim().isEmpty()) {
            offer.setBuyerMessage(message.trim());
        }

        BuyerOffer updated = offerRepository.save(offer);

        try {
            if (offer.getBuyer() != null) {
                notificationService.createNotification(
                        offer.getBuyer(),
                        "Farmer Counter Offer Received",
                        String.format("Farmer %s submitted a counter offer of ₹%.0f/kg for %s (%s).",
                                offer.getFarmerName() != null ? offer.getFarmerName() : "Farmer",
                                updated.getOfferedPrice(), updated.getCrop(), updated.getBatch() != null ? updated.getBatch().getBatchId() : updated.getOfferId()),
                        "OFFER_COUNTER",
                        updated.getBatch() != null ? updated.getBatch().getBatchId() : null
                );
            }
        } catch (Exception e) {
            System.err.println("Failed to send counter offer notification: " + e.getMessage());
        }

        return updated;
    }

    public BuyerOffer updateOfferStatus(User farmer, String offerId, String status) {
        BuyerOffer offer = offerRepository.findByOfferId(offerId)
                .orElseThrow(() -> new IllegalArgumentException("Offer not found: " + offerId));

        if ("COUNTER".equalsIgnoreCase(status) || "COUNTERED".equalsIgnoreCase(status)) {
            return counterOffer(farmer, offerId, offer.getCounterPrice() != null ? offer.getCounterPrice() : offer.getOfferedPrice() + 2, offer.getQuantity(), offer.getBuyerMessage());
        }

        offer.setStatus(status);
        if ("ACCEPTED".equalsIgnoreCase(status)) {
            offer.setStatusLabel("Accepted");
            ProduceBatch batch = offer.getBatch();
            if (batch != null) {
                batch.setStatus("IN_TRANSIT");
                batch.setCurrentStage("TRANSPORT");
                batch.setCurrentStageIndex(3);
                batchRepository.save(batch);
            }
        } else if ("REJECTED".equalsIgnoreCase(status)) {
            offer.setStatusLabel("Rejected");
        }

        BuyerOffer updated = offerRepository.save(offer);

        try {
            // Notify Buyer
            if (offer.getBuyer() != null) {
                notificationService.createNotification(
                        offer.getBuyer(),
                        "Offer " + ("ACCEPTED".equalsIgnoreCase(status) ? "Accepted!" : "Rejected"),
                        String.format("Farmer %s %s your offer (%s) of ₹%.0f/kg for %s.",
                                offer.getFarmerName() != null ? offer.getFarmerName() : "Farmer",
                                status.toLowerCase(), offer.getOfferId(), offer.getOfferedPrice(), offer.getCrop()),
                        "OFFER_STATUS",
                        offer.getBatch() != null ? offer.getBatch().getBatchId() : null
                );
            }
        } catch (Exception e) {
            System.err.println("Failed to create offer status notification: " + e.getMessage());
        }

        return updated;
    }


    public List<Map<String, Object>> getPurchasesForBuyer(User buyer) {
        if (buyer == null || buyer.getId() == null) return Collections.emptyList();
        List<BuyerOffer> acceptedOffers = offerRepository.findByBuyerId(buyer.getId()).stream()
                .filter(o -> "ACCEPTED".equalsIgnoreCase(o.getStatus()))
                .toList();

        return acceptedOffers.stream().map(o -> {
            Map<String, Object> map = new java.util.HashMap<>();
            ProduceBatch b = o.getBatch();
            double qty = o.getQuantity() != null ? o.getQuantity() : (b != null ? b.getQuantity() : 500.0);
            double price = o.getOfferedPrice() != null ? o.getOfferedPrice() : 44.0;
            double transport = o.getTransportCost() != null ? o.getTransportCost() : 2.0;

            map.put("purchaseId", "UZH-PUR-" + o.getId());
            map.put("offerId", o.getOfferId());
            map.put("batchId", b != null ? b.getBatchId() : "UZH-BATCH");
            map.put("crop", o.getCrop());
            map.put("quantity", qty);
            map.put("unit", o.getUnit() != null ? o.getUnit() : "kg");
            map.put("grade", b != null && b.getQuality() != null ? b.getQuality() : "Grade A");
            map.put("farmerName", o.getFarmerName() != null ? o.getFarmerName() : "Farmer");
            map.put("farmerId", o.getFarmer() != null ? "UZH-FMR-" + o.getFarmer().getId() : "UZH-FMR");
            map.put("farmerLocation", o.getFarmerLocation() != null ? o.getFarmerLocation() : "Tamil Nadu");
            map.put("purchasePrice", price);
            map.put("transportCost", transport);
            map.put("totalAmount", qty * (price + transport));
            map.put("purchaseDate", o.getUpdatedAt() != null ? o.getUpdatedAt().toLocalDate().toString() : java.time.LocalDate.now().toString());
            map.put("status", "CONFIRMED");
            map.put("currentStage", b != null && b.getCurrentStage() != null ? b.getCurrentStage() : "TRANSPORT");
            map.put("expectedDelivery", o.getExpectedDelivery() != null ? o.getExpectedDelivery() : java.time.LocalDate.now().plusDays(3).toString());
            return map;
        }).toList();
    }

    public List<Map<String, Object>> getOrdersForBuyer(User buyer) {
        if (buyer == null || buyer.getId() == null) return Collections.emptyList();
        List<BuyerOffer> acceptedOffers = offerRepository.findByBuyerId(buyer.getId()).stream()
                .filter(o -> "ACCEPTED".equalsIgnoreCase(o.getStatus()))
                .toList();

        return acceptedOffers.stream().map(o -> {
            Map<String, Object> map = new java.util.HashMap<>();
            ProduceBatch b = o.getBatch();
            double qty = o.getQuantity() != null ? o.getQuantity() : (b != null ? b.getQuantity() : 500.0);

            map.put("orderId", "UZH-ORD-" + o.getId());
            map.put("purchaseId", "UZH-PUR-" + o.getId());
            map.put("batchId", b != null ? b.getBatchId() : "UZH-BATCH");
            map.put("crop", o.getCrop());
            map.put("quantity", qty);
            map.put("unit", o.getUnit() != null ? o.getUnit() : "kg");
            map.put("farmerName", o.getFarmerName() != null ? o.getFarmerName() : "Farmer");
            map.put("currentLocation", b != null && b.getFarmLocation() != null ? b.getFarmLocation() + " Logistics Hub" : "En Route");
            map.put("expectedDelivery", o.getExpectedDelivery() != null ? o.getExpectedDelivery() : java.time.LocalDate.now().plusDays(3).toString());
            map.put("status", b != null && b.getCurrentStage() != null ? b.getCurrentStage() : "TRANSPORT");
            map.put("currentStageIndex", b != null && b.getCurrentStageIndex() != null ? b.getCurrentStageIndex() : 3);

            List<Map<String, Object>> stages = List.of(
                    Map.of("key", "farm", "label", "Farm Harvest", "desc", "Harvested at Farm", "completed", true),
                    Map.of("key", "pickup", "label", "Pickup", "desc", "Agri-Logistics Picked Up", "completed", true),
                    Map.of("key", "warehouse", "label", "Warehouse", "desc", "Cold Storage Verified", "completed", true),
                    Map.of("key", "transport", "label", "Transport", "desc", "In Transit", "completed", true, "isCurrent", true),
                    Map.of("key", "buyer", "label", "Buyer Delivery", "desc", "Direct Retail Delivery", "completed", false)
            );
            map.put("stages", stages);
            return map;
        }).toList();
    }

    public Map<String, Object> getBuyerDashboardSummary(User buyer) {
        Map<String, Object> summary = new java.util.HashMap<>();
        if (buyer == null || buyer.getId() == null) {
            summary.put("availableFarmerBatches", 0);
            summary.put("activeOffersCount", 0);
            summary.put("acceptedOffersCount", 0);
            summary.put("purchasesCount", 0);
            summary.put("ordersInTransitCount", 0);
            return summary;
        }

        long availableBatches = batchRepository.count();
        List<BuyerOffer> buyerOffers = offerRepository.findByBuyerId(buyer.getId());

        long activeOffers = buyerOffers.stream()
                .filter(o -> "PENDING".equalsIgnoreCase(o.getStatus()) || "COUNTERED".equalsIgnoreCase(o.getStatus()))
                .count();

        long acceptedOffers = buyerOffers.stream()
                .filter(o -> "ACCEPTED".equalsIgnoreCase(o.getStatus()))
                .count();

        summary.put("availableFarmerBatches", availableBatches);
        summary.put("activeOffersCount", activeOffers);
        summary.put("acceptedOffersCount", acceptedOffers);
        summary.put("purchasesCount", acceptedOffers);
        summary.put("ordersInTransitCount", acceptedOffers);

        return summary;
    }
}
