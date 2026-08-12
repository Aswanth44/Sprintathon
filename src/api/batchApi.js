import { request } from './apiClient'
import { getPersistedBatches, savePersistedBatches } from '../mock/mockBatchData'

/**
 * GET /api/farmer/batches
 * Fetches active and completed produce batches.
 */
export async function getBatches() {
  const batches = getPersistedBatches()
  return request('/farmer/batches', { method: 'GET' }, batches)
}

/**
 * GET /api/farmer/batches/{batchId}
 * Fetches single produce batch details by ID.
 */
export async function getBatch(batchId) {
  const batches = getPersistedBatches()
  const found = batches.find((b) => b.batchId === batchId) || batches[0]
  return request(`/farmer/batches/${batchId}`, { method: 'GET' }, found)
}

/**
 * GET /api/farmer/batches/{batchId}/history
 * Fetches verified traceability history log for the batch.
 */
export async function getBatchHistory(batchId) {
  const batches = getPersistedBatches()
  const targetBatch = batches.find((b) => b.batchId === batchId) || batches[0]
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
 * POST /api/farmer/batches
 * Creates a new produce batch.
 */
export async function createBatch(batchData) {
  const batches = getPersistedBatches()
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
    marketPrice: Number(batchData.expectedPrice) ? Number(batchData.expectedPrice) - 2 : 40,
    farmerName: 'Aswanth Kumar',
    farmerId: 'UZH-FMR-000128',
    farmLocation: batchData.location || `${batchData.village || 'Coimbatore'}, ${batchData.state || 'Tamil Nadu'}`,
    verified: true,
    status: 'CREATED',
    currentStage: 'FARM',
    currentStageIndex: 0,
    harvestDate: batchData.harvestDate || new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    location: batchData.location || `${batchData.village || 'Coimbatore'}, ${batchData.state || 'Tamil Nadu'}`,
    village: batchData.village || 'Coimbatore',
    district: batchData.district || 'Coimbatore',
    state: batchData.state || 'Tamil Nadu',
    stages: [
      { key: 'farm',      label: 'Farm Harvest',    desc: 'Harvest Registered', completed: true, isCurrent: true },
      { key: 'pickup',    label: 'Pickup',          desc: 'Pending Pickup',     completed: false },
      { key: 'warehouse', label: 'Warehouse',       desc: 'Pending Storage',    completed: false },
      { key: 'transport', label: 'Transport',       desc: 'Pending Transport',  completed: false },
      { key: 'buyer',     label: 'Buyer Delivery',  desc: 'Pending Delivery',   completed: false },
    ],
  }

  const updatedBatches = [newBatchObj, ...batches]
  savePersistedBatches(updatedBatches)

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
