import { request } from './apiClient'
import {
  getPersistedPurchases,
  savePersistedPurchases,
  getPersistedOrders,
  savePersistedOrders,
} from '../mock/mockPurchaseData'

/**
 * GET /api/buyer/purchases
 */
export async function getPurchases() {
  const purchases = getPersistedPurchases()
  return request('/buyer/purchases', { method: 'GET' }, purchases)
}

/**
 * GET /api/buyer/orders
 */
export async function getOrders() {
  const orders = getPersistedOrders()
  return request('/buyer/orders', { method: 'GET' }, orders)
}

/**
 * Creates a purchase and tracking order when an offer is ACCEPTED.
 */
export function createPurchaseFromOffer(offer) {
  const purchases = getPersistedPurchases()
  const orders = getPersistedOrders()

  // Check if purchase already exists for this offer
  const existing = purchases.find((p) => p.offerId === offer.offerId)
  if (existing) return existing

  const purchaseId = `UZH-PUR-00${purchases.length + 31}`
  const orderId = `UZH-ORD-00${orders.length + 21}`

  const qty = Number(offer.quantity) || 500
  const price = Number(offer.counterOffer?.counterPrice || offer.offeredPrice) || 44
  const transport = Number(offer.transportCost) || 2
  const totalAmount = qty * (price + transport)

  const newPurchase = {
    purchaseId,
    offerId: offer.offerId,
    batchId: offer.batchId,
    crop: offer.crop,
    quantity: qty,
    unit: offer.unit || 'kg',
    grade: 'Grade A',
    farmerName: offer.farmerName || 'Aswanth Kumar',
    farmerId: offer.farmerId || 'UZH-FMR-000128',
    farmerLocation: offer.farmerLocation || 'Pollachi, Coimbatore',
    purchasePrice: price,
    transportCost: transport,
    totalAmount,
    purchaseDate: new Date().toISOString().split('T')[0],
    status: 'CONFIRMED',
    currentStage: 'TRANSPORT',
    expectedDelivery: offer.expectedDelivery || '2026-08-18',
  }

  const newOrder = {
    orderId,
    purchaseId,
    batchId: offer.batchId,
    crop: offer.crop,
    quantity: qty,
    unit: offer.unit || 'kg',
    farmerName: offer.farmerName || 'Aswanth Kumar',
    currentLocation: 'Pollachi Agri Logistics Hub',
    expectedDelivery: offer.expectedDelivery || '18 Aug 2026',
    status: 'TRANSPORT',
    currentStageIndex: 3,
    stages: [
      { key: 'farm',      label: 'Farm Harvest',    desc: 'Harvested & Inspected', completed: true  },
      { key: 'pickup',    label: 'Pickup',          desc: 'Agri Logistics Loaded', completed: true  },
      { key: 'warehouse', label: 'Warehouse',       desc: 'Cold Storage Verified', completed: true  },
      { key: 'transport', label: 'Transport',       desc: 'In Transit to Hub',     completed: true, isCurrent: true },
      { key: 'buyer',     label: 'Buyer Delivery',  desc: 'Direct Retail Delivery', completed: false },
    ],
  }

  savePersistedPurchases([newPurchase, ...purchases])
  savePersistedOrders([newOrder, ...orders])

  return newPurchase
}
