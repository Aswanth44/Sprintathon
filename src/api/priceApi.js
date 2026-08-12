import { delay, request } from './apiClient'
import { getMarketPrice as getMarketPriceFromService } from '../services/marketPriceService'
import { getDemoMarketData } from '../mock/mockMarketData'

/**
 * // SPRING BOOT ENDPOINT:
 * // GET /api/price/{cropName}?state={state}&district={district}&market={market}
 * // Controller: MarketPriceController.getPrice(String cropName, String state, String district, String market)
 * // Request DTO: { cropName: String, state: String, district: String, market: String }
 * // Response DTO: MarketPriceDTO { commodity, state, district, market, date, modalPricePerKg, source, isLive }
 * // Real implementation: calls Government OGD / AGMARKNET API via RestTemplate/WebClient, converts quintals to kg, caches response, and falls back to database benchmark if OGD is unreachable.
 */
export async function getMarketPrice(cropName = 'Tomato', location = 'Coimbatore') {
  await delay(200)

  const serviceData = await getMarketPriceFromService({
    commodity: cropName,
    state: 'Tamil Nadu',
    district: location,
    market: location,
  })

  const responseObj = {
    crop: cropName || 'Tomato',
    commodity: serviceData.commodity,
    marketPrice: serviceData.modalPricePerKg, // Pure numeric value (e.g. 42)
    modalPricePerKg: serviceData.modalPricePerKg,
    minPricePerKg: serviceData.minPricePerKg,
    maxPricePerKg: serviceData.maxPricePerKg,
    unit: 'kg',
    mandi: `${serviceData.market} Mandi`,
    source: serviceData.source,
    isLive: serviceData.isLive,
    updatedAt: serviceData.date,
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
