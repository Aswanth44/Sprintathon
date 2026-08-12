import { delay, request } from './apiClient'
import { getPersistedOffers } from '../mock/mockOfferData'
import { getMarketPrice } from '../services/marketPriceService'

/**
 * // SPRING BOOT ENDPOINT: GET /api/batches/{batchId}/recommend
 * // Controller: RecommendationController.recommend(String batchId)
 * // Request DTO: { batchId: String }
 * // Response DTO:
 * // {
 * //     batchId: String,
 * //     benchmarkPrice: Number,
 * //     recommendations: OfferRecommendation[]
 * // }
 * // Real implementation: queries offers, fetches official government mandi benchmark, and ranks net farmer payout using RecommendationService.
 */
export async function recommendBuyerOffers(batchId = 'UZH-TOM-00128') {
  await delay(300)
  const allOffers = getPersistedOffers()
  const batchOffers = allOffers.filter((o) => o.batchId === batchId || !batchId)
  const listToRank = batchOffers.length > 0 ? batchOffers : allOffers

  // Fetch Government Mandi Benchmark
  const marketBenchmark = await getMarketPrice({ commodity: 'Tomato', district: 'Coimbatore' })
  const governmentMarketPrice = marketBenchmark?.modalPricePerKg || 42

  // Calculate netPayout = offerPrice - transportCost - (spoilageRisk || 0)
  const calculated = listToRank.map((offer) => {
    const offerPrice = Number(offer.offeredPrice || offer.offerPrice) || 40
    const transportCost = Number(offer.transportCost) || 0
    const spoilageRisk = Number(offer.spoilageRisk) || 0
    const netPayout = offerPrice - transportCost - spoilageRisk
    const marginVsBenchmark = netPayout - governmentMarketPrice

    let classification = 'FAIR OFFER'
    if (marginVsBenchmark >= 2) {
      classification = 'ABOVE MARKET'
    } else if (marginVsBenchmark < -2) {
      classification = 'BELOW MARKET'
    }

    return {
      id: offer.offerId || offer.id,
      offerId: offer.offerId || offer.id,
      batchId: offer.batchId || batchId,
      buyerId: offer.buyerId || 'BUYER-001',
      buyerName: offer.buyerName || 'FreshMart Traders',
      quantity: offer.quantity || 500,
      offerPrice,
      transportCost,
      spoilageRisk,
      netPayout,
      governmentMarketPrice,
      marginVsBenchmark,
      classification,
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
    governmentMarketPrice,
    source: marketBenchmark?.source || 'Government OGD / AGMARKNET',
    recommendations: calculated,
  }

  return request(`/batches/${batchId}/recommend`, { method: 'GET' }, resultObj)
}
