package com.uzhavarsetu.repository;

import com.uzhavarsetu.entity.FarmerProfile;
import com.uzhavarsetu.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FarmerProfileRepository
        extends JpaRepository<FarmerProfile, Long> {

    Optional<FarmerProfile> findByMobile(String mobile);

    Optional<FarmerProfile> findByUser(User user);

    Optional<FarmerProfile> findByUserId(Long userId);
}