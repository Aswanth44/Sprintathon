/**
 * Fair Price & Payout Calculation Utility
 * Provides reusable functions for offer classification and net farmer payout evaluation.
 */

/**
 * Calculates net farmer payout after deducting transport cost.
 * @param {number} buyerOffer - Buyer offer price per unit (e.g. ₹44/kg)
 * @param {number} transportCost - Transport cost per unit (e.g. ₹2/kg)
 * @returns {number} Net payout per unit (e.g. ₹42/kg)
 */
export function calculateNetPayout(buyerOffer, transportCost) {
  const offer = Number(buyerOffer) || 0
  const transport = Number(transportCost) || 0
  return Math.max(0, offer - transport)
}

/**
 * Evaluates a buyer offer against current market price.
 * 
 * Rules:
 * - Net payout >= marketPrice * 1.05  => GOOD OFFER
 * - Net payout >= marketPrice * 0.95  => FAIR OFFER
 * - Net payout < marketPrice * 0.95   => BELOW MARKET
 *
 * @param {number} netPayout - Net farmer payout per unit
 * @param {number} marketPrice - Benchmark market price per unit
 * @returns {{ status: string, code: 'GOOD'|'FAIR'|'BELOW', isFair: boolean, diffPercent: number, label: string }}
 */
export function evaluateOffer(netPayout, marketPrice) {
  const payout = Number(netPayout) || 0
  const market = Number(marketPrice) || 0

  if (!market || market <= 0) {
    return {
      status: 'FAIR OFFER',
      code: 'FAIR',
      isFair: true,
      diffPercent: 0,
      label: 'Fair Offer',
      description: 'Matches reference market rate'
    }
  }

  const diffPercent = ((payout - market) / market) * 100

  if (payout >= market * 1.05) {
    return {
      status: 'GOOD OFFER',
      code: 'GOOD',
      isFair: true,
      diffPercent: Math.round(diffPercent * 10) / 10,
      label: 'Good Offer',
      description: `Higher than market price by ${Math.round(diffPercent)}%`
    }
  }

  if (payout >= market * 0.95) {
    return {
      status: 'FAIR OFFER',
      code: 'FAIR',
      isFair: true,
      diffPercent: Math.round(diffPercent * 10) / 10,
      label: 'Fair Offer',
      description: 'Within fair market price range'
    }
  }

  return {
    status: 'BELOW MARKET',
    code: 'BELOW',
    isFair: false,
    diffPercent: Math.round(diffPercent * 10) / 10,
    label: 'Below Market',
    description: `Below market price by ${Math.abs(Math.round(diffPercent))}%`
  }
}
