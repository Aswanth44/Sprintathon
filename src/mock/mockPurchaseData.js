/**
 * Centralized Purchases & Orders Data Store with LocalStorage Persistence
 * Synchronizes seamlessly between Farmer Dashboard, Buyer Marketplace, Buyer Purchases, and Buyer Track Orders.
 */

export const INITIAL_PURCHASES = [
  {
    purchaseId: 'UZH-PUR-00031',
    offerId: 'OFF-001',
    batchId: 'UZH-TOM-00128',
    crop: 'Tomato',
    quantity: 500,
    unit: 'kg',
    grade: 'Grade A',
    farmerName: 'Aswanth Kumar',
    farmerId: 'UZH-FMR-000128',
    farmerLocation: 'Pollachi, Coimbatore',
    purchasePrice: 44,
    transportCost: 2,
    totalAmount: 23000, // 500 * (44 + 2)
    purchaseDate: '2026-08-12',
    status: 'CONFIRMED', // CONFIRMED, PROCESSING, COMPLETED, CANCELLED
    currentStage: 'TRANSPORT',
    expectedDelivery: '2026-08-15',
  },
  {
    purchaseId: 'UZH-PUR-00032',
    offerId: 'OFF-002',
    batchId: 'UZH-ONI-00094',
    crop: 'Onion',
    quantity: 800,
    unit: 'kg',
    grade: 'Grade A',
    farmerName: 'Aswanth Kumar',
    farmerId: 'UZH-FMR-000128',
    farmerLocation: 'Pollachi, Coimbatore',
    purchasePrice: 38,
    transportCost: 3,
    totalAmount: 32800, // 800 * (38 + 3)
    purchaseDate: '2026-08-10',
    status: 'PROCESSING',
    currentStage: 'WAREHOUSE',
    expectedDelivery: '2026-08-16',
  },
]

export const INITIAL_ORDERS = [
  {
    orderId: 'UZH-ORD-0019',
    purchaseId: 'UZH-PUR-00031',
    batchId: 'UZH-TOM-00128',
    crop: 'Tomato',
    quantity: 500,
    unit: 'kg',
    farmerName: 'Aswanth Kumar',
    currentLocation: 'NH47 Highway - En Route to Hub',
    expectedDelivery: '15 Aug 2026',
    status: 'TRANSPORT',
    currentStageIndex: 3,
    stages: [
      { key: 'farm',      label: 'Farm Harvest',    desc: 'Harvested at Pollachi Farm', completed: true  },
      { key: 'pickup',    label: 'Pickup',          desc: 'Agri-Logistics Picked Up',   completed: true  },
      { key: 'warehouse', label: 'Warehouse',       desc: 'Cold Storage Verified',      completed: true  },
      { key: 'transport', label: 'Transport',       desc: 'In Transit on NH47',         completed: true, isCurrent: true },
      { key: 'buyer',     label: 'Buyer Delivery',  desc: 'Direct Retail Delivery',     completed: false },
    ],
  },
  {
    orderId: 'UZH-ORD-0020',
    purchaseId: 'UZH-PUR-00032',
    batchId: 'UZH-ONI-00094',
    crop: 'Onion',
    quantity: 800,
    unit: 'kg',
    farmerName: 'Aswanth Kumar',
    currentLocation: 'Coimbatore Climate Warehouse',
    expectedDelivery: '16 Aug 2026',
    status: 'WAREHOUSE',
    currentStageIndex: 2,
    stages: [
      { key: 'farm',      label: 'Farm Harvest',    desc: 'Harvested at Pollachi Farm', completed: true  },
      { key: 'pickup',    label: 'Pickup',          desc: 'Agri-Logistics Picked Up',   completed: true  },
      { key: 'warehouse', label: 'Warehouse',       desc: 'Cold Storage Verified',      completed: true, isCurrent: true },
      { key: 'transport', label: 'Transport',       desc: 'Logistics Transport Pending', completed: false },
      { key: 'buyer',     label: 'Buyer Delivery',  desc: 'Direct Retail Delivery',     completed: false },
    ],
  },
]

export function getPersistedPurchases() {
  try {
    const saved = localStorage.getItem('uzhavarsetu_purchases')
    if (saved) return JSON.parse(saved)
    localStorage.setItem('uzhavarsetu_purchases', JSON.stringify(INITIAL_PURCHASES))
    return INITIAL_PURCHASES
  } catch {
    return INITIAL_PURCHASES
  }
}

export function savePersistedPurchases(purchases) {
  try {
    localStorage.setItem('uzhavarsetu_purchases', JSON.stringify(purchases))
  } catch (err) {
    console.error('Failed to save purchases:', err)
  }
}

export function getPersistedOrders() {
  try {
    const saved = localStorage.getItem('uzhavarsetu_orders')
    if (saved) return JSON.parse(saved)
    localStorage.setItem('uzhavarsetu_orders', JSON.stringify(INITIAL_ORDERS))
    return INITIAL_ORDERS
  } catch {
    return INITIAL_ORDERS
  }
}

export function savePersistedOrders(orders) {
  try {
    localStorage.setItem('uzhavarsetu_orders', JSON.stringify(orders))
  } catch (err) {
    console.error('Failed to save orders:', err)
  }
}
