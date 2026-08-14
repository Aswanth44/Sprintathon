package com.uzhavarsetu.repository;

import com.uzhavarsetu.entity.AdminApprovalToken;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdminApprovalTokenRepository
        extends JpaRepository<AdminApprovalToken, Long> {

    Optional<AdminApprovalToken>
    findByToken(String token);
}