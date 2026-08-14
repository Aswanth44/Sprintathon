package com.uzhavarsetu.model;

import java.util.Map;

/**
 * DTO for incoming POST requests to publish supply chain events.
 */
public class BatchEventRequest {
    private String eventType;
    private String actorId;
    private String actorRole;
    private String location;
    private Integer quantity;
    private String unit;
    private Map<String, Object> metadata;

    public BatchEventRequest() {}

    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }

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
