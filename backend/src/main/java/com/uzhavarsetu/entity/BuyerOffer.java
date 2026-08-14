package com.uzhavarsetu.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "buyer_offers")
public class BuyerOffer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "offer_id", unique = true, nullable = false)
    private String offerId;

    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"user", "hibernateLazyInitializer", "handler"})
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "batch_id", nullable = false)
    private ProduceBatch batch;

    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"password", "temporaryPassword", "hibernateLazyInitializer", "handler"})
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "buyer_id", nullable = false)
    private User buyer;

    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"password", "temporaryPassword", "hibernateLazyInitializer", "handler"})
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "farmer_id", nullable = false)
    private User farmer;

    private String crop;
    private Double quantity;
    private String unit = "kg";

    @Column(name = "buyer_name")
    private String buyerName;

    @Column(name = "buyer_location")
    private String buyerLocation;

    @Column(name = "buyer_type")
    private String buyerType;

    @Column(name = "farmer_name")
    private String farmerName;

    @Column(name = "farmer_location")
    private String farmerLocation;

    @Column(name = "market_price")
    private Double marketPrice;

    @Column(name = "offered_price")
    private Double offeredPrice;

    @Column(name = "transport_cost")
    private Double transportCost;

    @Column(name = "net_payout")
    private Double netPayout;

    @Column(name = "counter_price")
    private Double counterPrice;

    @Column(nullable = false)
    private String status = "PENDING";


    @Column(name = "status_label")
    private String statusLabel = "Pending Review";

    private String assessment = "✓ FAIR OFFER";

    @Column(name = "expected_delivery")
    private String expectedDelivery;

    @Column(name = "buyer_message", length = 1000)
    private String buyerMessage;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public BuyerOffer() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOfferId() {
        return offerId;
    }

    public void setOfferId(String offerId) {
        this.offerId = offerId;
    }

    public ProduceBatch getBatch() {
        return batch;
    }

    public void setBatch(ProduceBatch batch) {
        this.batch = batch;
    }

    public User getBuyer() {
        return buyer;
    }

    public void setBuyer(User buyer) {
        this.buyer = buyer;
    }

    public User getFarmer() {
        return farmer;
    }

    public void setFarmer(User farmer) {
        this.farmer = farmer;
    }

    public String getCrop() {
        return crop;
    }

    public void setCrop(String crop) {
        this.crop = crop;
    }

    public Double getQuantity() {
        return quantity;
    }

    public void setQuantity(Double quantity) {
        this.quantity = quantity;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public String getBuyerName() {
        return buyerName;
    }

    public void setBuyerName(String buyerName) {
        this.buyerName = buyerName;
    }

    public String getBuyerLocation() {
        return buyerLocation;
    }

    public void setBuyerLocation(String buyerLocation) {
        this.buyerLocation = buyerLocation;
    }

    public String getBuyerType() {
        return buyerType;
    }

    public void setBuyerType(String buyerType) {
        this.buyerType = buyerType;
    }

    public String getFarmerName() {
        return farmerName;
    }

    public void setFarmerName(String farmerName) {
        this.farmerName = farmerName;
    }

    public String getFarmerLocation() {
        return farmerLocation;
    }

    public void setFarmerLocation(String farmerLocation) {
        this.farmerLocation = farmerLocation;
    }

    public Double getMarketPrice() {
        return marketPrice;
    }

    public void setMarketPrice(Double marketPrice) {
        this.marketPrice = marketPrice;
    }

    public Double getOfferedPrice() {
        return offeredPrice;
    }

    public void setOfferedPrice(Double offeredPrice) {
        this.offeredPrice = offeredPrice;
    }

    public Double getTransportCost() {
        return transportCost;
    }

    public void setTransportCost(Double transportCost) {
        this.transportCost = transportCost;
    }

    public Double getNetPayout() {
        return netPayout;
    }

    public void setNetPayout(Double netPayout) {
        this.netPayout = netPayout;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getStatusLabel() {
        return statusLabel;
    }

    public void setStatusLabel(String statusLabel) {
        this.statusLabel = statusLabel;
    }

    public String getAssessment() {
        return assessment;
    }

    public void setAssessment(String assessment) {
        this.assessment = assessment;
    }

    public String getExpectedDelivery() {
        return expectedDelivery;
    }

    public void setExpectedDelivery(String expectedDelivery) {
        this.expectedDelivery = expectedDelivery;
    }

    public String getBuyerMessage() {
        return buyerMessage;
    }

    public void setBuyerMessage(String buyerMessage) {
        this.buyerMessage = buyerMessage;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Double getCounterPrice() {
        return counterPrice;
    }

    public void setCounterPrice(Double counterPrice) {
        this.counterPrice = counterPrice;
    }
}

