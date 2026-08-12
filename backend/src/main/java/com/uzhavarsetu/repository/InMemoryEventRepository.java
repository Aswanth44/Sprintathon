package com.uzhavarsetu.repository;

import com.uzhavarsetu.model.BatchEvent;
import org.springframework.stereotype.Repository;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

// FUTURE PRODUCTION VERSION:
// Replace InMemoryEventRepository with Spring Data JPA/PostgreSQL repository.
@Repository
public class InMemoryEventRepository {
    private final Map<String, List<BatchEvent>> batchEventsMap = new ConcurrentHashMap<>();

    public void saveEvent(BatchEvent event) {
        if (event == null || event.getBatchId() == null) return;
        batchEventsMap.computeIfAbsent(event.getBatchId(), k -> new CopyOnWriteArrayList<>()).add(event);
    }

    public List<BatchEvent> getEventsByBatchId(String batchId) {
        return batchEventsMap.getOrDefault(batchId, Collections.emptyList());
    }

    public Optional<BatchEvent> getLatestEvent(String batchId) {
        List<BatchEvent> list = getEventsByBatchId(batchId);
        if (list.isEmpty()) return Optional.empty();
        return Optional.of(list.get(list.size() - 1));
    }

    public List<BatchEvent> getAllEvents() {
        List<BatchEvent> all = new ArrayList<>();
        batchEventsMap.values().forEach(all::addAll);
        return all;
    }
}
