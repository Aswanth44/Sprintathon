/**
 * Mock Market Price & Mandi Benchmark Demo Data
 * Contains realistic demo data for 9 crops across 6 Tamil Nadu locations.
 */

export const CROPS = [
  'Tomato',
  'Onion',
  'Potato',
  'Rice',
  'Banana',
  'Coconut',
  'Carrot',
  'Cabbage',
  'Cauliflower',
]

export const LOCATIONS = [
  { id: 'coimbatore', name: 'Coimbatore', state: 'Tamil Nadu', full: 'Coimbatore, Tamil Nadu' },
  { id: 'tiruppur',   name: 'Tiruppur',   state: 'Tamil Nadu', full: 'Tiruppur, Tamil Nadu' },
  { id: 'erode',      name: 'Erode',      state: 'Tamil Nadu', full: 'Erode, Tamil Nadu' },
  { id: 'salem',      name: 'Salem',      state: 'Tamil Nadu', full: 'Salem, Tamil Nadu' },
  { id: 'madurai',    name: 'Madurai',    state: 'Tamil Nadu', full: 'Madurai, Tamil Nadu' },
  { id: 'chennai',    name: 'Chennai',    state: 'Tamil Nadu', full: 'Chennai, Tamil Nadu' },
]

/**
 * Base data templates for all 9 crops
 */
export const CROP_BASE_PRICES = {
  Tomato:      { current: 42, min: 36, max: 48, change: 6.2,  trend: [38, 39, 40, 41, 40, 41, 42] },
  Onion:       { current: 32, min: 26, max: 38, change: 3.1,  trend: [28, 29, 29, 30, 31, 31, 32] },
  Potato:      { current: 28, min: 22, max: 34, change: -1.5, trend: [30, 30, 29, 29, 28, 28, 28] },
  Rice:        { current: 54, min: 48, max: 62, change: 1.8,  trend: [51, 52, 52, 53, 53, 54, 54] },
  Banana:      { current: 24, min: 18, max: 30, change: 4.5,  trend: [21, 22, 22, 23, 23, 24, 24] },
  Coconut:     { current: 35, min: 30, max: 42, change: 2.3,  trend: [33, 33, 34, 34, 34, 35, 35] },
  Carrot:      { current: 48, min: 40, max: 56, change: 5.0,  trend: [44, 45, 45, 46, 47, 47, 48] },
  Cabbage:     { current: 22, min: 16, max: 28, change: -2.1, trend: [24, 24, 23, 23, 23, 22, 22] },
  Cauliflower: { current: 38, min: 30, max: 46, change: 3.8,  trend: [34, 35, 35, 36, 37, 37, 38] },
}

/**
 * Location-based price variance multipliers
 */
const LOCATION_VARIANCE = {
  coimbatore: 1.0,
  tiruppur:   0.98,
  erode:      0.96,
  salem:      1.02,
  madurai:    0.97,
  chennai:    1.06,
}

/**
 * Generates market price dataset for a specific crop and location.
 */
export function getDemoMarketData(cropName = 'Tomato', locationName = 'Coimbatore') {
  const crop = CROPS.find(c => c.toLowerCase() === cropName.toLowerCase()) || 'Tomato'
  const locObj = LOCATIONS.find(l => l.name.toLowerCase() === locationName.toLowerCase() || l.full.toLowerCase().includes(locationName.toLowerCase())) || LOCATIONS[0]
  const variance = LOCATION_VARIANCE[locObj.id] || 1.0
  const base = CROP_BASE_PRICES[crop] || CROP_BASE_PRICES.Tomato

  const currentPrice = Math.round(base.current * variance)
  const minimumPrice = Math.round(base.min * variance)
  const maximumPrice = Math.round(base.max * variance)
  const averagePrice = currentPrice

  const dates = ['Aug 6', 'Aug 7', 'Aug 8', 'Aug 9', 'Aug 10', 'Aug 11', 'Aug 12']
  const trend = base.trend.map((p, idx) => ({
    date: dates[idx],
    price: Math.round(p * variance),
  }))

  const mandiBenchmark = currentPrice
  const localMarketAvg = Math.max(1, currentPrice - 1)
  const buyerAvg = currentPrice + 1

  const offers = [
    {
      id: 'offer-1',
      buyerName: 'GreenFresh Traders',
      verified: true,
      rating: 4.8,
      offerPrice: currentPrice + 2,
      transportCost: 2,
      netPayout: currentPrice,
      distance: '18 km',
      pickupLocation: 'Coimbatore Market Hub',
    },
    {
      id: 'offer-2',
      buyerName: 'FreshMart Foods',
      verified: true,
      rating: 4.5,
      offerPrice: currentPrice + 4,
      transportCost: 6,
      netPayout: currentPrice - 2,
      distance: '34 km',
      pickupLocation: 'Erode Processing Center',
    },
    {
      id: 'offer-3',
      buyerName: 'AgroDirect Procurement',
      verified: true,
      rating: 4.9,
      offerPrice: currentPrice + 1,
      transportCost: 1,
      netPayout: currentPrice,
      distance: '12 km',
      pickupLocation: 'Local Warehouse',
    },
    {
      id: 'offer-4',
      buyerName: 'TamilNadu Farmers Co-op',
      verified: true,
      rating: 4.7,
      offerPrice: currentPrice + 3,
      transportCost: 2,
      netPayout: currentPrice + 1,
      distance: '22 km',
      pickupLocation: 'District Mandi Yard',
    },
  ]

  return {
    crop,
    location: locObj.full,
    locationName: locObj.name,
    state: locObj.state,
    currentPrice,
    unit: 'kg',
    minimumPrice,
    maximumPrice,
    averagePrice,
    changePercent: base.change,
    updatedAt: '12 Aug 2026',
    isDemoData: true,
    history: trend,
    benchmarks: {
      mandiBenchmark,
      localMarketAvg,
      buyerAvg,
      isDemo: true,
    },
    buyerOffers: offers,
    bestOffer: offers[0],
  }
}

/**
 * Array of mock prices for backward compatibility with existing Dashboard components.
 */
export const MOCK_MARKET_PRICES = CROPS.map(c => getDemoMarketData(c, 'Coimbatore'))
