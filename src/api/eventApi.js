import { delay, request } from './apiClient'

const STORAGE_KEY = 'uzhavarsetu_events_ledger'

/**
 * Computes deterministic SHA-256 hash string using Web Crypto API.
 */
async function computeSha256(text) {
  try {
    const encoder = new TextEncoder()
    const data = encoder.encode(text)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
    return `0x${hex.slice(0, 24)}`
  } catch {
    // Fallback if SubtleCrypto is unavailable in non-secure contexts
    let hash = 0
    for (let i = 0; i < text.length; i++) {
      hash = (hash << 5) - hash + text.charCodeAt(i)
      hash |= 0
    }
    return `0x${Math.abs(hash).toString(16).padStart(8, '0')}e98f72a4c1`
  }
}

function getPersistedEvents() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch {
    /* fallback */
  }
  return {}
}

function savePersistedEvents(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (err) {
    console.error('Failed to save events ledger:', err)
  }
}

/**
 * Generates default genesis events for a batch if none exist yet.
 */
async function generateInitialLedgerEvents(batchId) {
  const genesisHash = '0x000000000000000000000000'

  const e1Payload = `${batchId}-EVT-001-Harvest Registered & Quality Graded-${genesisHash}`
  const hash1 = await computeSha256(e1Payload)

  const e2Payload = `${batchId}-EVT-002-Farmgate Pickup & Transporter Handoff-${hash1}`
  const hash2 = await computeSha256(e2Payload)

  const e3Payload = `${batchId}-EVT-003-Warehouse Intake & Cold Storage Deposit-${hash2}`
  const hash3 = await computeSha256(e3Payload)

  const e4Payload = `${batchId}-EVT-004-Inter-Mandi Logistics Transport Dispatch-${hash3}`
  const hash4 = await computeSha256(e4Payload)

  return [
    {
      eventId: 'EVT-001',
      batchId,
      timestamp: '10 Aug 2026, 08:30 AM',
      type: 'FARM_HARVEST',
      location: 'Pollachi Farm, Coimbatore',
      description: 'Produce harvested and assigned Grade A verification.',
      actor: 'Farmer Aswanth Kumar (UZH-FMR-000128)',
      prevHash: genesisHash,
      hash: hash1,
    },
    {
      eventId: 'EVT-002',
      batchId,
      timestamp: '10 Aug 2026, 02:15 PM',
      type: 'PICKUP_COMPLETED',
      location: 'Pollachi Agri-Logistics Pickup Point',
      description: 'Loaded onto temperature-controlled transport vehicle TN-37-AG-4921.',
      actor: 'Uzhavar Logistics Driver R. Velumani',
      prevHash: hash1,
      hash: hash2,
    },
    {
      eventId: 'EVT-003',
      batchId,
      timestamp: '10 Aug 2026, 06:45 PM',
      type: 'WAREHOUSE_STORED',
      location: 'Coimbatore Climate Cold Storage Hub #4',
      description: 'Stored at controlled 12°C humidity environment.',
      actor: 'Uzhavar Cold Storage Manager',
      prevHash: hash2,
      hash: hash3,
    },
    {
      eventId: 'EVT-004',
      batchId,
      timestamp: '11 Aug 2026, 05:00 AM',
      type: 'IN_TRANSIT',
      location: 'NH47 Highway En Route to Retail Hub',
      description: 'Inter-mandi reefer truck dispatch verified with GPS tracking.',
      actor: 'Transit Fleet Dispatcher',
      prevHash: hash3,
      hash: hash4,
    },
  ]
}

/**
 * // SPRING BOOT ENDPOINT: GET /api/batches/{batchId}/events
 * // Controller: BatchEventController.getEvents(String batchId)
 * // Request DTO: { batchId: String }
 * // Response DTO: BatchEvent[]
 * // Real implementation: queries PostgreSQL via BatchEventRepository.
 */
export async function getBatchEvents(batchId) {
  await delay(250)
  const targetId = batchId || 'UZH-TOM-00128'
  const store = getPersistedEvents()

  if (!store[targetId]) {
    store[targetId] = await generateInitialLedgerEvents(targetId)
    savePersistedEvents(store)
  }

  return request(`/batches/${targetId}/events`, { method: 'GET' }, store[targetId])
}

/**
 * // SPRING BOOT ENDPOINT: POST /api/batches/{batchId}/events
 * // Controller: BatchEventController.addEvent(String batchId, AddBatchEventRequest request)
 * // Request DTO:
 * // {
 * //     type: String,
 * //     location: String,
 * //     description: String,
 * //     actor: String
 * // }
 * // Response DTO: BatchEvent
 * // Real implementation: persists the event via BatchEventRepository and obtains the previous ledger hash from the database.
 */
export async function addBatchEvent(batchId, eventData) {
  await delay(300)
  const targetId = batchId || 'UZH-TOM-00128'
  const store = getPersistedEvents()

  if (!store[targetId]) {
    store[targetId] = await generateInitialLedgerEvents(targetId)
  }

  const existing = store[targetId]
  const lastEvent = existing[existing.length - 1]
  const prevHash = lastEvent ? lastEvent.hash : '0x000000000000000000000000'

  const eventId = `EVT-00${existing.length + 1}`
  const timestamp = new Date().toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const payload = `${targetId}-${eventId}-${eventData.type || 'EVENT'}-${prevHash}`
  const hash = await computeSha256(payload)

  const newEvent = {
    eventId,
    batchId: targetId,
    timestamp,
    type: eventData.type || 'MILESTONE_UPDATED',
    location: eventData.location || 'Coimbatore Region',
    description: eventData.description || 'Supply chain milestone updated.',
    actor: eventData.actor || 'UzhavarSetu System',
    prevHash,
    hash,
  }

  store[targetId] = [...existing, newEvent]
  savePersistedEvents(store)

  return request(`/batches/${targetId}/events`, {
    method: 'POST',
    body: JSON.stringify(eventData),
  }, newEvent)
}

/**
 * // SPRING BOOT ENDPOINT: GET /api/batches/{batchId}/ledger
 * // Controller: LedgerController.getLedger(String batchId)
 * // Request DTO: { batchId: String }
 * // Response DTO: LedgerEntry[]
 * // Real implementation: queries the persistent tamper-evident event ledger.
 */
export async function getBatchLedger(batchId) {
  await delay(200)
  const events = await getBatchEvents(batchId)
  return request(`/batches/${batchId}/ledger`, { method: 'GET' }, events)
}
