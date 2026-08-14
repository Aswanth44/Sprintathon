# UzhavarSetu Kafka Event-Driven Pipeline — Demonstration Guide

This guide provides step-by-step instructions to run and demonstrate the local Apache Kafka event pipeline for UzhavarSetu during the Sprintathon.

---

## 🏗 Architecture Overview

```
React Frontend / API Client
          │
          ▼  (HTTP POST /api/batches/{batchId}/events)
  Spring Boot Backend (Port 8080)
          │
          ▼  (Kafka Producer: key = batchId)
  Apache Kafka Broker (Port 9092)
     Topic: uzhavarsetu.batch.events
          │
          ▼  (Kafka Listener: Consumer Group = uzhavarsetu-traceability)
  BatchEventConsumer
          │
          ▼  (Stores event & updates status)
  InMemoryEventRepository / Traceability Ledger
```

---

## 🚀 Quick Start Commands (Windows PowerShell / Command Prompt)

### 1. Start Local Kafka Infrastructure
```powershell
docker compose -f docker-compose.kafka.yml up -d
```

### 2. Verify Kafka Container Status
```powershell
docker compose -f docker-compose.kafka.yml ps
```

### 3. Build & Run Spring Boot Backend
```powershell
cd backend
mvn clean package
java -jar target/uzhavarsetu-backend-1.0.0-SNAPSHOT.jar
```

---

## 🧪 Demonstration & Testing Commands

### Step A: Health Check Endpoint
```powershell
curl -X GET http://localhost:8080/api/health
```
**Expected Output**:
```json
{
  "status": "UP",
  "service": "UzhavarSetu Backend",
  "kafka": "CONNECTED",
  "kafkaServers": "localhost:9092"
}
```

---

### Step B: Run Complete 7-Stage Demo Event Simulation
```powershell
curl -X POST http://localhost:8080/api/demo/batches/UZH-TOM-00128/simulate
```
**Sequential Supply Chain Events Published**:
1. `HARVESTED` (Farmer harvest registered at Pollachi Farm)
2. `PICKUP_COMPLETED` (Pickup by Agri-Logistics fleet)
3. `WAREHOUSE_RECEIVED` (Intake at Coimbatore Cold Storage #4)
4. `QUALITY_VERIFIED` (Grade A verification at Quality Lab)
5. `TRANSPORT_STARTED` (Inter-Mandi reefer dispatch on NH47)
6. `BUYER_PURCHASED` (Procurement by GreenFresh Traders)
7. `DELIVERED` (Final retail store delivery)

---

### Step C: Post Individual Batch Event to Kafka
```powershell
curl -X POST http://localhost:8080/api/batches/UZH-TOM-00128/events `
  -H "Content-Type: application/json" `
  -d '{
    "eventType": "WAREHOUSE_RECEIVED",
    "actorId": "UZH-FMR-000128",
    "actorRole": "FARMER",
    "location": "Coimbatore Cold Storage Hub #4",
    "quantity": 500,
    "unit": "kg"
  }'
```

---

### Step D: Fetch All Events for Batch
```powershell
curl -X GET http://localhost:8080/api/batches/UZH-TOM-00128/events
```

---

### Step E: Fetch Current Batch Stage & Status
```powershell
curl -X GET http://localhost:8080/api/batches/UZH-TOM-00128/status
```
**Expected Output**:
```json
{
  "batchId": "UZH-TOM-00128",
  "currentStage": "DELIVERED",
  "latestEvent": "DELIVERED",
  "eventCount": 7
}
```

---

## 🛑 Stop Kafka Infrastructure
```powershell
docker compose -f docker-compose.kafka.yml down
```
