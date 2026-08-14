package com.uzhavarsetu.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "produce_batches")
public class ProduceBatch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "batch_id", unique = true, nullable = false)
    private String batchId;

    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"password", "temporaryPassword", "hibernateLazyInitializer", "handler"})
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String crop;

    @Column(nullable = false)
    private Double quantity;

    @Column(nullable = false)
    private String unit = "kg";

    @Column(nullable = false)
    private String quality = "Grade A";

    @Column(name = "expected_price")
    private Double expectedPrice;

    @Column(name = "market_price")
    private Double marketPrice;

    @Column(name = "farm_location")
    private String farmLocation;

    private String village;
    private String district;
    private String state;

    @Column(nullable = false)
    private String status = "CREATED";

    @Column(name = "current_stage")
    private String currentStage = "FARM";

    @Column(name = "current_stage_index")
    private Integer currentStageIndex = 0;

    @Column(name = "harvest_date")
    private String harvestDate;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public ProduceBatch() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBatchId() {
        return batchId;
    }

    public void setBatchId(String batchId) {
        this.batchId = batchId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
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

    public String getQuality() {
        return quality;
    }

    public void setQuality(String quality) {
        this.quality = quality;
    }

    public Double getExpectedPrice() {
        return expectedPrice;
    }

    public void setExpectedPrice(Double expectedPrice) {
        this.expectedPrice = expectedPrice;
    }

    public Double getMarketPrice() {
        return marketPrice;
    }

    public void setMarketPrice(Double marketPrice) {
        this.marketPrice = marketPrice;
    }

    public String getFarmLocation() {
        return farmLocation;
    }

    public void setFarmLocation(String farmLocation) {
        this.farmLocation = farmLocation;
    }

    public String getVillage() {
        return village;
    }

    public void setVillage(String village) {
        this.village = village;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getCurrentStage() {
        return currentStage;
    }

    public void setCurrentStage(String currentStage) {
        this.currentStage = currentStage;
    }

    public Integer getCurrentStageIndex() {
        return currentStageIndex;
    }

    public void setCurrentStageIndex(Integer currentStageIndex) {
        this.currentStageIndex = currentStageIndex;
    }

    public String getHarvestDate() {
        return harvestDate;
    }

    public void setHarvestDate(String harvestDate) {
        this.harvestDate = harvestDate;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
