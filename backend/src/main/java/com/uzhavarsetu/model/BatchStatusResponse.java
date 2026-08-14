package com.uzhavarsetu.model;

/**
 * Response DTO for current batch supply-chain status.
 */
public class BatchStatusResponse {
    private String batchId;
    private String currentStage;
    private String latestEvent;
    private String lastUpdated;
    private int eventCount;

    public BatchStatusResponse() {}

    public BatchStatusResponse(String batchId, String currentStage, String latestEvent, String lastUpdated, int eventCount) {
        this.batchId = batchId;
        this.currentStage = currentStage;
        this.latestEvent = latestEvent;
        this.lastUpdated = lastUpdated;
        this.eventCount = eventCount;
    }

    public String getBatchId() { return batchId; }
    public void setBatchId(String batchId) { this.batchId = batchId; }

    public String getCurrentStage() { return currentStage; }
    public void setCurrentStage(String currentStage) { this.currentStage = currentStage; }

    public String getLatestEvent() { return latestEvent; }
    public void setLatestEvent(String latestEvent) { this.latestEvent = latestEvent; }

    public String getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(String lastUpdated) { this.lastUpdated = lastUpdated; }

    public int getEventCount() { return eventCount; }
    public void setEventCount(int eventCount) { this.eventCount = eventCount; }
}
