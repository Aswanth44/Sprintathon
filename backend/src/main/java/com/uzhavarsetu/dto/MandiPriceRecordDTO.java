package com.uzhavarsetu.dto;

public class MandiPriceRecordDTO {

    private String state;
    private String district;
    private String market;
    private String commodity;
    private String variety;
    private String grade;
    private String arrivalDate;

    // Original Mandi Price per Quintal (100 kg)
    private Double minPricePerQuintal;
    private Double maxPricePerQuintal;
    private Double modalPricePerQuintal;

    // Converted Price per Kg (Quintal / 100.0)
    private Double minPricePerKg;
    private Double maxPricePerKg;
    private Double modalPricePerKg;

    private String source = "Government of India — data.gov.in";
    private boolean isLive = true;

    public MandiPriceRecordDTO() {
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getMarket() {
        return market;
    }

    public void setMarket(String market) {
        this.market = market;
    }

    public String getCommodity() {
        return commodity;
    }

    public void setCommodity(String commodity) {
        this.commodity = commodity;
    }

    public String getVariety() {
        return variety;
    }

    public void setVariety(String variety) {
        this.variety = variety;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }

    public String getArrivalDate() {
        return arrivalDate;
    }

    public void setArrivalDate(String arrivalDate) {
        this.arrivalDate = arrivalDate;
    }

    public Double getMinPricePerQuintal() {
        return minPricePerQuintal;
    }

    public void setMinPricePerQuintal(Double minPricePerQuintal) {
        this.minPricePerQuintal = minPricePerQuintal;
        if (minPricePerQuintal != null) {
            this.minPricePerKg = Math.round((minPricePerQuintal / 100.0) * 100.0) / 100.0;
        }
    }

    public Double getMaxPricePerQuintal() {
        return maxPricePerQuintal;
    }

    public void setMaxPricePerQuintal(Double maxPricePerQuintal) {
        this.maxPricePerQuintal = maxPricePerQuintal;
        if (maxPricePerQuintal != null) {
            this.maxPricePerKg = Math.round((maxPricePerQuintal / 100.0) * 100.0) / 100.0;
        }
    }

    public Double getModalPricePerQuintal() {
        return modalPricePerQuintal;
    }

    public void setModalPricePerQuintal(Double modalPricePerQuintal) {
        this.modalPricePerQuintal = modalPricePerQuintal;
        if (modalPricePerQuintal != null) {
            this.modalPricePerKg = Math.round((modalPricePerQuintal / 100.0) * 100.0) / 100.0;
        }
    }

    public Double getMinPricePerKg() {
        return minPricePerKg;
    }

    public void setMinPricePerKg(Double minPricePerKg) {
        this.minPricePerKg = minPricePerKg;
    }

    public Double getMaxPricePerKg() {
        return maxPricePerKg;
    }

    public void setMaxPricePerKg(Double maxPricePerKg) {
        this.maxPricePerKg = maxPricePerKg;
    }

    public Double getModalPricePerKg() {
        return modalPricePerKg;
    }

    public void setModalPricePerKg(Double modalPricePerKg) {
        this.modalPricePerKg = modalPricePerKg;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public boolean isLive() {
        return isLive;
    }

    public void setLive(boolean live) {
        isLive = live;
    }
}
