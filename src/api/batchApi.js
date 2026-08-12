import { delay, request } from './apiClient'
import { getPersistedBatches, savePersistedBatches } from '../mock/mockBatchData'

/**
 * // SPRING BOOT ENDPOINT: GET /api/batches
 * // Controller: BatchController.getAllBatches()
 * // Request DTO: none
 * // Response DTO: Batch[]
 * // Real implementation: queries PostgreSQL via BatchRepository.
 */
export async function getBatches() {
  await delay(250)
  const batches = getPersistedBatches()
  return request('/batches', { method: 'GET' }, batches)
}

/**
 * // SPRING BOOT ENDPOINT: GET /api/batches/{batchId}
 * // Controller: BatchController.getBatch(String batchId)
 * // Request DTO: { batchId: String }
 * // Response DTO: Batch { id, crop, farmerId, quantity, createdAt }
 * // Real implementation: queries PostgreSQL via BatchRepository.
 */
export async function getBatch(batchId) {
  await delay(200)
  const batches = getPersistedBatches()
  const found = batches.find(
    (b) => b.batchId?.toUpperCase() === (batchId || '').toUpperCase() || b.id === batchId
  )

  // Safe fallback if batchId is missing/invalid to prevent UI crashes
  const fallback = found || batches[0] || {
    id: batchId || 'UZH-TOM-00128',
    batchId: batchId || 'UZH-TOM-00128',
    crop: 'Tomato',
    quantity: 500,
    unit: 'kg',
    quality: 'Grade A',
    expectedPrice: 42,
    farmerName: 'Aswanth Kumar',
    farmerId: 'UZH-FMR-000128',
    location: 'Pollachi, Coimbatore',
    createdAt: new Date().toISOString(),
    status: 'IN_TRANSIT',
  }

  return request(`/batches/${batchId}`, { method: 'GET' }, fallback)
}

/**
 * // SPRING BOOT ENDPOINT: POST /api/batches
 * // Controller: BatchController.createBatch(CreateBatchRequest request)
 * // Request DTO: { crop: String, quantity: Number, unit: String, quality: String, expectedPrice: Number, location: String }
 * // Response DTO: Batch
 * // Real implementation: persists new batch to PostgreSQL via BatchRepository.
 */
export async function createBatch(batchData) {
  await delay(300)
  const batches = getPersistedBatches()
  const cropCode = (batchData.crop || 'TOM').slice(0, 3).toUpperCase()
  const randomNum = Math.floor(129 + Math.random() * 800)
  const newBatchId = `UZH-${cropCode}-00${randomNum}`

  const newBatchObj = {
    id: newBatchId,
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
      { key: 'farm',      label: 'Farm',            desc: 'Harvest Registered', completed: true, isCurrent: true },
      { key: 'pickup',    label: 'Pickup',          desc: 'Pending Pickup',     completed: false },
      { key: 'warehouse', label: 'Warehouse',       desc: 'Pending Storage',    completed: false },
      { key: 'transport', label: 'Transport',       desc: 'Pending Transport',  completed: false },
      { key: 'buyer',     label: 'Delivery',        desc: 'Pending Delivery',   completed: false },
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

  return request('/batches', {
    method: 'POST',
    body: JSON.stringify(batchData),
  }, demoResponse)
}

/**
 * GET /api/batches/{batchId}/history
 */
export async function getBatchHistory(batchId) {
  await delay(200)
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

  return request(`/batches/${batchId}/history`, { method: 'GET' }, demoHistory)
}
