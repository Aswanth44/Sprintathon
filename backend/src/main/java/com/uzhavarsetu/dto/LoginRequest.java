package com.uzhavarsetu.dto;

public class LoginRequest {

    private String identifier;
    private String email;
    private String mobile;
    private String password;


    public LoginRequest() {
    }

    public String resolveIdentifier() {
        if (identifier != null && !identifier.trim().isEmpty()) {
            return identifier.trim();
        }
        if (email != null && !email.trim().isEmpty()) {
            return email.trim();
        }
        if (mobile != null && !mobile.trim().isEmpty()) {
            return mobile.trim();
        }
        return "";
    }

    public String getIdentifier() {
        return identifier;
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}