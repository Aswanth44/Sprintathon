package com.uzhavarsetu.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "government_schemes")
public class GovernmentScheme {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "scheme_code", unique = true, nullable = false)
    private String schemeCode;

    @Column(name = "scheme_name", nullable = false)
    private String schemeName;

    @Column(name = "short_description", length = 1000)
    private String shortDescription;

    @Column(name = "full_description", columnDefinition = "TEXT")
    private String fullDescription;

    @Column(nullable = false)
    private String ministry;

    @Column(nullable = false)
    private String category;

    @Column(length = 1000)
    private String benefits;

    @Column(name = "eligibility_description", columnDefinition = "TEXT")
    private String eligibilityDescription;

    @Column(name = "official_url", nullable = false)
    private String officialUrl;

    @Column(name = "application_url")
    private String applicationUrl;

    @Column(name = "state_scope", nullable = false)
    private String stateScope = "ALL";

    @Column(name = "last_verified_at")
    private String lastVerifiedAt;

    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public GovernmentScheme() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSchemeCode() {
        return schemeCode;
    }

    public void setSchemeCode(String schemeCode) {
        this.schemeCode = schemeCode;
    }

    public String getSchemeName() {
        return schemeName;
    }

    public void setSchemeName(String schemeName) {
        this.schemeName = schemeName;
    }

    public String getShortDescription() {
        return shortDescription;
    }

    public void setShortDescription(String shortDescription) {
        this.shortDescription = shortDescription;
    }

    public String getFullDescription() {
        return fullDescription;
    }

    public void setFullDescription(String fullDescription) {
        this.fullDescription = fullDescription;
    }

    public String getMinistry() {
        return ministry;
    }

    public void setMinistry(String ministry) {
        this.ministry = ministry;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getBenefits() {
        return benefits;
    }

    public void setBenefits(String benefits) {
        this.benefits = benefits;
    }

    public String getEligibilityDescription() {
        return eligibilityDescription;
    }

    public void setEligibilityDescription(String eligibilityDescription) {
        this.eligibilityDescription = eligibilityDescription;
    }

    public String getOfficialUrl() {
        return officialUrl;
    }

    public void setOfficialUrl(String officialUrl) {
        this.officialUrl = officialUrl;
    }

    public String getApplicationUrl() {
        return applicationUrl;
    }

    public void setApplicationUrl(String applicationUrl) {
        this.applicationUrl = applicationUrl;
    }

    public String getStateScope() {
        return stateScope;
    }

    public void setStateScope(String stateScope) {
        this.stateScope = stateScope;
    }

    public String getLastVerifiedAt() {
        return lastVerifiedAt;
    }

    public void setLastVerifiedAt(String lastVerifiedAt) {
        this.lastVerifiedAt = lastVerifiedAt;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
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
}
