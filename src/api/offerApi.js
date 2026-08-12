import { request } from './apiClient'
import { getPersistedOffers, savePersistedOffers } from '../mock/mockOfferData'
import { createPurchaseFromOffer } from './purchaseApi'
import { addNotification } from './notificationApi'

/**
 * GET /api/farmer/offers
 * Fetches all buyer offers or filters by batchId.
 */
export async function getOffers(batchId) {
  const allOffers = getPersistedOffers()
  const filtered = batchId ? allOffers.filter((o) => o.batchId === batchId) : allOffers
  return request('/farmer/offers', { method: 'GET' }, filtered)
}

/**
 * POST /api/buyer/offers
 * Creates a new purchase offer for a farmer batch and notifies the farmer.
 */
export async function createOffer(offerData) {
  const allOffers = getPersistedOffers()
  const offerId = `OFF-00${allOffers.length + 1}`

  const newOffer = {
    offerId,
    batchId: offerData.batchId,
    crop: offerData.crop || 'Tomato',
    quantity: Number(offerData.quantity) || 500,
    unit: offerData.unit || 'kg',
    farmerName: offerData.farmerName || 'Aswanth Kumar',
    farmerId: offerData.farmerId || 'UZH-FMR-000128',
    farmerLocation: offerData.farmerLocation || 'Pollachi, Coimbatore',
    buyerName: offerData.buyerName || 'FreshMart Foods',
    buyerLocation: offerData.buyerLocation || 'Coimbatore Central',
    marketPrice: Number(offerData.marketPrice) || 42,
    offeredPrice: Number(offerData.offeredPrice),
    transportCost: Number(offerData.transportCost) || 0,
    netPayout: Number(offerData.offeredPrice) - (Number(offerData.transportCost) || 0),
    status: 'PENDING',
    statusLabel: 'Pending Review',
    assessment: offerData.assessment || (Number(offerData.offeredPrice) - (Number(offerData.transportCost) || 0) >= (Number(offerData.marketPrice) || 42) ? '✓ FAIR OFFER' : 'BELOW MARKET'),
    expectedDelivery: offerData.expectedDelivery || new Date().toISOString().split('T')[0],
    buyerMessage: offerData.buyerMessage || '',
    createdAt: new Date().toISOString(),
  }

  const updatedOffers = [newOffer, ...allOffers]
  savePersistedOffers(updatedOffers)

  // Notify Farmer of new buyer offer
  addNotification({
    recipientRole: 'farmer',
    type: 'offer_received',
    title: 'New buyer offer received',
    message: `${newOffer.buyerName} submitted an offer of ₹${newOffer.offeredPrice}/kg for ${newOffer.crop} (${newOffer.batchId}).`,
    batchId: newOffer.batchId,
    offerId,
    targetTab: 'offers',
  })

  return request('/buyer/offers', { method: 'POST', body: JSON.stringify(offerData) }, {
    success: true,
    message: 'Offer Submitted Successfully',
    offer: newOffer,
  })
}

/**
 * PUT /api/farmer/offers/:offerId/status
 * Updates offer status (ACCEPTED, REJECTED) and notifies buyer.
 */
export async function updateOfferStatus(offerId, newStatus) {
  const allOffers = getPersistedOffers()
  let targetOffer = null

  const updatedOffers = allOffers.map((o) => {
    if (o.offerId === offerId) {
      targetOffer = {
        ...o,
        status: newStatus,
        statusLabel: newStatus === 'ACCEPTED' ? 'Accepted' : newStatus === 'REJECTED' ? 'Rejected' : o.statusLabel,
        updatedAt: new Date().toISOString(),
      }
      return targetOffer
    }
    return o
  })

  savePersistedOffers(updatedOffers)

  if (targetOffer) {
    if (newStatus === 'ACCEPTED') {
      createPurchaseFromOffer(targetOffer)
      addNotification({
        recipientRole: 'buyer',
        type: 'offer_accepted',
        title: 'Your offer was accepted',
        message: `Your offer for ${targetOffer.quantity} kg ${targetOffer.crop} (${targetOffer.batchId}) @ ₹${targetOffer.offeredPrice}/kg was accepted!`,
        batchId: targetOffer.batchId,
        offerId,
        targetTab: 'purchases',
      })
    } else if (newStatus === 'REJECTED') {
      addNotification({
        recipientRole: 'buyer',
        type: 'offer_rejected',
        title: 'Your offer was rejected',
        message: `Your offer for ${targetOffer.crop} (${targetOffer.batchId}) was rejected by the farmer.`,
        batchId: targetOffer.batchId,
        offerId,
        targetTab: 'offers',
      })
    }
  }

  return request(`/farmer/offers/${offerId}/status`, { method: 'PUT', body: JSON.stringify({ status: newStatus }) }, {
    success: true,
    offerId,
    status: newStatus,
  })
}

