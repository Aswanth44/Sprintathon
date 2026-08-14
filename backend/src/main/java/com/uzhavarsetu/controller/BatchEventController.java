package com.uzhavarsetu.controller;

import com.uzhavarsetu.model.BatchEvent;
import com.uzhavarsetu.model.BatchEventRequest;
import com.uzhavarsetu.model.BatchStatusResponse;
import com.uzhavarsetu.service.BatchEventService;
import com.uzhavarsetu.service.FabricLedgerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

// KAFKA TOPIC: uzhavarsetu.batch.events
// PRODUCER: KafkaProducerService
// CONSUMER: BatchEventConsumer
// FABRIC SERVICE: FabricLedgerService
// CONSUMER GROUP: uzhavarsetu-traceability
@RestController
@RequestMapping("/api")
public class BatchEventController {

    private final BatchEventService batchEventService;
    private final FabricLedgerService fabricLedgerService;

    public BatchEventController(BatchEventService batchEventService, FabricLedgerService fabricLedgerService) {
        this.batchEventService = batchEventService;
        this.fabricLedgerService = fabricLedgerService;
    }

    // SPRING BOOT ENDPOINT: POST /api/batches/{batchId}/events
    // Request DTO: BatchEventRequest { eventType, actorId, actorRole, location, quantity, unit, metadata }
    // Response: Map { success: true, message: String, event: BatchEvent }
    // Production: Publishes event to Kafka topic `uzhavarsetu.batch.events` and submits to Fabric ledger.
    @PostMapping("/batches/{batchId}/events")
    public ResponseEntity<?> createEvent(@PathVariable String batchId, @RequestBody BatchEventRequest request) {
        try {
            BatchEvent event = batchEventService.createAndPublishEvent(batchId, request);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Batch event published to Kafka topic uzhavarsetu.batch.events and committed to Fabric ledger");
            response.put("event", event);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            Map<String, Object> err = new HashMap<>();
            err.put("success", false);
            err.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(err);
        } catch (Exception e) {
            Map<String, Object> err = new HashMap<>();
            err.put("success", false);
            err.put("error", "Internal server error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(err);
        }
    }

    // SPRING BOOT ENDPOINT: GET /api/batches/{batchId}/events
    // Response: Map { batchId: String, events: List<BatchEvent> }
    @GetMapping("/batches/{batchId}/events")
    public ResponseEntity<?> getBatchEvents(@PathVariable String batchId) {
        List<BatchEvent> events = batchEventService.getBatchEvents(batchId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("batchId", batchId);
        response.put("events", events);

        return ResponseEntity.ok(response);
    }

    // SPRING BOOT ENDPOINT: GET /api/batches/{batchId}/status
    // Response: BatchStatusResponse { batchId, currentStage, latestEvent, lastUpdated, eventCount }
    @GetMapping("/batches/{batchId}/status")
    public ResponseEntity<BatchStatusResponse> getBatchStatus(@PathVariable String batchId) {
        BatchStatusResponse status = batchEventService.getBatchStatus(batchId);
        return ResponseEntity.ok(status);
    }

    // SPRING BOOT ENDPOINT: GET /api/batches/{batchId}/ledger
    // Response: Map { batchId: String, source: "HYPERLEDGER_FABRIC", events: List<BatchEvent> }
    @GetMapping("/batches/{batchId}/ledger")
    public ResponseEntity<?> getBatchLedger(@PathVariable String batchId) {
        List<BatchEvent> fabricEvents = fabricLedgerService.getBatchLedgerEvents(batchId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("batchId", batchId);
        response.put("source", "HYPERLEDGER_FABRIC");
        response.put("channel", "uzhavarsetuchannel");
        response.put("chaincode", "uzhavarsetu-ledger");
        response.put("events", fabricEvents);

        return ResponseEntity.ok(response);
    }

    // SPRING BOOT ENDPOINT: GET /api/batches/{batchId}/ledger/verify
    // Response: Map { batchId: String, verified: boolean, eventCount: int, source: "HYPERLEDGER_FABRIC" }
    @GetMapping("/batches/{batchId}/ledger/verify")
    public ResponseEntity<?> verifyBatchLedger(@PathVariable String batchId) {
        Map<String, Object> verification = fabricLedgerService.verifyBatchLedger(batchId);
        return ResponseEntity.ok(verification);
    }

    // SPRING BOOT ENDPOINT: POST /api/demo/batches/{batchId}/simulate
    // Response: Map { success: true, batchId: String, eventsPublished: int, events: List<BatchEvent> }
    @PostMapping("/demo/batches/{batchId}/simulate")
    public ResponseEntity<?> simulateDemoSequence(@PathVariable String batchId) {
        List<BatchEvent> events = batchEventService.runDemoSimulation(batchId);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("batchId", batchId);
        response.put("eventsPublished", events.size());
        response.put("message", "Published 7 sequential supply chain events to Kafka topic uzhavarsetu.batch.events & Fabric ledger");
        response.put("events", events);

        return ResponseEntity.ok(response);
    }
}
