import { delay, request } from './apiClient'
import { getDemoMarketData } from '../mock/mockMarketData'

/**
 * // SPRING BOOT ENDPOINT: GET /api/price/{cropName}
 * // Controller: MarketPriceController.getPrice(String cropName)
 * // Request DTO: { cropName: String }
 * // Response DTO:
 * // {
 * //     crop: String,
 * //     marketPrice: Number,
 * //     unit: String,
 * //     mandi: String,
 * //     updatedAt: String
 * // }
 * // Real implementation: retrieves current mandi/market data from the configured market-price provider or repository.
 */
export async function getMarketPrice(cropName = 'Tomato') {
  await delay(200)
  const normalized = (cropName || 'Tomato').toLowerCase()
  
  const PRICES = {
    tomato: 42,
    onion: 36,
    potato: 30,
    coconut: 28,
    banana: 22,
  }

  const numericPrice = PRICES[normalized] || 40

  const responseObj = {
    crop: cropName || 'Tomato',
    marketPrice: numericPrice, // Pure numeric value, e.g. 42
    unit: 'kg',
    mandi: 'Coimbatore Wholesale Mandi',
    updatedAt: new Date().toISOString(),
  }

  return request(`/price/${cropName}`, { method: 'GET' }, responseObj)
}

/**
 * // SPRING BOOT ENDPOINT: GET /api/market-prices
 * // Controller: MarketPriceController.getAllPrices()
 * // Request DTO: none
 * // Response DTO: MarketPrice[]
 * // Real implementation: queries latest mandi market index for all crops.
 */
export async function getMarketPrices(crop = 'Tomato', location = 'Coimbatore') {
  await delay(250)
  const data = getDemoMarketData(crop, location)
  return request(`/market-prices?crop=${crop}&location=${location}`, { method: 'GET' }, data)
}
