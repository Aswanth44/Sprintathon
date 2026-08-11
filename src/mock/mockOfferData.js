/**
 * Mock Buyer Offers Data
 * Demo data payload for GET /api/farmer/offers
 */

export const MOCK_OFFERS = [
  {
    offerId: 'OFF-001',
    batchId: 'UZH-TOM-00128',
    buyerName: 'GreenFresh Traders',
    location: 'Coimbatore Hub (12 km)',
    crop: 'Tomato',
    marketPrice: 42,
    offeredPrice: 44,
    transportCost: 2,
    netPayout: 42,
    status: 'FAIR_OFFER',
    statusLabel: 'Fair Offer',
    rating: 4.8,
    isTopOffer: true,
  },
  {
    offerId: 'OFF-002',
    batchId: 'UZH-TOM-00128',
    buyerName: 'Koyambedu Organics',
    location: 'Chennai Central (450 km)',
    crop: 'Tomato',
    marketPrice: 42,
    offeredPrice: 45,
    transportCost: 3.5,
    netPayout: 41.5,
    status: 'GOOD_OFFER',
    statusLabel: 'Good Offer',
    rating: 4.9,
    isTopOffer: false,
  },
  {
    offerId: 'OFF-003',
    batchId: 'UZH-TOM-00128',
    buyerName: 'Kongu Agri Processors',
    location: 'Tirupur (45 km)',
    crop: 'Tomato',
    marketPrice: 42,
    offeredPrice: 43.5,
    transportCost: 1.5,
    netPayout: 42,
    status: 'FAIR_OFFER',
    statusLabel: 'Fair Offer',
    rating: 4.6,
    isTopOffer: false,
  },
]
