package com.uzhavarsetu.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "farmer_profiles")
public class FarmerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "user_id",
            nullable = false,
            unique = true
    )
    private User user;

    @Column(nullable = false)
    private String mobile;

    @Column(nullable = false)
    private String village;

    @Column(nullable = false)
    private String district;

    @Column(nullable = false)
    private String state;

    @Column(nullable = false)
    private Double farmSize;

    // =====================================================
    // EXTENDED FARM DETAILS (nullable — editable after registration)
    // =====================================================

    @Column(name = "primary_crops", length = 500)
    private String primaryCrops;

    @Column(name = "other_crops", length = 500)
    private String otherCrops;

    @Column(name = "farming_type")
    private String farmingType;

    @Column(name = "experience")
    private String experience;

    @Column(name = "farm_location")
    private String farmLocation;

    // =====================================================
    // GETTERS AND SETTERS
    // =====================================================

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
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

    public Double getFarmSize() {
        return farmSize;
    }

    public void setFarmSize(Double farmSize) {
        this.farmSize = farmSize;
    }

    public String getPrimaryCrops() {
        return primaryCrops;
    }

    public void setPrimaryCrops(String primaryCrops) {
        this.primaryCrops = primaryCrops;
    }

    public String getOtherCrops() {
        return otherCrops;
    }

    public void setOtherCrops(String otherCrops) {
        this.otherCrops = otherCrops;
    }

    public String getFarmingType() {
        return farmingType;
    }

    public void setFarmingType(String farmingType) {
        this.farmingType = farmingType;
    }

    public String getExperience() {
        return experience;
    }

    public void setExperience(String experience) {
        this.experience = experience;
    }

    public String getFarmLocation() {
        return farmLocation;
    }

    public void setFarmLocation(String farmLocation) {
        this.farmLocation = farmLocation;
    }
}