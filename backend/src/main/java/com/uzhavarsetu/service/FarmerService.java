package com.uzhavarsetu.service;

import com.uzhavarsetu.dto.FarmerRegistrationRequest;
import com.uzhavarsetu.entity.FarmerProfile;
import com.uzhavarsetu.entity.User;
import com.uzhavarsetu.repository.FarmerProfileRepository;
import com.uzhavarsetu.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.web.multipart.MultipartFile;

@Service
public class FarmerService {

    private final UserRepository userRepository;
    private final FarmerProfileRepository farmerProfileRepository;
    private final EmailOtpService emailOtpService;
    private final FarmerEmailService farmerEmailService;
    private final AdminApprovalService approvalService;
    public FarmerService(
            UserRepository userRepository,
            FarmerProfileRepository farmerProfileRepository,
            EmailOtpService emailOtpService,
            FarmerEmailService farmerEmailService,
            AdminApprovalService approvalService
    ) {
        this.userRepository = userRepository;
        this.farmerProfileRepository = farmerProfileRepository;
        this.emailOtpService = emailOtpService;
        this.farmerEmailService = farmerEmailService;
        this.approvalService =
                approvalService;
    }


    @Transactional
public void registerFarmer(

            FarmerRegistrationRequest request,

            MultipartFile identityDocument,
            MultipartFile landDocument,
            MultipartFile addressDocument,

            MultipartFile farmerIdDocument,
            MultipartFile landTaxDocument,
            MultipartFile bankDocument,
            MultipartFile farmerPhoto

    ) {

        if (request == null) {
            throw new IllegalArgumentException("Farmer registration data is required.");
        }

        if (request.getFullName() == null || request.getFullName().trim().isEmpty()) {
            throw new IllegalArgumentException("Full name is required.");
        }

        if (request.getMobile() == null || request.getMobile().trim().isEmpty()) {
            throw new IllegalArgumentException("Mobile number is required.");
        }

        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email is required.");
        }

        if (request.getVillage() == null || request.getVillage().trim().isEmpty()) {
            throw new IllegalArgumentException("Village is required.");
        }

        if (request.getDistrict() == null || request.getDistrict().trim().isEmpty()) {
            throw new IllegalArgumentException("District is required.");
        }

        if (request.getState() == null || request.getState().trim().isEmpty()) {
            throw new IllegalArgumentException("State is required.");
        }

        if (request.getFarmSize() == null || request.getFarmSize() <= 0) {
            throw new IllegalArgumentException("Farm size must be greater than zero.");
        }

        if (identityDocument == null || identityDocument.isEmpty()) {
            throw new IllegalArgumentException("Identity document is required.");
        }

        if (landDocument == null || landDocument.isEmpty()) {
            throw new IllegalArgumentException("Land document is required.");
        }

        if (addressDocument == null || addressDocument.isEmpty()) {
            throw new IllegalArgumentException("Address document is required.");
        }

        String email =
                request.getEmail()
                        .trim()
                        .toLowerCase();


        // =========================================
        // 1. EMAIL VERIFICATION
        // =========================================

        if (!emailOtpService.isEmailVerified(email)) {

            throw new IllegalArgumentException(
                    "Please verify your email before registration."
            );
        }


        // =========================================
        // 2. DUPLICATE EMAIL
        // =========================================

        if (userRepository.existsByEmail(email)) {

            throw new IllegalArgumentException(
                    "Email is already registered."
            );
        }


        // =========================================
        // 3. CREATE USER
        // =========================================

        User user = new User();


        user.setName(
                request.getFullName()
                        .trim()
        );


        user.setEmail(email);


        user.setUsername(email);


        user.setPassword(null);


        user.setRole(
                User.Role.FARMER
        );


        // Manual verification

        user.setAccountStatus(
                User.AccountStatus.PENDING
        );


        user.setTemporaryPassword(false);


        User savedUser =
                userRepository.save(user);


        // =========================================
        // 4. FARMER PROFILE
        // =========================================

        FarmerProfile profile =
                new FarmerProfile();


        profile.setUser(savedUser);


        profile.setMobile(
                request.getMobile()
                        .trim()
        );


        profile.setVillage(
                request.getVillage()
                        .trim()
        );


        profile.setDistrict(
                request.getDistrict()
                        .trim()
        );


        profile.setState(
                request.getState()
                        .trim()
        );


        profile.setFarmSize(
                request.getFarmSize()
        );


        farmerProfileRepository.save(profile);
        String approvalToken =
                approvalService.createApprovalToken(
                        savedUser
                );

        try {

            farmerEmailService.sendFarmerApplicationToAdmin(
                    request,
                    identityDocument,
                    landDocument,
                    addressDocument,
                    farmerIdDocument,
                    landTaxDocument,
                    bankDocument,
                    farmerPhoto,
                    approvalToken
            );

        } catch (Exception e) {
            System.err.println("Farmer email notification failed: " + e.getMessage());
            e.printStackTrace();
            // Do not fail the registration itself; the admin approval token already exists.
        }
        // =========================================
        // 5. DOCUMENTS
        // =========================================
        //
        // Documents are received successfully here.
        //
        // Next step:
        // send these documents to admin email.
        //
        // We will add that separately.
        //
    }
}