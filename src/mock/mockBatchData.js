/**
 * Mock Produce Batches Data with LocalStorage Persistence
 * Demo data payload for GET /api/farmer/batches
 */

export const MOCK_BATCHES = [
  {
    batchId: 'UZH-TOM-00128',
    crop: 'Tomato',
    quantity: 500,
    unit: 'kg',
    quality: 'Grade A',
    expectedPrice: 44,
    marketPrice: 42,
    farmerName: 'Aswanth Kumar',
    farmerId: 'UZH-FMR-000128',
    farmLocation: 'Pollachi, Coimbatore',
    verified: true,
    status: 'IN_TRANSIT',
    currentStage: 'TRANSPORT',
    currentStageIndex: 3,
    harvestDate: '2026-08-10',
    createdAt: '2026-08-10T08:30:00Z',
    stages: [
      { key: 'farm',      label: 'Farm',            desc: 'Harvested at Pollachi Farm', completed: true  },
      { key: 'pickup',    label: 'Pickup',          desc: 'Agri Logistics Loaded',      completed: true  },
      { key: 'warehouse', label: 'Warehouse',       desc: 'Cold Storage Verified',      completed: true  },
      { key: 'transport', label: 'Transport',       desc: 'In Transit to Hub',          completed: true, isCurrent: true },
      { key: 'buyer',     label: 'Delivery',        desc: 'Direct Retail Delivery',     completed: false },
    ],
  },
  {
    batchId: 'UZH-ONI-00094',
    crop: 'Onion',
    quantity: 800,
    unit: 'kg',
    quality: 'Grade A',
    expectedPrice: 38,
    marketPrice: 35,
    farmerName: 'Aswanth Kumar',
    farmerId: 'UZH-FMR-000128',
    farmLocation: 'Erode Rural, Tamil Nadu',
    verified: true,
    status: 'WAREHOUSE_STORED',
    currentStage: 'WAREHOUSE',
    currentStageIndex: 2,
    harvestDate: '2026-08-09',
    createdAt: '2026-08-09T10:15:00Z',
    stages: [
      { key: 'farm',      label: 'Farm',            desc: 'Harvested at Erode Farm',    completed: true  },
      { key: 'pickup',    label: 'Pickup',          desc: 'Agri Logistics Picked Up',   completed: true  },
      { key: 'warehouse', label: 'Warehouse',       desc: 'Stored in Cold Climate Hub', completed: true, isCurrent: true },
      { key: 'transport', label: 'Transport',       desc: 'Transport Pending',          completed: false },
      { key: 'buyer',     label: 'Delivery',        desc: 'Direct Retail Delivery',     completed: false },
    ],
  },
  {
    batchId: 'UZH-POT-00051',
    crop: 'Potato',
    quantity: 1200,
    unit: 'kg',
    quality: 'Grade B',
    expectedPrice: 28,
    marketPrice: 26,
    farmerName: 'Aswanth Kumar',
    farmerId: 'UZH-FMR-000128',
    farmLocation: 'Nilgiris, Ooty',
    verified: true,
    status: 'PICKUP_SCHEDULED',
    currentStage: 'PICKUP',
    currentStageIndex: 1,
    harvestDate: '2026-08-11',
    createdAt: '2026-08-11T07:00:00Z',
    stages: [
      { key: 'farm',      label: 'Farm',            desc: 'Harvested in Nilgiris',      completed: true  },
      { key: 'pickup',    label: 'Pickup',          desc: 'Scheduled for Pick Up',      completed: true, isCurrent: true },
      { key: 'warehouse', label: 'Warehouse',       desc: 'Warehouse Storage Pending',  completed: false },
      { key: 'transport', label: 'Transport',       desc: 'Logistics Transport Pending', completed: false },
      { key: 'buyer',     label: 'Delivery',        desc: 'Direct Retail Delivery',     completed: false },
    ],
  },
]

export function getPersistedBatches() {
  try {
    const saved = localStorage.getItem('uzhavarsetu_batches')
    if (saved) return JSON.parse(saved)
    localStorage.setItem('uzhavarsetu_batches', JSON.stringify(MOCK_BATCHES))
    return MOCK_BATCHES
  } catch {
    return MOCK_BATCHES
  }
}

export function savePersistedBatches(batches) {
  try {
    localStorage.setItem('uzhavarsetu_batches', JSON.stringify(batches))
  } catch (err) {
    console.error('Failed to save batches:', err)
  }
}
