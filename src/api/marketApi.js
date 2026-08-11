import { request } from './apiClient'
import { MOCK_MARKET_PRICES } from '../mock/mockMarketData'

// DEMO API:
// Replace this mock implementation with the Spring Boot API when the backend is available.
// Backend developer: replace these functions only. Do not modify the dashboard components.

/**
 * DEMO API
 * FUTURE BACKEND ENDPOINT:
 * GET /api/market/prices
 *
 * Fetches market prices across Tamil Nadu mandis for Tomato, Onion, Potato, Rice.
 */
export async function getMarketPrices() {
  return request('/market/prices', { method: 'GET' }, MOCK_MARKET_PRICES)
}

/**
 * DEMO API
 * FUTURE BACKEND ENDPOINT:
 * GET /api/market/prices/:crop
 */
export async function getFairPriceByCrop(cropName = 'Tomato') {
  const allPrices = MOCK_MARKET_PRICES
  const matched = allPrices.find((p) => p.crop.toLowerCase() === cropName.toLowerCase()) || allPrices[0]
  return request(`/market/prices/${cropName}`, { method: 'GET' }, matched)
}
