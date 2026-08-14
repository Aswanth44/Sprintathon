package com.uzhavarsetu.service;

import com.uzhavarsetu.entity.User;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;

import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;

import java.nio.charset.StandardCharsets;

import java.util.Date;

@Service
public class JwtService {

    private final SecretKey secretKey;

    private final long expiration;


    public JwtService(

            @Value("${jwt.secret}")
            String secret,

            @Value("${jwt.expiration}")
            long expiration

    ) {

        this.secretKey =
                Keys.hmacShaKeyFor(
                        secret.getBytes(
                                StandardCharsets.UTF_8
                        )
                );

        this.expiration = expiration;
    }


    public String generateToken(
            User user
    ) {

        Date now =
                new Date();


        Date expiry =
                new Date(
                        now.getTime()
                                + expiration
                );


        return Jwts.builder()

                .subject(
                        String.valueOf(
                                user.getId()
                        )
                )


                .claim(
                        "email",
                        user.getEmail()
                )


                .claim(
                        "role",
                        user.getRole().name()
                )


                .issuedAt(
                        now
                )


                .expiration(
                        expiry
                )


                .signWith(
                        secretKey
                )


                .compact();
    }

    public Long extractUserId(String token) {
        String subject = Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
        return Long.parseLong(subject);
    }

    public String extractEmail(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .get("email", String.class);
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}