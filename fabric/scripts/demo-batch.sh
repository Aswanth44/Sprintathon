#!/usr/bin/env bash
set -e

echo "========================================"
echo " UZHAVARSETU FABRIC LEDGER DEMO "
echo "========================================"
echo "Batch: UZH-TOM-00128"
echo ""

BACKEND_URL="http://localhost:8080/api"

echo "[1] Running 7-Stage Event Simulation..."
curl -s -X POST "$BACKEND_URL/demo/batches/UZH-TOM-00128/simulate" | grep -q "true" && echo "✓ 7 Events Committed to Kafka & Fabric Ledger"

echo ""
echo "[2] Fetching Hyperledger Fabric Ledger Events..."
curl -s -X GET "$BACKEND_URL/batches/UZH-TOM-00128/ledger"

echo ""
echo ""
echo "========================================"
echo " LEDGER VERIFICATION "
echo "========================================"
curl -s -X GET "$BACKEND_URL/batches/UZH-TOM-00128/ledger/verify"
echo ""
echo "========================================"
