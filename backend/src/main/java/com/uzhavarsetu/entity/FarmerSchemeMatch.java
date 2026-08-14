package com.uzhavarsetu.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "farmer_scheme_matches")
public class FarmerSchemeMatch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farmer_id", nullable = false)
    private User farmer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "scheme_id", nullable = false)
    private GovernmentScheme scheme;

    @Column(nullable = false)
    private String status; // LIKELY_ELIGIBLE, POTENTIALLY_ELIGIBLE, NOT_ELIGIBLE_BASED_ON_AVAILABLE_DATA, INSUFFICIENT_DATA

    @Column(name = "match_score")
    private Integer matchScore;

    @Column(name = "match_reason", columnDefinition = "TEXT")
    private String matchReason;

    @Column(name = "missing_information", columnDefinition = "TEXT")
    private String missingInformation;

    @CreationTimestamp
    @Column(name = "evaluated_at")
    private LocalDateTime evaluatedAt;

    public FarmerSchemeMatch() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getFarmer() {
        return farmer;
    }

    public void setFarmer(User farmer) {
        this.farmer = farmer;
    }

    public GovernmentScheme getScheme() {
        return scheme;
    }

    public void setScheme(GovernmentScheme scheme) {
        this.scheme = scheme;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getMatchScore() {
        return matchScore;
    }

    public void setMatchScore(Integer matchScore) {
        this.matchScore = matchScore;
    }

    public String getMatchReason() {
        return matchReason;
    }

    public void setMatchReason(String matchReason) {
        this.matchReason = matchReason;
    }

    public String getMissingInformation() {
        return missingInformation;
    }

    public void setMissingInformation(String missingInformation) {
        this.missingInformation = missingInformation;
    }

    public LocalDateTime getEvaluatedAt() {
        return evaluatedAt;
    }

    public void setEvaluatedAt(LocalDateTime evaluatedAt) {
        this.evaluatedAt = evaluatedAt;
    }
}
