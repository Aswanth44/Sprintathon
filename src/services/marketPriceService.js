import { API_CONFIG } from '../config/apiConfig'
import { getDemoMarketData } from '../mock/mockMarketData'

// In-memory cache for market price responses: key => { timestamp, data }
const priceCache = new Map()

/**
 * // SPRING BOOT ENDPOINT:
 * // GET /api/price/{cropName}?state={state}&district={district}&market={market}
 * // Controller: MarketPriceController.getPrice(String cropName, String state, String district, String market)
 * // Request DTO: { cropName: String, state: String, district: String, market: String }
 * // Response DTO: MarketPriceDTO { commodity, state, district, market, date, modalPricePerKg, source, isLive }
 * // Real implementation: calls Government OGD / AGMARKNET API via RestTemplate/WebClient, converts quintals to kg, caches response, and falls back to database benchmark if OGD is unreachable.
 */

/**
 * Service function to retrieve market prices from official Government OGD / AGMARKNET platform with fallback.
 * 
 * @param {Object} filter
 * @param {string} filter.commodity - e.g. "Tomato", "Onion", "Potato"
 * @param {string} filter.state - e.g. "Tamil Nadu"
 * @param {string} filter.district - e.g. "Coimbatore"
 * @param {string} filter.market - e.g. "Coimbatore"
 * @returns {Promise<Object>} Formatted market price DTO with ₹/kg conversion and source status.
 */
export async function getMarketPrice({
  commodity = 'Tomato',
  state = 'Tamil Nadu',
  district = 'Coimbatore',
  market = 'Coimbatore',
} = {}) {
  const normCommodity = commodity.trim()
  const normState = state.trim()
  const normDistrict = district.trim()
  const normMarket = market.trim()

  const cacheKey = `${normCommodity}_${normState}_${normDistrict}_${normMarket}`.toLowerCase()
  const now = Date.now()

  // 1. Check in-memory cache
  if (priceCache.has(cacheKey)) {
    const cached = priceCache.get(cacheKey)
    if (now - cached.timestamp < API_CONFIG.CACHE_DURATION_MS) {
      return cached.data
    }
  }

  const apiKey = API_CONFIG.AGMARKNET_API_KEY
  const baseUrl = API_CONFIG.AGMARKNET_API_URL

  // 2. Attempt Real Government OGD / AGMARKNET Request if API key is configured
  if (apiKey && apiKey !== '' && apiKey !== 'YOUR_API_KEY_HERE') {
    try {
      const url = `${baseUrl}?api-key=${encodeURIComponent(apiKey)}&format=json&filters[commodity]=${encodeURIComponent(normCommodity)}&filters[state]=${encodeURIComponent(normState)}&filters[district]=${encodeURIComponent(normDistrict)}`

      const response = await fetch(url, { headers: { Accept: 'application/json' } })

      if (response.ok) {
        const json = await response.json()
        const records = json?.records || []

        if (records.length > 0) {
          const first = records[0]
          const minPriceQuintal = Number(first.min_price) || 3800
          const maxPriceQuintal = Number(first.max_price) || 4500
          const modalPriceQuintal = Number(first.modal_price) || 4200

          // Convert ₹/quintal to ₹/kg (1 quintal = 100 kg)
          const minPricePerKg = Math.round(minPriceQuintal / 100)
          const maxPricePerKg = Math.round(maxPriceQuintal / 100)
          const modalPricePerKg = Math.round(modalPriceQuintal / 100)

          const liveData = {
            commodity: first.commodity || normCommodity,
            state: first.state || normState,
            district: first.district || normDistrict,
            market: first.market || normMarket,
            date: first.arrival_date || new Date().toISOString().split('T')[0],
            minPrice: minPriceQuintal,
            maxPrice: maxPriceQuintal,
            modalPrice: modalPriceQuintal,
            minPricePerKg,
            maxPricePerKg,
            modalPricePerKg,
            unit: '₹/quintal',
            source: 'Government OGD / AGMARKNET',
            isLive: true,
            statusNote: 'Official live Government OGD / AGMARKNET feed',
          }

          priceCache.set(cacheKey, { timestamp: now, data: liveData })
          return liveData
        }
      }
    } catch (err) {
      console.warn('AGMARKNET OGD API call failed or timed out. Switching to fallback demo benchmark:', err)
    }
  }

  // 3. Fallback Mode: Generate deterministic fallback benchmark matching demo dataset
  const demoData = getDemoMarketData(normCommodity, normDistrict)
  const modalPricePerKg = Number(demoData.currentPrice) || (normCommodity.toLowerCase() === 'onion' ? 36 : normCommodity.toLowerCase() === 'potato' ? 30 : 42)
  const minPricePerKg = modalPricePerKg - 4
  const maxPricePerKg = modalPricePerKg + 3
  const modalPriceQuintal = modalPricePerKg * 100

  const fallbackData = {
    commodity: normCommodity,
    state: normState,
    district: normDistrict,
    market: normMarket,
    date: new Date().toISOString().split('T')[0],
    minPrice: minPricePerKg * 100,
    maxPrice: maxPricePerKg * 100,
    modalPrice: modalPriceQuintal,
    minPricePerKg,
    maxPricePerKg,
    modalPricePerKg,
    unit: '₹/quintal',
    source: 'DEMO MARKET DATA',
    isLive: false,
    statusNote: apiKey ? 'Government OGD endpoint unreachable - Using demo benchmark' : 'AGMARKNET_API_KEY unconfigured - Using demo benchmark',
  }

  priceCache.set(cacheKey, { timestamp: now, data: fallbackData })
  return fallbackData
}
