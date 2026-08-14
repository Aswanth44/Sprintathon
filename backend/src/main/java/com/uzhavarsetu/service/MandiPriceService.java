package com.uzhavarsetu.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.uzhavarsetu.dto.MandiPriceRecordDTO;
import com.uzhavarsetu.dto.MandiPriceResponseDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class MandiPriceService {

    @Value("${mandi.api.url:https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070}")
    private String apiUrl;

    @Value("${mandi.api.key:}")
    private String apiKey;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    // In-memory cache with 15-minute expiration
    private static class CacheEntry {
        long timestamp;
        MandiPriceResponseDTO data;

        CacheEntry(MandiPriceResponseDTO data) {
            this.timestamp = System.currentTimeMillis();
            this.data = data;
        }

        boolean isExpired() {
            return (System.currentTimeMillis() - timestamp) > 15 * 60 * 1000;
        }
    }

    private final Map<String, CacheEntry> cache = new ConcurrentHashMap<>();

    public MandiPriceService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    public MandiPriceResponseDTO fetchMandiPrices(String state, String district, String market, String commodity, Integer limit) {
        int recordLimit = (limit != null && limit > 0) ? Math.min(limit, 100) : 50;

        String cacheKey = String.format("st=%s|dt=%s|mk=%s|cm=%s|lm=%d",
                state != null ? state.toLowerCase().trim() : "",
                district != null ? district.toLowerCase().trim() : "",
                market != null ? market.toLowerCase().trim() : "",
                commodity != null ? commodity.toLowerCase().trim() : "",
                recordLimit);

        CacheEntry cached = cache.get(cacheKey);
        if (cached != null && !cached.isExpired()) {
            return cached.data;
        }

        if (apiKey == null || apiKey.trim().isEmpty() || "YOUR_NEW_API_KEY".equals(apiKey.trim())) {
            return new MandiPriceResponseDTO(
                    false,
                    "Government Mandi API key is not configured (set MANDI_API_KEY environment variable)",
                    Collections.emptyList()
            );
        }

        // Attempt 1: Exact filter query
        List<MandiPriceRecordDTO> records = executeQuery(state, district, market, commodity, recordLimit);

        // Attempt 2: If no records found for specific district + commodity, try searching commodity across state
        if (records.isEmpty() && commodity != null && !commodity.trim().isEmpty() && district != null && !district.trim().isEmpty()) {
            records = executeQuery(state != null ? state : "Tamil Nadu", null, null, commodity, recordLimit);
        }

        // Attempt 3: If still empty, fetch general active mandi prices for the state
        if (records.isEmpty() && (commodity != null || district != null)) {
            records = executeQuery(state != null ? state : "Tamil Nadu", null, null, null, 20);
        }

        boolean available = !records.isEmpty();
        String message;

        if (available) {
            message = "Successfully retrieved daily mandi prices from data.gov.in";
        } else {
            message = String.format("No current daily mandi price reported for %s in %s on data.gov.in",
                    commodity != null ? commodity : "selected commodity",
                    district != null ? district : "selected region");
        }

        MandiPriceResponseDTO result = new MandiPriceResponseDTO(available, message, records);
        cache.put(cacheKey, new CacheEntry(result));
        return result;
    }

    private List<MandiPriceRecordDTO> executeQuery(String state, String district, String market, String commodity, int recordLimit) {
        try {
            UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(apiUrl)
                    .queryParam("api-key", apiKey.trim())
                    .queryParam("format", "json")
                    .queryParam("limit", recordLimit);

            if (state != null && !state.trim().isEmpty()) {
                builder.queryParam("filters[state]", state.trim());
            }
            if (district != null && !district.trim().isEmpty()) {
                builder.queryParam("filters[district]", district.trim());
            }
            if (market != null && !market.trim().isEmpty()) {
                builder.queryParam("filters[market]", market.trim());
            }
            if (commodity != null && !commodity.trim().isEmpty()) {
                builder.queryParam("filters[commodity]", commodity.trim());
            }

            URI targetUri = builder.build().encode().toUri();

            HttpHeaders headers = new HttpHeaders();
            headers.setAccept(List.of(MediaType.APPLICATION_JSON));
            headers.set("User-Agent", "UzhavarSetu-Backend/1.0");

            HttpEntity<Void> entity = new HttpEntity<>(headers);
            ResponseEntity<String> response = restTemplate.exchange(targetUri, HttpMethod.GET, entity, String.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                JsonNode root = objectMapper.readTree(response.getBody());
                JsonNode recordsNode = root.get("records");

                List<MandiPriceRecordDTO> list = new ArrayList<>();
                if (recordsNode != null && recordsNode.isArray()) {
                    for (JsonNode node : recordsNode) {
                        MandiPriceRecordDTO dto = mapNodeToDto(node);
                        if (dto != null) {
                            list.add(dto);
                        }
                    }
                }
                return list;
            }
        } catch (Exception e) {
            System.err.println("data.gov.in API query error: " + e.getMessage());
        }
        return Collections.emptyList();
    }

    private MandiPriceRecordDTO mapNodeToDto(JsonNode node) {
        if (node == null) return null;

        MandiPriceRecordDTO dto = new MandiPriceRecordDTO();
        dto.setState(getText(node, "state", null));
        dto.setDistrict(getText(node, "district", null));
        dto.setMarket(getText(node, "market", null));
        dto.setCommodity(getText(node, "commodity", null));
        dto.setVariety(getText(node, "variety", null));
        dto.setGrade(getText(node, "grade", null));
        dto.setArrivalDate(getText(node, "arrival_date", null));

        Double min = getDouble(node, "min_price");
        Double max = getDouble(node, "max_price");
        Double modal = getDouble(node, "modal_price");

        if (modal == null && min != null && max != null) {
            modal = (min + max) / 2.0;
        }

        dto.setMinPricePerQuintal(min);
        dto.setMaxPricePerQuintal(max);
        dto.setModalPricePerQuintal(modal);

        return dto;
    }

    private String getText(JsonNode node, String fieldName, String defaultValue) {
        JsonNode f = node.get(fieldName);
        return (f != null && !f.isNull()) ? f.asText().trim() : defaultValue;
    }

    private Double getDouble(JsonNode node, String fieldName) {
        JsonNode f = node.get(fieldName);
        if (f != null && !f.isNull()) {
            try {
                return f.asDouble();
            } catch (Exception e) {
                try {
                    return Double.parseDouble(f.asText().trim());
                } catch (Exception ignored) {
                }
            }
        }
        return null;
    }
}
