package com.uzhavarsetu.service;

import com.uzhavarsetu.entity.AdminApprovalToken;
import com.uzhavarsetu.entity.User;
import com.uzhavarsetu.repository.AdminApprovalTokenRepository;
import com.uzhavarsetu.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AdminApprovalService {

    private final AdminApprovalTokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final FarmerCredentialEmailService credentialEmailService;


    public AdminApprovalService(

            AdminApprovalTokenRepository tokenRepository,

            UserRepository userRepository,

            PasswordEncoder passwordEncoder,

            FarmerCredentialEmailService credentialEmailService

    ) {

        this.tokenRepository =
                tokenRepository;

        this.userRepository =
                userRepository;

        this.passwordEncoder =
                passwordEncoder;

        this.credentialEmailService =
                credentialEmailService;
    }



    // =====================================================
    // CREATE APPROVAL TOKEN
    // =====================================================

    public String createApprovalToken(User user) {

        String token =
                UUID.randomUUID().toString();


        AdminApprovalToken approvalToken =
                new AdminApprovalToken();


        approvalToken.setToken(token);

        approvalToken.setUser(user);

        approvalToken.setExpiresAt(
                LocalDateTime.now().plusDays(2)
        );

        approvalToken.setUsed(false);


        tokenRepository.save(
                approvalToken
        );


        return token;
    }


    // =====================================================
    // APPROVE FARMER
    // =====================================================
    private String generateTemporaryPassword() {

        return UUID.randomUUID()
                .toString()
                .substring(0, 8)
                + "@A1";
    }
    @Transactional
    public void approveFarmer(
            String token
    ) {

        AdminApprovalToken approvalToken =
                tokenRepository
                        .findByToken(token)
                        .orElseThrow(
                                () -> new IllegalArgumentException(
                                        "Invalid approval link."
                                )
                        );


        if (approvalToken.isUsed()) {

            throw new IllegalArgumentException(
                    "This approval link has already been used."
            );
        }


        if (
                LocalDateTime.now()
                        .isAfter(
                                approvalToken.getExpiresAt()
                        )
        ) {

            throw new IllegalArgumentException(
                    "This approval link has expired."
            );
        }


        User user =
                approvalToken.getUser();



        if (
                user.getAccountStatus()
                        != User.AccountStatus.PENDING
        ) {

            throw new IllegalArgumentException(
                    "This farmer is not pending approval."
            );
        }


        // =================================================
        // GENERATE USERNAME
        // =================================================

        // =================================================
// GENERATE TEMPORARY PASSWORD
// =================================================

        String temporaryPassword =
                generateTemporaryPassword();


// =================================================
// USERNAME = FARMER EMAIL
// =================================================

        String username =
                user.getEmail();


// =================================================
// UPDATE USER
// =================================================

        user.setUsername(
                username
        );


        user.setPassword(
                passwordEncoder.encode(
                        temporaryPassword
                )
        );


        user.setRole(
                User.Role.FARMER
        );


        user.setAccountStatus(
                User.AccountStatus.ACTIVE
        );


        user.setTemporaryPassword(
                true
        );


        userRepository.save(user);
        // =================================================

        approvalToken.setUsed(true);

        tokenRepository.save(
                approvalToken
        );


        // =================================================
        // SEND LOGIN DETAILS TO FARMER
        // =================================================

        credentialEmailService.sendCredentials(

                user.getEmail(),

                user.getName(),

                username,

                temporaryPassword
        );
    }


    // =====================================================
    // REJECT FARMER
    // =====================================================

    @Transactional
    public void rejectFarmer(
            String token
    ) {

        AdminApprovalToken approvalToken =
                tokenRepository
                        .findByToken(token)
                        .orElseThrow(
                                () -> new IllegalArgumentException(
                                        "Invalid rejection link."
                                )
                        );


        if (approvalToken.isUsed()) {

            throw new IllegalArgumentException(
                    "This link has already been used."
            );
        }


        if (
                LocalDateTime.now()
                        .isAfter(
                                approvalToken.getExpiresAt()
                        )
        ) {

            throw new IllegalArgumentException(
                    "This rejection link has expired."
            );
        }


        User user =
                approvalToken.getUser();


        if (
                user.getAccountStatus()
                        != User.AccountStatus.PENDING
        ) {

            throw new IllegalArgumentException(
                    "This farmer is not pending approval."
            );
        }


        user.setAccountStatus(
                User.AccountStatus.REJECTED
        );


        userRepository.save(user);


        approvalToken.setUsed(true);

        tokenRepository.save(
                approvalToken
        );
    }
}