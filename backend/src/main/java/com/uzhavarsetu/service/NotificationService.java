package com.uzhavarsetu.service;

import com.uzhavarsetu.entity.Notification;
import com.uzhavarsetu.entity.User;
import com.uzhavarsetu.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    public Notification createNotification(User user, String title, String message, String type, String batchId) {
        if (user == null) return null;
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(type != null ? type : "GENERAL");
        notification.setBatchId(batchId);
        notification.setReadStatus(false);
        return notificationRepository.save(notification);
    }

    public List<Notification> getNotificationsForUser(User user) {
        if (user == null || user.getId() == null) return Collections.emptyList();
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
    }

    public Notification markAsRead(Long id, User user) {
        if (id == null || user == null) return null;
        Notification notification = notificationRepository.findById(id).orElse(null);
        if (notification != null && notification.getUser() != null && notification.getUser().getId().equals(user.getId())) {
            notification.setReadStatus(true);
            return notificationRepository.save(notification);
        }
        return notification;
    }

    public void markAllAsRead(User user) {
        if (user == null || user.getId() == null) return;
        List<Notification> list = notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        for (Notification n : list) {
            if (!n.isReadStatus()) {
                n.setReadStatus(true);
            }
        }
        notificationRepository.saveAll(list);
    }

    public long getUnreadCount(User user) {
        if (user == null || user.getId() == null) return 0;
        return notificationRepository.countByUserIdAndReadStatusFalse(user.getId());
    }
}
