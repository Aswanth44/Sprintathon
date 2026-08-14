package com.uzhavarsetu.repository;

import com.uzhavarsetu.entity.Notification;
import com.uzhavarsetu.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByUserOrderByCreatedAtDesc(User user);

    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);

    long countByUserAndReadStatusFalse(User user);

    long countByUserIdAndReadStatusFalse(Long userId);
}
