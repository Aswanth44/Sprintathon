package com.uzhavarsetu.dto;

import java.util.List;

public class SchemeRecommendationResponse {

    private Long id;
    private String schemeCode;
    private String schemeName;
    private String shortDescription;
    private String fullDescription;
    private String ministry;
    private String category;
    private String benefits;
    private String eligibilityDescription;
    private String officialUrl;
    private String applicationUrl;
    private String stateScope;
    private String lastVerifiedAt;

    private String status; // LIKELY_ELIGIBLE, POTENTIALLY_ELIGIBLE, NOT_ELIGIBLE_BASED_ON_AVAILABLE_DATA, INSUFFICIENT_DATA
    private Integer matchScore;
    private List<String> matchReasons;
    private List<String> missingInformation;

    public SchemeRecommendationResponse() {
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

    public List<String> getMatchReasons() {
        return matchReasons;
    }

    public void setMatchReasons(List<String> matchReasons) {
        this.matchReasons = matchReasons;
    }

    public List<String> getMissingInformation() {
        return missingInformation;
    }

    public void setMissingInformation(List<String> missingInformation) {
        this.missingInformation = missingInformation;
    }
}
