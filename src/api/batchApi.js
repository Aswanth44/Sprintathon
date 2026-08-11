import { request } from './apiClient'
import { MOCK_BATCHES } from '../mock/mockBatchData'

// DEMO API:
// Replace this mock implementation with the Spring Boot API when the backend is available.
// Backend developer: replace these functions only. Do not modify the dashboard components.

/**
 * DEMO API
 * FUTURE BACKEND ENDPOINT:
 * GET /api/farmer/batches
 *
 * Fetches active and completed produce batches for the farmer.
 */
export async function getBatches() {
  return request('/farmer/batches', { method: 'GET' }, MOCK_BATCHES)
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
 *   location,
 *   quality,
 *   expectedPrice
 * }
 *
 * Creates a new produce batch and returns status + newly generated batch object.
 */
export async function createBatch(batchData) {
  const cropCode = (batchData.crop || 'TOM').slice(0, 3).toUpperCase()
  const randomNum = Math.floor(100 + Math.random() * 900)
  const newBatchId = `UZH-${cropCode}-00${randomNum}`

  const newBatchObj = {
    batchId: newBatchId,
    crop: batchData.crop || 'Tomato',
    quantity: Number(batchData.quantity) || 500,
    unit: batchData.unit || 'kg',
    quality: batchData.quality || batchData.grade || 'Grade A',
    status: 'PICKUP_SCHEDULED',
    currentStage: 'PICKUP',
    currentStageIndex: 1,
    harvestDate: batchData.harvestDate || '2026-08-11',
    createdAt: new Date().toISOString(),
    stages: [
      { key: 'farm',      label: 'Farm',      desc: 'Harvested',       completed: true  },
      { key: 'pickup',    label: 'Pickup',    desc: 'Scheduled Today', completed: true, isCurrent: true },
      { key: 'warehouse', label: 'Warehouse', desc: 'Pending',         completed: false },
      { key: 'transport', label: 'Transport', desc: 'Pending',         completed: false },
      { key: 'buyer',     label: 'Buyer',     desc: 'Delivered',       completed: false },
    ],
  }

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
