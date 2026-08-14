package com.uzhavarsetu.service;

import com.uzhavarsetu.model.BatchEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

// KAFKA TOPIC: uzhavarsetu.batch.events
// PRODUCER: KafkaProducerService
@Service
public class KafkaProducerService {
    private static final Logger log = LoggerFactory.getLogger(KafkaProducerService.class);

    private final KafkaTemplate<String, BatchEvent> kafkaTemplate;

    @Value("${uzhavarsetu.kafka.topic:uzhavarsetu.batch.events}")
    private String topicName;

    public KafkaProducerService(KafkaTemplate<String, BatchEvent> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void publishEvent(BatchEvent event) {
        String key = event.getBatchId() != null ? event.getBatchId() : "DEFAULT";
        log.info("[KAFKA PRODUCER] Publishing event {} to topic {} with key {}", event.getEventType(), topicName, key);

        try {
            kafkaTemplate.send(topicName, key, event);
        } catch (Exception e) {
            log.warn("[KAFKA PRODUCER DEGRADED] Could not send to Kafka broker (running in fallback mode): {}", e.getMessage());
        }
    }
}
