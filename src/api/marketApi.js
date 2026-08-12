import { request } from './apiClient'
import { getDemoMarketData, MOCK_MARKET_PRICES } from '../mock/mockMarketData'
export * from './marketPriceApi'

// DEMO API:
// Replace this mock implementation with the Spring Boot API when the backend is available.

/**
 * DEMO API
 * FUTURE ENDPOINT: GET /api/market/prices
 */
export async function getMarketPrices() {
  return request('/market/prices', { method: 'GET' }, MOCK_MARKET_PRICES)
}

/**
 * DEMO API
 * FUTURE ENDPOINT: GET /api/market/prices/:crop
 */
export async function getFairPriceByCrop(cropName = 'Tomato') {
  const data = getDemoMarketData(cropName, 'Coimbatore')
  return request(`/market/prices/${cropName}`, { method: 'GET' }, data)
}
