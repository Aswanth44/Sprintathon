# UzhavarSetu Hyperledger Fabric Traceability Ledger

This module provides an immutable, tamper-evident distributed ledger implementation for UzhavarSetu supply chain events using Hyperledger Fabric.

---

## 🏗 Architecture Integration

```
React Frontend (Port 5173/5174)
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
          ├──────────────────────────┐
          ▼                          ▼
  InMemoryEventRepository   FabricLedgerService
                                     │
                                     ▼
                            Fabric Gateway (Port 7051)
                                     │
                                     ▼
                            Hyperledger Fabric Peer
                               Channel: uzhavarsetuchannel
                             Chaincode: uzhavarsetu-ledger
```

---

## 📋 Prerequisites

1. **Docker Desktop & Docker Compose** (running)
2. **Node.js v18+** (for chaincode execution)
3. **Java 17 & Maven** (for Spring Boot backend)

---

## 🚀 Step-by-Step Execution Guide (Windows / Linux)

### 1. Start Fabric Local Network Containers
```powershell
docker compose -f fabric/docker-compose.fabric.yml up -d
```

### 2. Verify Running Containers
```powershell
docker compose -f fabric/docker-compose.fabric.yml ps
```
**Expected Containers**:
- `orderer.example.com` (Port 7050)
- `peer0.org1.example.com` (Port 7051)
- `ca.org1.example.com` (Port 7054)

### 3. Start Spring Boot Backend
```powershell
cd backend
mvn clean package
java -jar target/uzhavarsetu-backend-1.0.0-SNAPSHOT.jar
```

### 4. Run Demonstration Script (PowerShell)
```powershell
.\fabric\scripts\demo-batch.ps1
```

### 5. Run Demonstration Script (Bash)
```bash
bash fabric/scripts/demo-batch.sh
```

---

## 🧪 REST Endpoints & Verification

### Query Fabric Ledger Batch Events
```powershell
curl -X GET http://localhost:8080/api/batches/UZH-TOM-00128/ledger
```
**Response**:
```json
{
  "batchId": "UZH-TOM-00128",
  "source": "HYPERLEDGER_FABRIC",
  "channel": "uzhavarsetuchannel",
  "chaincode": "uzhavarsetu-ledger",
  "events": [
    {
      "eventId": "EVT-001",
      "batchId": "UZH-TOM-00128",
      "eventType": "HARVESTED",
      "location": "Pollachi Farm, Coimbatore",
      "actorId": "Farmer Aswanth Kumar"
    }
  ]
}
```

### Verify Fabric Ledger Integrity
```powershell
curl -X GET http://localhost:8080/api/batches/UZH-TOM-00128/ledger/verify
```
**Response**:
```json
{
  "batchId": "UZH-TOM-00128",
  "verified": true,
  "eventCount": 7,
  "source": "HYPERLEDGER_FABRIC",
  "channel": "uzhavarsetuchannel",
  "chaincode": "uzhavarsetu-ledger"
}
```

---

## 🛑 Stop Fabric Local Network
```powershell
docker compose -f fabric/docker-compose.fabric.yml down
```