/**
 * PUT /api/farmer/offers/:offerId/counter
 * Submits a counter offer from farmer to buyer and notifies buyer.
 */
export async function counterOffer(offerId, counterData) {
  const allOffers = getPersistedOffers()
  let targetOffer = null

  const updatedOffers = allOffers.map((o) => {
    if (o.offerId === offerId) {
      const counterPrice = Number(counterData.counterPrice)
      const transportCost = Number(o.transportCost || 0)
      const counterNetPayout = counterPrice - transportCost

      targetOffer = {
        ...o,
        status: 'COUNTERED',
        statusLabel: 'Counter Offered',
        counterOffer: {
          counterPrice,
          quantity: Number(counterData.quantity) || o.quantity,
          transportCost,
          netPayout: counterNetPayout,
          message: counterData.message || 'Counter price requested by farmer.',
          createdAt: new Date().toISOString(),
        },
        updatedAt: new Date().toISOString(),
      }
      return targetOffer
    }
    return o
  })

  savePersistedOffers(updatedOffers)

  if (targetOffer) {
    addNotification({
      recipientRole: 'buyer',
      type: 'counter_offer',
      title: 'Counter offer received',
      message: `Farmer sent a counter offer of ₹${counterData.counterPrice}/kg for ${targetOffer.crop} (${targetOffer.batchId}).`,
      batchId: targetOffer.batchId,
      offerId,
      targetTab: 'offers',
    })
  }

  return request(`/farmer/offers/${offerId}/counter`, { method: 'PUT', body: JSON.stringify(counterData) }, {
    success: true,
    offerId,
    status: 'COUNTERED',
  })
}

/**
 * PUT /api/buyer/offers/:offerId/respond-counter
 * Buyer accepts or rejects farmer's counter offer and notifies farmer.
 */
export async function respondToCounter(offerId, action) {
  const status = action === 'accept' ? 'ACCEPTED' : 'REJECTED'
  const allOffers = getPersistedOffers()
  let targetOffer = null

  const updatedOffers = allOffers.map((o) => {
    if (o.offerId === offerId) {
      targetOffer = {
        ...o,
        status,
        statusLabel: status === 'ACCEPTED' ? 'Accepted' : 'Rejected',
        updatedAt: new Date().toISOString(),
      }
      return targetOffer
    }
    return o
  })

  savePersistedOffers(updatedOffers)

  if (targetOffer) {
    if (status === 'ACCEPTED') {
      createPurchaseFromOffer(targetOffer)
      addNotification({
        recipientRole: 'farmer',
        type: 'offer_accepted',
        title: 'Counter offer accepted by buyer',
        message: `Buyer accepted your counter offer for ${targetOffer.crop} (${targetOffer.batchId})! Purchase created.`,
        batchId: targetOffer.batchId,
        offerId,
        targetTab: 'offers',
      })
    } else {
      addNotification({
        recipientRole: 'farmer',
        type: 'offer_rejected',
        title: 'Counter offer declined by buyer',
        message: `Buyer declined the counter offer for ${targetOffer.crop} (${targetOffer.batchId}).`,
        batchId: targetOffer.batchId,
        offerId,
        targetTab: 'offers',
      })
    }
  }

  return request(`/buyer/offers/${offerId}/respond-counter`, { method: 'PUT', body: JSON.stringify({ action }) }, {
    success: true,
    offerId,
    status,
  })
}
