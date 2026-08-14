    package com.uzhavarsetu.dto;

    import jakarta.validation.constraints.*;

    public class FarmerRegistrationRequest {

        @NotBlank(message = "Full name is required")
        @Size(min = 2, max = 100)
        private String fullName;

        @NotBlank(message = "Mobile number is required")
        @Pattern(
                regexp = "^[6-9][0-9]{9}$",
                message = "Enter a valid 10-digit mobile number"
        )
        private String mobile;

        @NotBlank(message = "Email is required")
        @Email(message = "Enter a valid email")
        private String email;

        @NotBlank(message = "Village is required")
        @Size(min = 2, max = 100)
        private String village;

        @NotBlank(message = "District is required")
        private String district;

        @NotBlank(message = "State is required")
        private String state;

        @NotNull(message = "Farm size is required")
        @Positive(message = "Farm size must be greater than zero")
        private Double farmSize;

        public String getFullName() {
            return fullName;
        }

        public void setFullName(String fullName) {
            this.fullName = fullName;
        }

        public String getMobile() {
            return mobile;
        }

        public void setMobile(String mobile) {
            this.mobile = mobile;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getVillage() {
            return village;
        }

        public void setVillage(String village) {
            this.village = village;
        }

        public String getDistrict() {
            return district;
        }

        public void setDistrict(String district) {
            this.district = district;
        }

        public String getState() {
            return state;
        }

        public void setState(String state) {
            this.state = state;
        }

        public Double getFarmSize() {
            return farmSize;
        }

        public void setFarmSize(Double farmSize) {
            this.farmSize = farmSize;
        }
    }