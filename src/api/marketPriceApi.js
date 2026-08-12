import { request } from './apiClient'
import { getDemoMarketData } from '../mock/mockMarketData'

// DEMO API & BACKEND HANDOFF INTERFACE
// Replace these mock implementations with the Spring Boot backend
// when backend integration is ready.
//
// Backend developer: Do NOT modify UI components.
// Simply replace these API functions with actual fetch calls to your endpoints.

/**
 * DEMO API: Fetches current market price and snapshot for a crop & location.
 *
 * FUTURE ENDPOINT:
 * GET /api/market-prices?crop={crop}&location={location}
 *
 * @param {string} crop - Crop name (e.g. 'Tomato')
 * @param {string} location - Location name (e.g. 'Coimbatore')
 * @returns {Promise<Object>}
 */
export async function getMarketPrices(crop = 'Tomato', location = 'Coimbatore') {
  const data = getDemoMarketData(crop, location)
  return request(`/market-prices?crop=${crop}&location=${location}`, { method: 'GET' }, data)
}

/**
 * DEMO API: Fetches 7-day price trend history for a crop & location.
 *
 * FUTURE ENDPOINT:
 * GET /api/market-prices/{crop}/trend?location={location}
 *
 * @param {string} crop - Crop name (e.g. 'Tomato')
 * @param {string} location - Location name (e.g. 'Coimbatore')
 * @returns {Promise<Array>}
 */
export async function getPriceTrend(crop = 'Tomato', location = 'Coimbatore') {
  const data = getDemoMarketData(crop, location)
  return request(`/market-prices/${crop}/trend?location=${location}`, { method: 'GET' }, data.history)
}

/**
 * DEMO API: Fetches demo market benchmarks (Government Mandi, Local Market, Buyer Avg).
 *
 * FUTURE ENDPOINT:
 * GET /api/market-prices/{crop}/benchmark?location={location}
 *
 * @param {string} crop - Crop name (e.g. 'Tomato')
 * @param {string} location - Location name (e.g. 'Coimbatore')
 * @returns {Promise<Object>}
 */
export async function getBenchmarks(crop = 'Tomato', location = 'Coimbatore') {
  const data = getDemoMarketData(crop, location)
  return request(`/market-prices/${crop}/benchmark?location=${location}`, { method: 'GET' }, data.benchmarks)
}

/**
 * DEMO API: Fetches buyer offers for a crop & location.
 *
 * FUTURE ENDPOINT:
 * GET /api/buyer-offers?crop={crop}&location={location}
 *
 * @param {string} crop - Crop name (e.g. 'Tomato')
 * @param {string} location - Location name (e.g. 'Coimbatore')
 * @returns {Promise<Array>}
 */
export async function getBuyerOffers(crop = 'Tomato', location = 'Coimbatore') {
  const data = getDemoMarketData(crop, location)
  return request(`/buyer-offers?crop=${crop}&location=${location}`, { method: 'GET' }, data.buyerOffers)
}

const marketPriceApi = {
  getMarketPrices,
  getPriceTrend,
  getBenchmarks,
  getBuyerOffers,
}

export default marketPriceApi
