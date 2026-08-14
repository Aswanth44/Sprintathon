package com.uzhavarsetu.repository;

import com.uzhavarsetu.entity.FarmerSchemeMatch;
import com.uzhavarsetu.entity.GovernmentScheme;
import com.uzhavarsetu.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FarmerSchemeMatchRepository extends JpaRepository<FarmerSchemeMatch, Long> {

    List<FarmerSchemeMatch> findByFarmer(User farmer);

    Optional<FarmerSchemeMatch> findByFarmerAndScheme(User farmer, GovernmentScheme scheme);

    void deleteByFarmer(User farmer);
}
