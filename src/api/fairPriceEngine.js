/**
 * UzhavarSetu Fair-Price Engine & Buyer Offer Calculator
 * 
 * Performs deterministic calculations for:
 * 1. difference = buyerOffer - marketPrice
 * 2. batchImpact = difference * quantity
 * 3. netPayout = offerPrice - transportCost - (spoilageRisk || 0)
 * 4. Classification: ABOVE MARKET, FAIR OFFER, BELOW MARKET
 * 
 * // SPRING BOOT SERVICE: FairPriceService.calculateFairPrice(Offer offer, MarketPrice benchmark)
 * // Real implementation: calculates fair price margin and ranks buyer offers in Spring Boot backend.
 */

/**
 * Calculates fair price metrics and classifications for an offer vs market benchmark.
 */
export function calculateFairPriceMetrics(offerPrice, marketPrice, quantity = 500, transportCost = 0, spoilageRisk = 0) {
  const numOfferPrice = Number(offerPrice) || 0
  const numMarketPrice = Number(marketPrice) || 0
  const numQty = Number(quantity) || 500
  const numTransport = Number(transportCost) || 0
  const numSpoilage = Number(spoilageRisk) || 0

  const netPayout = numOfferPrice - numTransport - numSpoilage
  const difference = numOfferPrice - numMarketPrice
  const batchImpact = difference * numQty

  let classification = 'FAIR OFFER'
  if (difference > 1) {
    classification = 'ABOVE MARKET'
  } else if (difference < -2) {
    classification = 'BELOW MARKET'
  }

  return {
    offerPrice: numOfferPrice,
    marketPrice: numMarketPrice,
    transportCost: numTransport,
    spoilageRisk: numSpoilage,
    netPayout,
    difference,
    batchImpact,
    classification,
  }
}
