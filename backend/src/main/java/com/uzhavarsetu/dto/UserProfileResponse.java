package com.uzhavarsetu.dto;

public class UserProfileResponse {

    private Long id;
    private String name;
    private String email;
    private String mobile;
    private String role;
    private String accountStatus;

    // Unique Persistent IDs
    private String farmerId;
    private String buyerId;

    // Buyer specific
    private String businessName;
    private String buyerType;
    private String businessLocation;
    private String gstNumber;

    // Farmer location & identity
    private String village;
    private String district;
    private String state;
    private Double farmSize;
    private String registrationDate;
    private String verificationStatus;

    // Farmer extended farm details
    private String primaryCrops;
    private String otherCrops;
    private String farmingType;
    private String experience;
    private String farmLocation;

    // Farmer activity statistics (computed from real DB records)
    private long totalBatchesCreated;
    private long activeBatches;
    private long completedTransactions;
    private double produceSold;

    public UserProfileResponse() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getAccountStatus() {
        return accountStatus;
    }

    public void setAccountStatus(String accountStatus) {
        this.accountStatus = accountStatus;
    }

    public String getFarmerId() {
        return farmerId;
    }

    public void setFarmerId(String farmerId) {
        this.farmerId = farmerId;
    }

    public String getBuyerId() {
        return buyerId;
    }

    public void setBuyerId(String buyerId) {
        this.buyerId = buyerId;
    }

    public String getBusinessName() {
        return businessName;
    }

    public void setBusinessName(String businessName) {
        this.businessName = businessName;
    }

    public String getBuyerType() {
        return buyerType;
    }

    public void setBuyerType(String buyerType) {
        this.buyerType = buyerType;
    }

    public String getBusinessLocation() {
        return businessLocation;
    }

    public void setBusinessLocation(String businessLocation) {
        this.businessLocation = businessLocation;
    }

    public String getGstNumber() {
        return gstNumber;
    }

    public void setGstNumber(String gstNumber) {
        this.gstNumber = gstNumber;
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

    public String getRegistrationDate() {
        return registrationDate;
    }

    public void setRegistrationDate(String registrationDate) {
        this.registrationDate = registrationDate;
    }

    public String getVerificationStatus() {
        return verificationStatus;
    }

    public void setVerificationStatus(String verificationStatus) {
        this.verificationStatus = verificationStatus;
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

    public long getTotalBatchesCreated() {
        return totalBatchesCreated;
    }

    public void setTotalBatchesCreated(long totalBatchesCreated) {
        this.totalBatchesCreated = totalBatchesCreated;
    }

    public long getActiveBatches() {
        return activeBatches;
    }

    public void setActiveBatches(long activeBatches) {
        this.activeBatches = activeBatches;
    }

    public long getCompletedTransactions() {
        return completedTransactions;
    }

    public void setCompletedTransactions(long completedTransactions) {
        this.completedTransactions = completedTransactions;
    }

    public double getProduceSold() {
        return produceSold;
    }

    public void setProduceSold(double produceSold) {
        this.produceSold = produceSold;
    }
}
