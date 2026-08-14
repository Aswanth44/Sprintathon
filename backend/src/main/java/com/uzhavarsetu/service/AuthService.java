package com.uzhavarsetu.service;

import com.uzhavarsetu.dto.AuthResponse;
import com.uzhavarsetu.dto.LoginRequest;
import com.uzhavarsetu.dto.RegisterRequest;
import com.uzhavarsetu.entity.User;
import com.uzhavarsetu.repository.FarmerProfileRepository;
import com.uzhavarsetu.repository.UserRepository;
import com.uzhavarsetu.entity.FarmerProfile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final FarmerProfileRepository farmerProfileRepository;

    public AuthService(
            UserRepository userRepository,
            FarmerProfileRepository farmerProfileRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.farmerProfileRepository = farmerProfileRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }


    // =====================================================
    // BUYER REGISTRATION
    // =====================================================

    public AuthResponse registerBuyer(
            RegisterRequest request
    ) {

        // =================================================
        // CLEAN INPUT
        // =================================================

        String email =
                request.email()
                        .trim()
                        .toLowerCase();

        String mobile =
                request.mobile()
                        .trim();


        // =================================================
        // VALIDATION
        // =================================================

        if (request.businessName() == null ||
                request.businessName().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Business name is required."
            );
        }


        if (request.contactPerson() == null ||
                request.contactPerson().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Contact person is required."
            );
        }


        if (request.buyerType() == null ||
                request.buyerType().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Buyer type is required."
            );
        }


        if (request.businessLocation() == null ||
                request.businessLocation().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Business location is required."
            );
        }


        if (!mobile.matches("\\d{10}")) {

            throw new IllegalArgumentException(
                    "Mobile number must contain 10 digits."
            );
        }


        if (request.password() == null ||
                request.password().length() < 6) {

            throw new IllegalArgumentException(
                    "Password must be at least 6 characters."
            );
        }


        // =================================================
        // DUPLICATE EMAIL
        // =================================================

        if (userRepository.existsByEmail(email)) {

            throw new IllegalArgumentException(
                    "Email is already registered."
            );
        }


        // =================================================
        // DUPLICATE MOBILE
        // =================================================

        if (userRepository.existsByMobile(mobile)) {

            throw new IllegalArgumentException(
                    "Mobile number is already registered."
            );
        }


        // =================================================
        // CREATE USER
        // =================================================

        User user =
                new User();


        // Contact person

        user.setName(
                request.contactPerson()
                        .trim()
        );


        // Email

        user.setEmail(
                email
        );


        // Business name

        user.setBusinessName(
                request.businessName()
                        .trim()
        );


        // Business location

        user.setBusinessLocation(
                request.businessLocation()
                        .trim()
        );


        // Buyer type

        user.setBuyerType(
                request.buyerType()
                        .trim()
        );


        // Mobile

        user.setMobile(
                mobile
        );


        // Email acts as username

        user.setUsername(
                email
        );


        // BCrypt password

        user.setPassword(
                passwordEncoder.encode(
                        request.password()
                )
        );


        // Buyer role

        user.setRole(
                User.Role.BUYER
        );


        // Buyer account active immediately

        user.setAccountStatus(
                User.AccountStatus.ACTIVE
        );


        // Normal password

        user.setTemporaryPassword(
                false
        );


        // =================================================
        // SAVE
        // =================================================

        User savedUser =
                userRepository.save(user);


        // =================================================
        // RESPONSE
        // =================================================

        return new AuthResponse(

                true,

                "Buyer account created successfully.",

                null,

                savedUser.getId(),

                savedUser.getRole().name(),

                savedUser.getEmail()
        );
    }


    // =====================================================
    // LOGIN
    // =====================================================

    // =====================================================
