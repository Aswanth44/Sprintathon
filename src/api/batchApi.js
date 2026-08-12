import { request } from './apiClient'
import { MOCK_BATCHES } from '../mock/mockBatchData'

// DEMO API:
// Replace this mock implementation with the Spring Boot API when the backend is available.
// Backend developer: replace these functions only. Do not modify the dashboard components.

// In-memory demo store to keep newly created batches persistent during user session
let demoBatchesStore = [...MOCK_BATCHES]

/**
 * DEMO API
 * FUTURE BACKEND ENDPOINT:
 * GET /api/farmer/batches
 *
 * Fetches active and completed produce batches for the farmer.
 */
export async function getBatches() {
  return request('/farmer/batches', { method: 'GET' }, demoBatchesStore)
}

/**
 * DEMO API
 * FUTURE BACKEND ENDPOINT:
 * GET /api/farmer/batches/{batchId}
 *
 * Fetches single produce batch details by ID.
 */
export async function getBatch(batchId) {
  const found = demoBatchesStore.find((b) => b.batchId === batchId) || demoBatchesStore[0]
  return request(`/farmer/batches/${batchId}`, { method: 'GET' }, found)
}

/**
 * DEMO API
 * FUTURE BACKEND ENDPOINT:
 * GET /api/farmer/batches/{batchId}/history
 *
 * Fetches verified traceability history log for the batch.
 */
export async function getBatchHistory(batchId) {
  const targetBatch = demoBatchesStore.find((b) => b.batchId === batchId) || demoBatchesStore[0]
  const targetId = targetBatch ? targetBatch.batchId : batchId

  const demoHistory = [
    {
      id: 'evt-1',
      event: 'Batch Created',
      description: 'Harvest registered on UzhavarSetu platform',
      timestamp: '11 Aug 2026, 9:00 PM',
      hash: `DEMO-HASH-001-${targetId}`,
      verified: true,
      stage: 'Farm',
    },
  ]

  return request(`/farmer/batches/${batchId}/history`, { method: 'GET' }, demoHistory)
}

/**
 * DEMO API
 * FUTURE BACKEND ENDPOINT:
 * POST /api/farmer/batches
 *
 * Request body:
 * {
 *   crop,
 *   quantity,
 *   unit,
 *   harvestDate,
 *   quality,
 *   expectedPrice,
 *   location,
 *   village,
 *   district,
 *   state
 * }
 *
 * Creates a new produce batch and returns status + newly generated batch object.
 */
export async function createBatch(batchData) {
  const cropCode = (batchData.crop || 'TOM').slice(0, 3).toUpperCase()
  const randomNum = Math.floor(129 + Math.random() * 800)
  const newBatchId = `UZH-${cropCode}-00${randomNum}`

  const newBatchObj = {
    batchId: newBatchId,
    crop: batchData.crop || 'Tomato',
    quantity: Number(batchData.quantity) || 500,
    unit: batchData.unit || 'kg',
    quality: batchData.quality || batchData.grade || 'Grade A',
    expectedPrice: Number(batchData.expectedPrice) || 42,
    status: 'CREATED',
    currentStage: 'FARM',
    currentStageIndex: 0,
    harvestDate: batchData.harvestDate || '2026-08-11',
    createdAt: new Date().toISOString(),
    location: batchData.location || `${batchData.village || 'Coimbatore'}, ${batchData.state || 'Tamil Nadu'}`,
    village: batchData.village || 'Coimbatore',
    district: batchData.district || 'Coimbatore',
    state: batchData.state || 'Tamil Nadu',
    stages: [
      { key: 'farm',      label: 'Farm',      desc: 'Harvest Registered', completed: true, isCurrent: true },
      { key: 'pickup',    label: 'Pickup',    desc: 'Pending Pickup',     completed: false },
      { key: 'warehouse', label: 'Warehouse', desc: 'Pending Storage',    completed: false },
      { key: 'transport', label: 'Transport', desc: 'Pending Transport',  completed: false },
      { key: 'buyer',     label: 'Buyer',     desc: 'Pending Delivery',   completed: false },
    ],
  }

  // Prepend to in-memory store
  demoBatchesStore = [newBatchObj, ...demoBatchesStore]

  const demoResponse = {
    success: true,
    batchId: newBatchId,
    message: 'Batch created successfully',
    batch: newBatchObj,
  }

  return request('/farmer/batches', {
    method: 'POST',
    body: JSON.stringify(batchData),
  }, demoResponse)
}
