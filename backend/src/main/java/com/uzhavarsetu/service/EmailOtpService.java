package com.uzhavarsetu.service;

import com.uzhavarsetu.entity.EmailOtp;
import com.uzhavarsetu.repository.EmailOtpRepository;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
public class EmailOtpService {

    private final EmailOtpRepository otpRepository;
    private final JavaMailSender mailSender;
    private final PasswordEncoder passwordEncoder;

    private final SecureRandom random = new SecureRandom();

    public EmailOtpService(
            EmailOtpRepository otpRepository,
            JavaMailSender mailSender,
            PasswordEncoder passwordEncoder
    ) {
        this.otpRepository = otpRepository;
        this.mailSender = mailSender;
        this.passwordEncoder = passwordEncoder;
    }

    public void sendOtp(String email) {

        email = email.trim().toLowerCase();

        // Generate 6 digit OTP
        String otp = String.format(
                "%06d",
                random.nextInt(1_000_000)
        );

        // Hash OTP before storing
        String otpHash =
                passwordEncoder.encode(otp);

        EmailOtp emailOtp = new EmailOtp();

        emailOtp.setEmail(email);
        emailOtp.setOtpHash(otpHash);
        emailOtp.setCreatedAt(LocalDateTime.now());

        // OTP valid for 5 minutes
        emailOtp.setExpiresAt(
                LocalDateTime.now().plusMinutes(5)
        );

        emailOtp.setVerified(false);
        emailOtp.setAttempts(0);

        otpRepository.save(emailOtp);

        sendEmail(email, otp);
    }

    private void sendEmail(
            String email,
            String otp
    ) {

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setTo(email);

        message.setSubject(
                "UzhavarSetu - Email Verification OTP"
        );

        message.setText(
                "Your UzhavarSetu verification OTP is: "
                        + otp
                        + "\n\n"
                        + "This OTP is valid for 5 minutes."
                        + "\n\n"
                        + "Do not share this OTP with anyone."
        );

        mailSender.send(message);
    }

    public void verifyOtp(
            String email,
            String otp
    ) {

        email = email.trim().toLowerCase();

        EmailOtp emailOtp =
                otpRepository
                        .findTopByEmailOrderByCreatedAtDesc(email)
                        .orElseThrow(
                                () -> new IllegalArgumentException(
                                        "OTP not found. Please request a new OTP."
                                )
                        );

        // Already verified
        if (emailOtp.isVerified()) {

            throw new IllegalArgumentException(
                    "OTP has already been used."
            );
        }

        // Expired
        if (LocalDateTime.now()
                .isAfter(emailOtp.getExpiresAt())) {

            throw new IllegalArgumentException(
                    "OTP has expired. Please request a new OTP."
            );
        }

        // Maximum attempts
        if (emailOtp.getAttempts() >= 5) {

            throw new IllegalArgumentException(
                    "Too many incorrect attempts."
            );
        }

        // Compare entered OTP with stored hash
        boolean correct =
                passwordEncoder.matches(
                        otp,
                        emailOtp.getOtpHash()
                );

        if (!correct) {

            emailOtp.setAttempts(
                    emailOtp.getAttempts() + 1
            );

            otpRepository.save(emailOtp);

            throw new IllegalArgumentException(
                    "Invalid OTP."
            );
        }

        // OTP is correct
        emailOtp.setVerified(true);

        otpRepository.save(emailOtp);
    }

    public boolean isEmailVerified(String email) {

        return otpRepository
                .findTopByEmailOrderByCreatedAtDesc(
                        email.trim().toLowerCase()
                )
                .map(EmailOtp::isVerified)
                .orElse(false);
    }
}