// LOGIN
// Buyer + Farmer
// Email OR Mobile + Password
// =====================================================

    public AuthResponse login(
            LoginRequest request
    ) {

        String identifier = request.resolveIdentifier();

        if (identifier == null || identifier.trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Email or mobile number is required."
            );
        }

        if (request.getPassword() == null ||
                request.getPassword().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Password is required."
            );
        }


        identifier = identifier.trim();


        User user = null;


        // =================================================
        // 1. EMAIL LOGIN
        // =================================================

        if (identifier.contains("@")) {

            user =
                    userRepository
                            .findByEmail(
                                    identifier.toLowerCase()
                            )
                            .orElse(null);
        }


        // =================================================
        // 2. MOBILE LOGIN
        // =================================================

        else {

            // ---------------------------------------------
            // First check buyer mobile
            // ---------------------------------------------

            user =
                    userRepository
                            .findByMobile(identifier)
                            .orElse(null);


            // ---------------------------------------------
            // If not buyer, check farmer mobile
            // ---------------------------------------------

            if (user == null) {

                FarmerProfile farmerProfile =
                        farmerProfileRepository
                                .findByMobile(identifier)
                                .orElse(null);


                if (farmerProfile != null) {

                    user =
                            farmerProfile.getUser();
                }
            }
        }


        // =================================================
        // USER NOT FOUND
        // =================================================

        if (user == null) {

            throw new IllegalArgumentException(
                    "Invalid email/mobile or password."
            );
        }


        // =================================================
        // ALLOW BUYER + FARMER
        // =================================================

        if (user.getRole() != User.Role.BUYER &&
                user.getRole() != User.Role.FARMER) {

            throw new IllegalArgumentException(
                    "This login is only for buyers and farmers."
            );
        }


        // =================================================
        // ACCOUNT STATUS
        // =================================================

        if (
                user.getAccountStatus()
                        != User.AccountStatus.ACTIVE
        ) {

            throw new IllegalArgumentException(
                    "Your account is not active. " +
                            "Please wait for admin approval."
            );
        }


        // =================================================
        // PASSWORD EXISTS
        // =================================================

        if (user.getPassword() == null ||
                user.getPassword().isEmpty()) {

            throw new IllegalArgumentException(
                    "Password is not configured for this account."
            );
        }


        // =================================================
        // CHECK PASSWORD
        // =================================================

        boolean passwordMatches =
                passwordEncoder.matches(
                        request.getPassword(),
                        user.getPassword()
                );

        System.out.println("========== LOGIN DEBUG ==========");
        System.out.println("Email: " + user.getEmail());
        System.out.println("Role: " + user.getRole());
        System.out.println("Status: " + user.getAccountStatus());
        System.out.println("Password matches: " + passwordMatches);
        System.out.println("=================================");
        if (!passwordMatches) {

            throw new IllegalArgumentException(
                    "Invalid email/mobile or password."
            );
        }


        // =================================================
        // GENERATE JWT
        // =================================================

        String token =
                jwtService.generateToken(user);


        // =================================================
        // RESPONSE
        // =================================================

        return new AuthResponse(

                true,

                "Login successful.",

                token,

                user.getId(),

                user.getRole().name(),

                user.getEmail()
        );
    }


    // =====================================================
    // GET AUTHENTICATED USER PROFILE
    // =====================================================

    public com.uzhavarsetu.dto.UserProfileResponse getUserProfile(User user) {
        if (user == null) {
            throw new IllegalArgumentException("User not authenticated.");
        }

        User dbUser = userRepository.findById(user.getId())
                .orElseThrow(() -> new IllegalArgumentException("User not found."));

        com.uzhavarsetu.dto.UserProfileResponse response = new com.uzhavarsetu.dto.UserProfileResponse();
        response.setId(dbUser.getId());
        response.setName(dbUser.getName());
        response.setEmail(dbUser.getEmail());
        response.setMobile(dbUser.getMobile());
        response.setRole(dbUser.getRole().name());
        response.setAccountStatus(dbUser.getAccountStatus().name());

        // Registration date from actual account creation timestamp stored in MySQL (created_at column)
        if (dbUser.getCreatedAt() == null) {
            dbUser.setCreatedAt(java.time.LocalDateTime.now());
            dbUser = userRepository.save(dbUser);
        }
        if (dbUser.getCreatedAt() != null) {
            java.time.format.DateTimeFormatter fmt =
                    java.time.format.DateTimeFormatter.ofPattern("dd MMM yyyy");
            response.setRegistrationDate(dbUser.getCreatedAt().format(fmt));
        }

        if (dbUser.getRole() == User.Role.BUYER) {
            response.setBuyerId(String.format("UZH-BYR-%06d", dbUser.getId()));
            response.setBusinessName(dbUser.getBusinessName());
            response.setBuyerType(dbUser.getBuyerType());
            response.setBusinessLocation(dbUser.getBusinessLocation());
            response.setGstNumber(dbUser.getGstNumber()); // NULL by default
        } else if (dbUser.getRole() == User.Role.FARMER) {
            response.setFarmerId(String.format("UZH-FMR-%06d", dbUser.getId()));
            FarmerProfile farmerProfile = farmerProfileRepository.findByUser(dbUser)
                    .orElse(null);
            if (farmerProfile != null) {
                if (response.getMobile() == null || response.getMobile().isEmpty()) {
                    response.setMobile(farmerProfile.getMobile());
                }
                response.setVillage(farmerProfile.getVillage());
                response.setDistrict(farmerProfile.getDistrict());
                response.setState(farmerProfile.getState());
                response.setFarmSize(farmerProfile.getFarmSize());
                response.setPrimaryCrops(farmerProfile.getPrimaryCrops());
                response.setOtherCrops(farmerProfile.getOtherCrops());
                response.setFarmingType(farmerProfile.getFarmingType());
                response.setExperience(farmerProfile.getExperience());
                response.setFarmLocation(farmerProfile.getFarmLocation());
            }

            // Verification status derived from account status
            response.setVerificationStatus(dbUser.getAccountStatus().name());
        }

        return response;
    }

    public com.uzhavarsetu.dto.UserProfileResponse updateBuyerProfile(User user, java.util.Map<String, String> payload) {
        if (user == null) {
            throw new IllegalArgumentException("User not authenticated.");
        }

        User dbUser = userRepository.findById(user.getId())
                .orElseThrow(() -> new IllegalArgumentException("User not found."));

        if (payload.containsKey("name") && payload.get("name") != null && !payload.get("name").trim().isEmpty()) {
            dbUser.setName(payload.get("name").trim());
        }

        if (payload.containsKey("businessName") && payload.get("businessName") != null) {
            dbUser.setBusinessName(payload.get("businessName").trim());
        }

        if (payload.containsKey("buyerType") && payload.get("buyerType") != null) {
            dbUser.setBuyerType(payload.get("buyerType").trim());
        }

        if (payload.containsKey("businessLocation") && payload.get("businessLocation") != null) {
            dbUser.setBusinessLocation(payload.get("businessLocation").trim());
        }

        if (payload.containsKey("mobile") && payload.get("mobile") != null && !payload.get("mobile").trim().isEmpty()) {
            String mob = payload.get("mobile").trim();
            if (!mob.equals(dbUser.getMobile()) && userRepository.existsByMobile(mob)) {
                throw new IllegalArgumentException("Mobile number is already registered.");
            }
            dbUser.setMobile(mob);
        }

        if (payload.containsKey("gstNumber")) {
            String gst = payload.get("gstNumber");
            if (gst != null && !gst.trim().isEmpty()) {
                gst = gst.trim().toUpperCase();
                if (!gst.equals(dbUser.getGstNumber())) {
                    java.util.Optional<User> existingWithGst = userRepository.findByGstNumber(gst);
                    if (existingWithGst.isPresent() && !existingWithGst.get().getId().equals(dbUser.getId())) {
                        throw new IllegalArgumentException("GST number is already registered.");
                    }
                }
                dbUser.setGstNumber(gst);
            } else {
                dbUser.setGstNumber(null);
            }
        }

        userRepository.save(dbUser);
        return getUserProfile(dbUser);
    }


    // =====================================================
    // CHANGE PASSWORD
    // =====================================================

    public void changePassword(User user, com.uzhavarsetu.dto.ChangePasswordRequest request) {
        if (user == null) {
            throw new IllegalArgumentException("User not authenticated.");
        }

        if (request.getCurrentPassword() == null || request.getCurrentPassword().trim().isEmpty()) {
            throw new IllegalArgumentException("Current password is required.");
        }

        if (request.getNewPassword() == null || request.getNewPassword().length() < 6) {
            throw new IllegalArgumentException("New password must be at least 6 characters.");
        }

        User dbUser = userRepository.findById(user.getId())
                .orElseThrow(() -> new IllegalArgumentException("User not found."));

        if (dbUser.getPassword() != null && !dbUser.getPassword().isEmpty()) {
            boolean currentMatches = passwordEncoder.matches(request.getCurrentPassword(), dbUser.getPassword());
            if (!currentMatches) {
                throw new IllegalArgumentException("Current password is incorrect.");
            }
        }

        dbUser.setPassword(passwordEncoder.encode(request.getNewPassword()));
        dbUser.setTemporaryPassword(false);
        userRepository.save(dbUser);
    }
}