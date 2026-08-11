/**
 * Mock Produce Batches Data
 * Demo data payload for GET /api/farmer/batches
 */

export const MOCK_BATCHES = [
  {
    batchId: 'UZH-TOM-00128',
    crop: 'Tomato',
    quantity: 500,
    unit: 'kg',
    quality: 'Grade A',
    status: 'IN_TRANSIT',
    currentStage: 'TRANSPORT',
    currentStageIndex: 3,
    harvestDate: '2026-08-10',
    createdAt: '2026-08-10T08:30:00Z',
    stages: [
      { key: 'farm',      label: 'Farm',      desc: 'Harvested',      completed: true  },
      { key: 'pickup',    label: 'Pickup',    desc: 'Picked Up',      completed: true  },
      { key: 'warehouse', label: 'Warehouse', desc: 'Stored Safely',  completed: true  },
      { key: 'transport', label: 'Transport', desc: 'In Transit',     completed: true, isCurrent: true },
      { key: 'buyer',     label: 'Buyer',     desc: 'Delivered',      completed: false },
    ],
  },
  {
    batchId: 'UZH-ONI-00094',
    crop: 'Onion',
    quantity: 800,
    unit: 'kg',
    quality: 'Grade A',
    status: 'WAREHOUSE_STORED',
    currentStage: 'WAREHOUSE',
    currentStageIndex: 2,
    harvestDate: '2026-08-09',
    createdAt: '2026-08-09T10:15:00Z',
    stages: [
      { key: 'farm',      label: 'Farm',      desc: 'Harvested',      completed: true  },
      { key: 'pickup',    label: 'Pickup',    desc: 'Picked Up',      completed: true  },
      { key: 'warehouse', label: 'Warehouse', desc: 'Stored Safely',  completed: true, isCurrent: true },
      { key: 'transport', label: 'Transport', desc: 'Pending',        completed: false },
      { key: 'buyer',     label: 'Buyer',     desc: 'Delivered',      completed: false },
    ],
  },
  {
    batchId: 'UZH-POT-00051',
    crop: 'Potato',
    quantity: 1200,
    unit: 'kg',
    quality: 'Grade B',
    status: 'PICKUP_SCHEDULED',
    currentStage: 'PICKUP',
    currentStageIndex: 1,
    harvestDate: '2026-08-11',
    createdAt: '2026-08-11T07:00:00Z',
    stages: [
      { key: 'farm',      label: 'Farm',      desc: 'Harvested',      completed: true  },
      { key: 'pickup',    label: 'Pickup',    desc: 'Scheduled Today', completed: true, isCurrent: true },
      { key: 'warehouse', label: 'Warehouse', desc: 'Pending',        completed: false },
      { key: 'transport', label: 'Transport', desc: 'Pending',        completed: false },
      { key: 'buyer',     label: 'Buyer',     desc: 'Delivered',      completed: false },
    ],
  },
]
