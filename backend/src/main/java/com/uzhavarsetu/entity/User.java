package com.uzhavarsetu.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    // =====================================================
    // PRIMARY KEY
    // =====================================================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    // =====================================================
    // USER DETAILS
    // =====================================================

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;


    // =====================================================
    // LOGIN DETAILS
    // =====================================================

    /*
     * For farmers:
     *
     * username = email
     *
     * Farmer does NOT manually create a username.
     */

    @Column(unique = true)
    private String username;

    /*
     * Password is NULL while farmer account is PENDING.
     *
     * After admin approves:
     *
     * temporary password is generated
     * password is BCrypt encoded
     */

    @Column
    private String password;


    // =====================================================
    // ROLE
    // =====================================================

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;


    // =====================================================
    // ACCOUNT STATUS
    // =====================================================

    @Enumerated(EnumType.STRING)
    @Column(name = "account_status", nullable = false)
    private AccountStatus accountStatus;


    // =====================================================
    // TEMPORARY PASSWORD FLAG
    // =====================================================

    /*
     * true  -> Farmer must change temporary password
     * false -> Farmer already changed password
     */

    @Column(name = "temporary_password", nullable = false)
    private boolean temporaryPassword;


    // =====================================================
    // BUYER-SPECIFIC FIELDS
    // =====================================================

    @Column(name = "business_name")
    private String businessName;

    @Column(name = "business_location")
    private String businessLocation;

    @Column(name = "buyer_type")
    private String buyerType;

    @Column(name = "mobile")
    private String mobile;

    @Column(name = "gst_number", unique = true)
    private String gstNumber;


    // =====================================================
    // REGISTRATION DATE
    // =====================================================

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;


    // =====================================================
    // ENUM: ROLE
    // =====================================================

    public enum Role {

        BUYER,
        FARMER,
        ADMIN
    }


    // =====================================================
    // ENUM: ACCOUNT STATUS
    // =====================================================

    public enum AccountStatus {

        PENDING,
        ACTIVE,
        REJECTED,
        BLOCKED
    }


    // =====================================================
    // CONSTRUCTORS
    // =====================================================

    public User() {
    }


    // =====================================================
    // GETTERS AND SETTERS
    // =====================================================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }


    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getBusinessName() {
        return businessName;
    }

    public void setBusinessName(String businessName) {
        this.businessName = businessName;
    }


    public String getBusinessLocation() {
        return businessLocation;
    }

    public void setBusinessLocation(String businessLocation) {
        this.businessLocation = businessLocation;
    }


    public String getBuyerType() {
        return buyerType;
    }

    public void setBuyerType(String buyerType) {
        this.buyerType = buyerType;
    }


    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getGstNumber() {
        return gstNumber;
    }

    public void setGstNumber(String gstNumber) {
        this.gstNumber = gstNumber;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }


    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }


    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }


    public AccountStatus getAccountStatus() {
        return accountStatus;
    }

    public void setAccountStatus(AccountStatus accountStatus) {
        this.accountStatus = accountStatus;
    }


    public boolean isTemporaryPassword() {
        return temporaryPassword;
    }

    public void setTemporaryPassword(boolean temporaryPassword) {
        this.temporaryPassword = temporaryPassword;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}