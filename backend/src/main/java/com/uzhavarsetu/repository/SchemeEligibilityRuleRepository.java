package com.uzhavarsetu.repository;

import com.uzhavarsetu.entity.GovernmentScheme;
import com.uzhavarsetu.entity.SchemeEligibilityRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SchemeEligibilityRuleRepository extends JpaRepository<SchemeEligibilityRule, Long> {

    List<SchemeEligibilityRule> findByScheme(GovernmentScheme scheme);

    List<SchemeEligibilityRule> findBySchemeId(Long schemeId);
}
