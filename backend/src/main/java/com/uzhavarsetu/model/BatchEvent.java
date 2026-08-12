package com.uzhavarsetu.model;

import java.util.Map;

/**
 * Data Model for UzhavarSetu Supply-Chain Batch Lifecycle Events.
 * 
 * KAFKA TOPIC: uzhavarsetu.batch.events
 */
public class BatchEvent {
    private String eventId;
    private String batchId;
    private String eventType;
    private String timestamp;
    private String actorId;
    private String actorRole;
    private String location;
    private Integer quantity;
    private String unit;
    private Map<String, Object> metadata;

    public BatchEvent() {}

    public BatchEvent(String eventId, String batchId, String eventType, String timestamp,
                      String actorId, String actorRole, String location,
                      Integer quantity, String unit, Map<String, Object> metadata) {
        this.eventId = eventId;
        this.batchId = batchId;
        this.eventType = eventType;
        this.timestamp = timestamp;
        this.actorId = actorId;
        this.actorRole = actorRole;
        this.location = location;
        this.quantity = quantity;
        this.unit = unit;
        this.metadata = metadata;
    }

    public String getEventId() { return eventId; }
    public void setEventId(String eventId) { this.eventId = eventId; }

    public String getBatchId() { return batchId; }
    public void setBatchId(String batchId) { this.batchId = batchId; }

    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }

    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }

    public String getActorId() { return actorId; }
    public void setActorId(String actorId) { this.actorId = actorId; }

    public String getActorRole() { return actorRole; }
    public void setActorRole(String actorRole) { this.actorRole = actorRole; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public Map<String, Object> getMetadata() { return metadata; }
    public void setMetadata(Map<String, Object> metadata) { this.metadata = metadata; }
}
