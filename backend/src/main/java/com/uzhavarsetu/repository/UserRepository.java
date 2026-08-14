package com.uzhavarsetu.repository;

import com.uzhavarsetu.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository
        extends JpaRepository<User, Long> {

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByMobile(String mobile);

    boolean existsByGstNumber(String gstNumber);

    Optional<User> findByEmail(String email);

    Optional<User> findByUsername(String username);

    Optional<User> findByMobile(String mobile);

    Optional<User> findByGstNumber(String gstNumber);
}