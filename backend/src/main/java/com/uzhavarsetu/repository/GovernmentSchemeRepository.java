package com.uzhavarsetu.repository;

import com.uzhavarsetu.entity.GovernmentScheme;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GovernmentSchemeRepository extends JpaRepository<GovernmentScheme, Long> {

    Optional<GovernmentScheme> findBySchemeCode(String schemeCode);

    List<GovernmentScheme> findByIsActiveTrue();

    List<GovernmentScheme> findByCategoryAndIsActiveTrue(String category);
}
