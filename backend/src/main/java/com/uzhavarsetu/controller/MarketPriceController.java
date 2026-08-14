package com.uzhavarsetu.controller;

import com.uzhavarsetu.dto.MandiPriceRecordDTO;
import com.uzhavarsetu.dto.MandiPriceResponseDTO;
import com.uzhavarsetu.entity.FarmerProfile;
import com.uzhavarsetu.entity.User;
import com.uzhavarsetu.repository.FarmerProfileRepository;
import com.uzhavarsetu.service.MandiPriceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
public class MarketPriceController {

    @Autowired
    private MandiPriceService mandiPriceService;

    @Autowired
    private FarmerProfileRepository farmerProfileRepository;

    private User resolveUser(User principal, Authentication auth) {
        if (principal != null && principal.getId() != null) {
            return principal;
        }
        if (auth != null && auth.getPrincipal() instanceof User u && u.getId() != null) {
            return u;
        }
        return null;
    }

    /**
     * GET /api/market/prices
     * GET /api/market-prices
     * Returns live Government of India daily mandi prices from data.gov.in
     */
    @GetMapping({"/api/market/prices", "/api/market-prices"})
    public ResponseEntity<MandiPriceResponseDTO> getMandiPrices(
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String district,
            @RequestParam(required = false) String market,
            @RequestParam(required = false, name = "commodity") String commodityParam,
            @RequestParam(required = false, name = "crop") String cropParam,
            @RequestParam(required = false, defaultValue = "50") Integer limit,
            @AuthenticationPrincipal User principal,
            Authentication auth
    ) {
        User activeUser = resolveUser(principal, auth);
        FarmerProfile profile = (activeUser != null) ? farmerProfileRepository.findByUser(activeUser).orElse(null) : null;

        String reqState = state;
        String reqDistrict = district;
        String reqCommodity = commodityParam != null ? commodityParam : cropParam;

        // Auto-populate from authenticated farmer profile if parameters are missing
        if ((reqState == null || reqState.trim().isEmpty()) && profile != null && profile.getState() != null) {
            reqState = profile.getState();
        }
        if ((reqDistrict == null || reqDistrict.trim().isEmpty()) && profile != null && profile.getDistrict() != null) {
            reqDistrict = profile.getDistrict();
        }
        if ((reqCommodity == null || reqCommodity.trim().isEmpty()) && profile != null && profile.getPrimaryCrops() != null && !profile.getPrimaryCrops().trim().isEmpty()) {
            reqCommodity = profile.getPrimaryCrops().split(",")[0].trim();
        }

        MandiPriceResponseDTO response = mandiPriceService.fetchMandiPrices(reqState, reqDistrict, market, reqCommodity, limit);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/market/prices/{crop}
     * GET /api/price/{crop}
     * Returns mandi price breakdown for a specific crop/commodity
     */
    @GetMapping({"/api/market/prices/{crop}", "/api/price/{crop}"})
    public ResponseEntity<Map<String, Object>> getPriceByCrop(
            @PathVariable String crop,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String district,
            @RequestParam(required = false) String location,
            @AuthenticationPrincipal User principal,
            Authentication auth
    ) {
        User activeUser = resolveUser(principal, auth);
        FarmerProfile profile = (activeUser != null) ? farmerProfileRepository.findByUser(activeUser).orElse(null) : null;

        String reqState = state != null ? state : (profile != null ? profile.getState() : "Tamil Nadu");
        String reqDistrict = district != null ? district : (location != null ? location : (profile != null ? profile.getDistrict() : "Coimbatore"));

        MandiPriceResponseDTO mandiRes = mandiPriceService.fetchMandiPrices(reqState, reqDistrict, null, crop, 10);

        Map<String, Object> map = new HashMap<>();
        map.put("crop", crop);
        map.put("commodity", crop);

        if (mandiRes.isAvailable() && mandiRes.getRecords() != null && !mandiRes.getRecords().isEmpty()) {
            MandiPriceRecordDTO rec = mandiRes.getRecords().get(0);
            map.put("currentPrice", rec.getModalPricePerKg());
            map.put("marketPrice", rec.getModalPricePerKg());
            map.put("modalPricePerKg", rec.getModalPricePerKg());
            map.put("minPricePerKg", rec.getMinPricePerKg());
            map.put("maxPricePerKg", rec.getMaxPricePerKg());

            map.put("modalPricePerQuintal", rec.getModalPricePerQuintal());
            map.put("minPricePerQuintal", rec.getMinPricePerQuintal());
            map.put("maxPricePerQuintal", rec.getMaxPricePerQuintal());

            map.put("mandi", rec.getMarket());
            map.put("district", rec.getDistrict());
            map.put("state", rec.getState());
            map.put("variety", rec.getVariety());
            map.put("grade", rec.getGrade());
            map.put("arrivalDate", rec.getArrivalDate());
            map.put("source", rec.getSource());
            map.put("isLive", rec.isLive());
            map.put("available", true);
        } else {
            map.put("available", false);
            map.put("message", mandiRes.getMessage() != null ? mandiRes.getMessage() : "No current mandi price found for " + crop + " in " + reqDistrict);
            map.put("source", "Government of India — data.gov.in");
            map.put("isLive", false);
        }

        map.put("unit", "kg");
        return ResponseEntity.ok(map);
    }

    /**
     * GET /api/market-prices/{crop}/trend
     */
    @GetMapping("/api/market-prices/{crop}/trend")
    public ResponseEntity<List<Map<String, Object>>> getPriceTrend(
            @PathVariable String crop,
            @RequestParam(required = false) String location
    ) {
        // Return 7-day trend placeholder structure if needed by charts
        List<Map<String, Object>> history = List.of(
                Map.of("day", "Mon", "price", 38.0),
                Map.of("day", "Tue", "price", 39.0),
                Map.of("day", "Wed", "price", 40.0),
                Map.of("day", "Thu", "price", 41.0),
                Map.of("day", "Fri", "price", 42.0)
        );
        return ResponseEntity.ok(history);
    }

    /**
     * GET /api/market-prices/{crop}/benchmark
     */
    @GetMapping("/api/market-prices/{crop}/benchmark")
    public ResponseEntity<Map<String, Object>> getBenchmarks(
            @PathVariable String crop,
            @RequestParam(required = false) String location,
            @AuthenticationPrincipal User principal,
            Authentication auth
    ) {
        User activeUser = resolveUser(principal, auth);
        FarmerProfile profile = (activeUser != null) ? farmerProfileRepository.findByUser(activeUser).orElse(null) : null;
        String dist = location != null ? location : (profile != null ? profile.getDistrict() : "Coimbatore");

        MandiPriceResponseDTO mandiRes = mandiPriceService.fetchMandiPrices("Tamil Nadu", dist, null, crop, 5);

        Map<String, Object> map = new HashMap<>();
        if (mandiRes.isAvailable() && mandiRes.getRecords() != null && !mandiRes.getRecords().isEmpty()) {
            MandiPriceRecordDTO rec = mandiRes.getRecords().get(0);
            map.put("govtMandi", rec.getModalPricePerKg());
            map.put("govtMandiQuintal", rec.getModalPricePerQuintal());
            map.put("localMarket", rec.getMaxPricePerKg());
            map.put("buyerAverage", rec.getMinPricePerKg());
            map.put("source", "Government of India — data.gov.in");
            map.put("arrivalDate", rec.getArrivalDate());
        } else {
            map.put("available", false);
            map.put("source", "Government of India — data.gov.in");
        }
        return ResponseEntity.ok(map);
    }
}
