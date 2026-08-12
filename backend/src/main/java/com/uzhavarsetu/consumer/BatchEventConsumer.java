package com.uzhavarsetu.consumer;

import com.uzhavarsetu.model.BatchEvent;
import com.uzhavarsetu.repository.InMemoryEventRepository;
import com.uzhavarsetu.service.FabricLedgerService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

// KAFKA TOPIC: uzhavarsetu.batch.events
// CONSUMER: BatchEventConsumer
// CONSUMER GROUP: uzhavarsetu-traceability
// FABRIC LEDGER SERVICE: FabricLedgerService
@Service
public class BatchEventConsumer {
    private static final Logger log = LoggerFactory.getLogger(BatchEventConsumer.class);

    private final InMemoryEventRepository repository;
    private final FabricLedgerService fabricLedgerService;

    public BatchEventConsumer(InMemoryEventRepository repository, FabricLedgerService fabricLedgerService) {
        this.repository = repository;
        this.fabricLedgerService = fabricLedgerService;
    }

    @KafkaListener(
        topics = "${uzhavarsetu.kafka.topic:uzhavarsetu.batch.events}",
        groupId = "uzhavarsetu-traceability"
    )
    public void consume(BatchEvent event) {
        if (event == null) return;

        // 1. Store in Event Repository
        repository.saveEvent(event);

        System.out.println("==================================================");
        System.out.println("[KAFKA CONSUMER]");
        System.out.println("Received Batch: " + event.getBatchId() + " (" + event.getEventType() + ")");
        System.out.println("Actor:          " + event.getActorId() + " (" + event.getActorRole() + ")");
        System.out.println("Location:       " + event.getLocation());
        System.out.println("Timestamp:      " + event.getTimestamp());
        System.out.println("==================================================");

        // 2. Submit Event to Fabric Ledger
        System.out.println("[FABRIC] Submitting ledger transaction...");
        boolean fabricSuccess = fabricLedgerService.commitEventToLedger(event);

        if (fabricSuccess) {
            log.info("[KAFKA -> FABRIC INTEGRATION] Event {} committed to Hyperledger Fabric for batch {}", event.getEventType(), event.getBatchId());
        }
    }
}
