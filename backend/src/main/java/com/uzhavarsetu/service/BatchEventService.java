package com.uzhavarsetu.service;

import com.uzhavarsetu.model.BatchEvent;
import com.uzhavarsetu.model.BatchEventRequest;
import com.uzhavarsetu.model.BatchStatusResponse;
import com.uzhavarsetu.repository.InMemoryEventRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class BatchEventService {
    private final KafkaProducerService kafkaProducerService;
    private final InMemoryEventRepository repository;

    public BatchEventService(KafkaProducerService kafkaProducerService, InMemoryEventRepository repository) {
        this.kafkaProducerService = kafkaProducerService;
        this.repository = repository;
    }

    public BatchEvent createAndPublishEvent(String batchId, BatchEventRequest request) {
        if (batchId == null || batchId.trim().isEmpty()) {
            throw new IllegalArgumentException("batchId cannot be empty");
        }
        if (request == null || request.getEventType() == null || request.getEventType().trim().isEmpty()) {
            throw new IllegalArgumentException("eventType cannot be empty");
        }

        String eventId = "EVT-" + String.format("%06d", System.currentTimeMillis() % 1000000);
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);

        BatchEvent event = new BatchEvent(
                eventId,
                batchId,
                request.getEventType().toUpperCase(),
                timestamp,
                request.getActorId() != null ? request.getActorId() : "UZH-SYSTEM-001",
                request.getActorRole() != null ? request.getActorRole() : "SYSTEM",
                request.getLocation() != null ? request.getLocation() : "Coimbatore Region",
                request.getQuantity() != null ? request.getQuantity() : 500,
                request.getUnit() != null ? request.getUnit() : "kg",
                request.getMetadata() != null ? request.getMetadata() : new HashMap<>()
        );

        // Always save to repository in-memory for fallback responsiveness
        repository.saveEvent(event);

        // Publish event to Kafka
        kafkaProducerService.publishEvent(event);

        return event;
    }

    public List<BatchEvent> getBatchEvents(String batchId) {
        return repository.getEventsByBatchId(batchId);
    }

    public BatchStatusResponse getBatchStatus(String batchId) {
        List<BatchEvent> events = repository.getEventsByBatchId(batchId);
        if (events.isEmpty()) {
            return new BatchStatusResponse(batchId, "UNKNOWN", "NONE", LocalDateTime.now().toString(), 0);
        }

        BatchEvent latest = events.get(events.size() - 1);
        String eventType = latest.getEventType();
        String currentStage = mapEventToStage(eventType);

        return new BatchStatusResponse(
                batchId,
                currentStage,
                eventType,
                latest.getTimestamp(),
                events.size()
        );
    }

    public List<BatchEvent> runDemoSimulation(String batchId) {
        String targetId = batchId != null && !batchId.trim().isEmpty() ? batchId : "UZH-TOM-00128";

        String[][] demoSequence = {
                {"HARVESTED", "Farmer Aswanth Kumar", "FARMER", "Pollachi Farm, Coimbatore"},
                {"PICKUP_COMPLETED", "Logistics Driver R. Velumani", "TRANSPORTER", "Pollachi Agri Pickup Hub"},
                {"WAREHOUSE_RECEIVED", "Cold Storage Mgr S. Rajan", "WAREHOUSE", "Coimbatore Cold Storage #4"},
                {"QUALITY_VERIFIED", "Quality Inspector K. Priya", "INSPECTOR", "Coimbatore Quality Lab"},
                {"TRANSPORT_STARTED", "Inter-Mandi Fleet Lead", "TRANSPORTER", "NH47 Highway En Route"},
                {"BUYER_PURCHASED", "GreenFresh Procurement", "BUYER", "Coimbatore Central Market"},
                {"DELIVERED", "Retail Store Manager", "BUYER", "GreenFresh Coimbatore Retail Store"}
        };

        List<BatchEvent> createdEvents = new ArrayList<>();
        for (String[] seq : demoSequence) {
            BatchEventRequest req = new BatchEventRequest();
            req.setEventType(seq[0]);
            req.setActorId(seq[1]);
            req.setActorRole(seq[2]);
            req.setLocation(seq[3]);
            req.setQuantity(500);
            req.setUnit("kg");

            BatchEvent evt = createAndPublishEvent(targetId, req);
            createdEvents.add(evt);
        }

        return createdEvents;
    }

    private String mapEventToStage(String eventType) {
        if (eventType == null) return "UNKNOWN";
        switch (eventType.toUpperCase()) {
            case "HARVESTED":
                return "FARM HARVEST";
            case "PICKUP_COMPLETED":
                return "COLLECTION";
            case "WAREHOUSE_RECEIVED":
                return "WAREHOUSE";
            case "QUALITY_VERIFIED":
                return "QUALITY VERIFIED";
            case "TRANSPORT_STARTED":
                return "TRANSPORT";
            case "BUYER_PURCHASED":
                return "PURCHASED";
            case "DELIVERED":
                return "DELIVERED";
            default:
                return eventType;
        }
    }
}
