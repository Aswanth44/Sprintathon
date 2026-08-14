package com.uzhavarsetu.repository;

import com.uzhavarsetu.entity.ProduceBatch;
import com.uzhavarsetu.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProduceBatchRepository extends JpaRepository<ProduceBatch, Long> {

    List<ProduceBatch> findByUser(User user);

    List<ProduceBatch> findByUserId(Long userId);

    Optional<ProduceBatch> findByBatchId(String batchId);

    long countByUser(User user);
}
