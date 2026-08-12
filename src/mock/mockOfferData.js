/**
 * Mock Buyer Offers Data Store & Persistence Architecture
 * Centralized data store shared seamlessly between Buyer Marketplace and Farmer Dashboard.
 */

export const INITIAL_OFFERS = [
  {
    offerId: 'OFF-001',
    batchId: 'UZH-TOM-00128',
    crop: 'Tomato',
    quantity: 500,
    unit: 'kg',
    farmerName: 'Aswanth Kumar',
    farmerId: 'UZH-FMR-000128',
    farmerLocation: 'Pollachi, Coimbatore',
    buyerName: 'GreenFresh Traders',
    buyerLocation: 'Coimbatore Hub (12 km)',
    marketPrice: 42,
    offeredPrice: 44,
    transportCost: 2,
    netPayout: 42,
    status: 'PENDING',
    statusLabel: 'Pending Review',
    assessment: '✓ FAIR OFFER',
    expectedDelivery: '2026-08-15',
    buyerMessage: 'Direct bank transfer upon pickup.',
    createdAt: '2026-08-12T10:00:00Z',
  },
  {
    offerId: 'OFF-002',
    batchId: 'UZH-ONI-00094',
    crop: 'Onion',
    quantity: 800,
    unit: 'kg',
    farmerName: 'Aswanth Kumar',
    farmerId: 'UZH-FMR-000128',
    farmerLocation: 'Pollachi, Coimbatore',
    buyerName: 'Koyambedu Organics',
    buyerLocation: 'Chennai Central',
    marketPrice: 35,
    offeredPrice: 38,
    transportCost: 3,
    netPayout: 35,
    status: 'PENDING',
    statusLabel: 'Pending Review',
    assessment: '✓ FAIR OFFER',
    expectedDelivery: '2026-08-16',
    buyerMessage: 'Require Grade A packaging.',
    createdAt: '2026-08-12T11:30:00Z',
  },
  {
    offerId: 'OFF-003',
    batchId: 'UZH-POT-00051',
    crop: 'Potato',
    quantity: 1200,
    unit: 'kg',
    farmerName: 'Aswanth Kumar',
    farmerId: 'UZH-FMR-000128',
    farmerLocation: 'Pollachi, Coimbatore',
    buyerName: 'Kongu Agri Processors',
    buyerLocation: 'Tirupur (45 km)',
    marketPrice: 28,
    offeredPrice: 27,
    transportCost: 1.5,
    netPayout: 25.5,
    status: 'COUNTERED',
    statusLabel: 'Counter Offered',
    assessment: 'BELOW MARKET',
    counterOffer: {
      counterPrice: 30,
      quantity: 1200,
      transportCost: 1.5,
      netPayout: 28.5,
      message: 'Minimum payout must be ₹28.5/kg for Grade B potatoes.',
      createdAt: '2026-08-12T12:00:00Z',
    },
    expectedDelivery: '2026-08-18',
    buyerMessage: 'Standard bulk pickup.',
    createdAt: '2026-08-11T14:00:00Z',
  },
]

export const MOCK_OFFERS = INITIAL_OFFERS

export function getPersistedOffers() {
  try {
    const saved = localStorage.getItem('uzhavarsetu_offers')
    if (saved) return JSON.parse(saved)
    localStorage.setItem('uzhavarsetu_offers', JSON.stringify(INITIAL_OFFERS))
    return INITIAL_OFFERS
  } catch {
    return INITIAL_OFFERS
  }
}

export function savePersistedOffers(offers) {
  try {
    localStorage.setItem('uzhavarsetu_offers', JSON.stringify(offers))
  } catch (err) {
    console.error('Failed to save offers:', err)
  }
}
