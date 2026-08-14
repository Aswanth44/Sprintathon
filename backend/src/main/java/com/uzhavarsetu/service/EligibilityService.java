package com.uzhavarsetu.service;

import com.uzhavarsetu.dto.SchemeRecommendationResponse;
import com.uzhavarsetu.entity.*;
import com.uzhavarsetu.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class EligibilityService {

    @Autowired
    private GovernmentSchemeRepository schemeRepository;

    @Autowired
    private SchemeEligibilityRuleRepository ruleRepository;

    @Autowired
    private FarmerProfileRepository farmerProfileRepository;

    @Autowired
    private FarmerSchemeMatchRepository matchRepository;

    @Autowired
    private ProduceBatchRepository batchRepository;

    public List<SchemeRecommendationResponse> getPersonalizedSchemesForFarmer(User farmer) {
        if (farmer == null || farmer.getId() == null) {
            return Collections.emptyList();
        }

        FarmerProfile profile = farmerProfileRepository.findByUser(farmer).orElse(null);
        List<ProduceBatch> batches = batchRepository.findByUserId(farmer.getId());

        List<GovernmentScheme> activeSchemes = schemeRepository.findByIsActiveTrue();
        List<SchemeRecommendationResponse> recommendations = new ArrayList<>();

        for (GovernmentScheme scheme : activeSchemes) {
            SchemeRecommendationResponse rec = evaluateSchemeForFarmer(farmer, profile, batches, scheme);
            recommendations.add(rec);

            // Persist/Update evaluation in DB
            try {
                FarmerSchemeMatch match = matchRepository.findByFarmerAndScheme(farmer, scheme)
                        .orElseGet(() -> {
                            FarmerSchemeMatch m = new FarmerSchemeMatch();
                            m.setFarmer(farmer);
                            m.setScheme(scheme);
                            return m;
                        });

                match.setStatus(rec.getStatus());
                match.setMatchScore(rec.getMatchScore());
                match.setMatchReason(String.join("\n", rec.getMatchReasons()));
                match.setMissingInformation(String.join("\n", rec.getMissingInformation()));
                match.setEvaluatedAt(LocalDateTime.now());
                matchRepository.save(match);
            } catch (Exception e) {
                System.err.println("Failed to persist scheme match for scheme " + scheme.getSchemeCode() + ": " + e.getMessage());
            }
        }

        // Sort recommendations: LIKELY_ELIGIBLE first, then POTENTIALLY_ELIGIBLE, then INSUFFICIENT_DATA
        recommendations.sort((a, b) -> Integer.compare(b.getMatchScore(), a.getMatchScore()));

        return recommendations;
    }

    public SchemeRecommendationResponse getSingleSchemeForFarmer(User farmer, Long schemeId) {
        GovernmentScheme scheme = schemeRepository.findById(schemeId)
                .orElseThrow(() -> new IllegalArgumentException("Government scheme not found for ID: " + schemeId));

        FarmerProfile profile = (farmer != null && farmer.getId() != null) ? farmerProfileRepository.findByUser(farmer).orElse(null) : null;
        List<ProduceBatch> batches = (farmer != null && farmer.getId() != null) ? batchRepository.findByUserId(farmer.getId()) : Collections.emptyList();

        return evaluateSchemeForFarmer(farmer, profile, batches, scheme);
    }

    public List<SchemeRecommendationResponse> getPublicSchemes() {
        return schemeRepository.findByIsActiveTrue().stream().map(scheme -> {
            SchemeRecommendationResponse dto = mapSchemeToDto(scheme);
            dto.setStatus("POTENTIALLY_ELIGIBLE");
            dto.setMatchScore(70);
            dto.setMatchReasons(List.of("✓ Active official government scheme", "✓ Open to agricultural farmers across eligible states"));
            dto.setMissingInformation(List.of("• Farmer login required for personalized profile eligibility matching"));
            return dto;
        }).collect(Collectors.toList());
    }

    private SchemeRecommendationResponse evaluateSchemeForFarmer(User farmer, FarmerProfile profile, List<ProduceBatch> batches, GovernmentScheme scheme) {
        SchemeRecommendationResponse dto = mapSchemeToDto(scheme);
        List<String> reasons = new ArrayList<>();
        List<String> missing = new ArrayList<>();

        String code = scheme.getSchemeCode() != null ? scheme.getSchemeCode().toUpperCase() : "";
        Double farmSize = profile != null ? profile.getFarmSize() : null;
        String state = profile != null ? profile.getState() : null;
        String district = profile != null ? profile.getDistrict() : null;
        String village = profile != null ? profile.getVillage() : null;
        String crops = profile != null && profile.getPrimaryCrops() != null ? profile.getPrimaryCrops() : "";
        
        if (crops.isEmpty() && batches != null && !batches.isEmpty()) {
            crops = batches.stream().map(ProduceBatch::getCrop).distinct().collect(Collectors.joining(", "));
        }

        switch (code) {
            case "PM-KISAN":
                if (farmSize != null && farmSize > 0) {
                    dto.setStatus("LIKELY_ELIGIBLE");
                    dto.setMatchScore(92);
                    reasons.add(String.format("✓ Cultivable landholding registered: %.1f acres", farmSize));
                    if (state != null) reasons.add(String.format("✓ Location registered: %s, %s", district != null ? district : "District", state));
                    reasons.add("✓ Registered farmer account with verified contact info");
                    missing.add("• Mandatory exclusion criteria check (e.g. institutional landholders, government pension over ₹10k/month, income tax filings)");
                    missing.add("• e-KYC and land seeding status on PM-KISAN portal");
                } else {
                    dto.setStatus("INSUFFICIENT_DATA");
                    dto.setMatchScore(40);
                    reasons.add("✓ Farmer account registered");
                    missing.add("• Cultivable landholding details (farm size in acres) required in profile");
                    missing.add("• Land ownership Chitta/Adangal documentation");
                }
                break;

            case "PMFBY":
                if (crops != null && !crops.isEmpty()) {
                    dto.setStatus("POTENTIALLY_ELIGIBLE");
                    dto.setMatchScore(80);
                    reasons.add(String.format("✓ Agricultural crop history: %s", crops));
                    if (district != null) reasons.add(String.format("✓ Registered area: %s, %s", district, state != null ? state : "India"));
                    missing.add(String.format("• Verification of official state notification for %s in %s for current season", crops, district != null ? district : "area"));
                    missing.add("• Final cut-off date & premium payment confirmation");
                } else {
                    dto.setStatus("POTENTIALLY_ELIGIBLE");
                    dto.setMatchScore(65);
                    if (state != null) reasons.add(String.format("✓ Agricultural region registered: %s", state));
                    missing.add("• Specific crop selection required in profile or batch creation");
                    missing.add("• Season & notified area confirmation by state agriculture department");
                }
                break;

            case "PM-KUSUM":
                if (farmSize != null && farmSize >= 0.25) {
                    dto.setStatus("POTENTIALLY_ELIGIBLE");
                    dto.setMatchScore(78);
                    reasons.add(String.format("✓ Agricultural land available for solar setup: %.1f acres", farmSize));
                    if (state != null) reasons.add(String.format("✓ Location: %s", state));
                    missing.add("• Existing irrigation pump details (HP rating & grid connection status)");
                    missing.add("• State Nodal Agency (SNA) solar pump quota availability");
                } else {
                    dto.setStatus("INSUFFICIENT_DATA");
                    dto.setMatchScore(45);
                    missing.add("• Agricultural land area information required");
                    missing.add("• Solar pump requirement and irrigation type details");
                }
                break;

            case "E-NAM":
                dto.setStatus("LIKELY_ELIGIBLE");
                dto.setMatchScore(90);
                if (crops != null && !crops.isEmpty()) {
                    reasons.add(String.format("✓ Registered agricultural produce available for trade: %s", crops));
                } else {
                    reasons.add("✓ Registered farmer eligible for digital commodity trade");
                }
                reasons.add("✓ Direct bank account transfer eligible");
                missing.add("• Local APMC Mandi enrolment & Gate Entry pass");
                break;

            case "TN-CM-SOLAR":
                if (state != null && state.equalsIgnoreCase("Tamil Nadu")) {
                    dto.setStatus("POTENTIALLY_ELIGIBLE");
                    dto.setMatchScore(85);
                    reasons.add(String.format("✓ Tamil Nadu state agricultural residence: %s, Tamil Nadu", district != null ? district : "District"));
                    if (farmSize != null && farmSize > 0) reasons.add(String.format("✓ Landholding: %.1f acres", farmSize));
                    missing.add("• Agricultural Engineering Department (AED) solar token allotment");
                    missing.add("• Chitta/Adangal land extract verification on TN AGISNET portal");
                } else if (state != null) {
                    dto.setStatus("NOT_ELIGIBLE_BASED_ON_AVAILABLE_DATA");
                    dto.setMatchScore(20);
                    missing.add(String.format("• Scheme is exclusive to Tamil Nadu state farmers (Your registered state: %s)", state));
                } else {
                    dto.setStatus("INSUFFICIENT_DATA");
                    dto.setMatchScore(35);
                    missing.add("• State information required (Tamil Nadu residency check)");
                }
                break;

            default:
                dto.setStatus("POTENTIALLY_ELIGIBLE");
                dto.setMatchScore(70);
                reasons.add("✓ Active official government scheme");
                missing.add("• Additional official state & ministry eligibility verification required");
                break;
        }

        dto.setMatchReasons(reasons);
        dto.setMissingInformation(missing);
        return dto;
    }

    private SchemeRecommendationResponse mapSchemeToDto(GovernmentScheme scheme) {
        SchemeRecommendationResponse dto = new SchemeRecommendationResponse();
        dto.setId(scheme.getId());
        dto.setSchemeCode(scheme.getSchemeCode());
        dto.setSchemeName(scheme.getSchemeName());
        dto.setShortDescription(scheme.getShortDescription());
        dto.setFullDescription(scheme.getFullDescription());
        dto.setMinistry(scheme.getMinistry());
        dto.setCategory(scheme.getCategory());
        dto.setBenefits(scheme.getBenefits());
        dto.setEligibilityDescription(scheme.getEligibilityDescription());
        dto.setOfficialUrl(scheme.getOfficialUrl());
        dto.setApplicationUrl(scheme.getApplicationUrl());
        dto.setStateScope(scheme.getStateScope());
        dto.setLastVerifiedAt(scheme.getLastVerifiedAt());
        return dto;
    }
}
