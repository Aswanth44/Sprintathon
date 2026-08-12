import { delay, request } from './apiClient'
import { getPersistedOffers } from '../mock/mockOfferData'

/**
 * // SPRING BOOT ENDPOINT: GET /api/batches/{batchId}/recommend
 * // Controller: RecommendationController.recommend(String batchId)
 * // Request DTO: { batchId: String }
 * // Response DTO:
 * // {
 * //     batchId: String,
 * //     recommendations: OfferRecommendation[]
 * // }
 * // Real implementation: queries offers and calculates/ranks net farmer payout using RecommendationService.
 */
export async function recommendBuyerOffers(batchId = 'UZH-TOM-00128') {
  await delay(300)
  const allOffers = getPersistedOffers()
  const batchOffers = allOffers.filter((o) => o.batchId === batchId || !batchId)
  const listToRank = batchOffers.length > 0 ? batchOffers : allOffers

  // Calculate netPayout = offerPrice - transportCost
  const calculated = listToRank.map((offer) => {
    const offerPrice = Number(offer.offeredPrice || offer.offerPrice) || 40
    const transportCost = Number(offer.transportCost) || 0
    const netPayout = offerPrice - transportCost

    return {
      id: offer.offerId || offer.id,
      batchId: offer.batchId || batchId,
      buyerId: offer.buyerId || 'BUYER-001',
      buyerName: offer.buyerName || 'FreshMart Traders',
      quantity: offer.quantity || 500,
      offerPrice,
      transportCost,
      netPayout,
      status: offer.status || 'PENDING',
      createdAt: offer.createdAt || new Date().toISOString(),
      recommended: false,
      exploitative: false,
    }
  })

  // Rank from highest net payout to lowest net payout
  calculated.sort((a, b) => b.netPayout - a.netPayout)

  if (calculated.length > 0) {
    // Highest net payout gets recommended: true
    calculated[0].recommended = true

    // Lowest net payout gets exploitative: true (if more than 1 offer)
    if (calculated.length > 1) {
      calculated[calculated.length - 1].exploitative = true
    }
  }

  const resultObj = {
    batchId,
    recommendations: calculated,
  }

  return request(`/batches/${batchId}/recommend`, { method: 'GET' }, resultObj)
}
