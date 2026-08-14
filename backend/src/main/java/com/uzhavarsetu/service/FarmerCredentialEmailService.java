package com.uzhavarsetu.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class FarmerCredentialEmailService {

    private final JavaMailSender mailSender;

    public FarmerCredentialEmailService(
            JavaMailSender mailSender
    ) {
        this.mailSender = mailSender;
    }

    public void sendCredentials(
            String farmerEmail,
            String farmerName,
            String username,
            String temporaryPassword
    ) {

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setTo(farmerEmail);

        message.setSubject(
                "UzhavarSetu - Farmer Account Approved"
        );

        message.setText(
                """
                Dear %s,

                Your UzhavarSetu farmer account has been
                approved successfully.

                ==============================
                LOGIN DETAILS
                ==============================

                Email:
                %s

                Username:
                %s

                Temporary Password:
                %s

                ==============================

                You can login using:

                1. Email + Password
                2. Mobile Number + Password

                Please change your temporary password
                after your first login.

                Regards,
                UzhavarSetu Admin
                """.formatted(
                        farmerName,
                        farmerEmail,
                        username,
                        temporaryPassword
                )
        );

        mailSender.send(message);
    }
}