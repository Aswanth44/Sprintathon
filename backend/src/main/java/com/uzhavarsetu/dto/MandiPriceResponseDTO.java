package com.uzhavarsetu.dto;

import java.util.List;

public class MandiPriceResponseDTO {

    private boolean available;
    private String message;
    private int totalRecords;
    private String source = "Government of India — data.gov.in";
    private List<MandiPriceRecordDTO> records;

    public MandiPriceResponseDTO() {
    }

    public MandiPriceResponseDTO(boolean available, String message, List<MandiPriceRecordDTO> records) {
        this.available = available;
        this.message = message;
        this.records = records != null ? records : List.of();
        this.totalRecords = this.records.size();
    }

    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public int getTotalRecords() {
        return totalRecords;
    }

    public void setTotalRecords(int totalRecords) {
        this.totalRecords = totalRecords;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public List<MandiPriceRecordDTO> getRecords() {
        return records;
    }

    public void setRecords(List<MandiPriceRecordDTO> records) {
        this.records = records;
        this.totalRecords = records != null ? records.size() : 0;
    }
}
