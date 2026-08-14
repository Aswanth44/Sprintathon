package com.uzhavarsetu.controller;

import com.uzhavarsetu.entity.Notification;
import com.uzhavarsetu.entity.User;
import com.uzhavarsetu.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/farmer/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    private User resolveUser(User principal, Authentication auth) {
        if (principal != null && principal.getId() != null) return principal;
        if (auth != null && auth.getPrincipal() instanceof User u && u.getId() != null) return u;
        return null;
    }

    /**
     * GET /api/farmer/notifications
     * Returns DB-driven notifications for the authenticated farmer.
     */
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getNotifications(
            @AuthenticationPrincipal User principal,
            Authentication auth
    ) {
        User activeUser = resolveUser(principal, auth);
        if (activeUser == null) {
            return ResponseEntity.status(401).build();
        }
        List<Notification> list = notificationService.getNotificationsForUser(activeUser);
        List<Map<String, Object>> response = list.stream().map(n -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", n.getId());
            map.put("title", n.getTitle());
            map.put("message", n.getMessage());
            map.put("type", n.getType());
            map.put("batchId", n.getBatchId());
            map.put("unread", !n.isReadStatus());
            map.put("recipientRole", "farmer");
            map.put("createdAt", n.getCreatedAt() != null ? n.getCreatedAt().toString() : null);
            return map;
        }).toList();

        return ResponseEntity.ok(response);
    }

    /**
     * PATCH /api/farmer/notifications/{id}/read
     */
    @PatchMapping("/{id}/read")
    public ResponseEntity<Map<String, Object>> markAsRead(
            @PathVariable Long id,
            @AuthenticationPrincipal User principal,
            Authentication auth
    ) {
        User activeUser = resolveUser(principal, auth);
        if (activeUser == null) {
            return ResponseEntity.status(401).build();
        }
        notificationService.markAsRead(id, activeUser);
        return ResponseEntity.ok(Map.of("success", true));
    }

    /**
     * PATCH /api/farmer/notifications/read-all
     */
    @PatchMapping("/read-all")
    public ResponseEntity<Map<String, Object>> markAllAsRead(
            @AuthenticationPrincipal User principal,
            Authentication auth
    ) {
        User activeUser = resolveUser(principal, auth);
        if (activeUser == null) {
            return ResponseEntity.status(401).build();
        }
        notificationService.markAllAsRead(activeUser);
        return ResponseEntity.ok(Map.of("success", true));
    }
}
