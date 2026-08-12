/**
 * Mock Farmer Data
 * Demo data payload for GET /api/farmer/dashboard
 */

export const MOCK_FARMER_PROFILE = {
  name: 'Aswanth',
  village: 'Coimbatore',
  district: 'Coimbatore',
  state: 'Tamil Nadu',
  location: 'Coimbatore, Tamil Nadu',
  farmerId: 'FARM-TN-3789',
  status: 'Verified Farmer',
  phone: '+91 98765 43210',
  email: 'aswanth@uzhavarsetu.in',
  farmSize: '5.5 Acres',
  primaryCrop: 'Tomato',
  primaryCrops: ['Tomato', 'Onion', 'Coconut'],
  rating: 4.9,
  totalBatchesSold: 24,
}

// DEMO API
// These summary values will come from the Spring Boot dashboard API.
// FUTURE ENDPOINT:
// GET /api/farmer/dashboard
export const MOCK_DASHBOARD_SUMMARY = {
  farmer: MOCK_FARMER_PROFILE,
  summary: {
    inTransitAndStored: 5,
    pendingReview: 2,
    highestBuyerBid: 44,
    highestBuyerBidUnit: 'kg',
    highestBuyerBidCrop: 'Tomato',
    mandiIndex: 42,
    mandiIndexUnit: 'kg',
    mandiIndexCrop: 'Tomato',
    mandiIndexLocation: 'Coimbatore',
  },
  fairPrice: {
    crop: 'Tomato',
    price: 42,
    change: 6.2,
    unit: 'kg',
    minPrice: 38,
    maxPrice: 46,
  },
}

export const MOCK_RECENT_ACTIVITIES = [
  {
    id: 'act-1',
    type: 'create',
    icon: 'CheckCircle2',
    title: 'Batch UZH-TOM-00128 created',
    desc: '500 kg Tomato Grade A registered',
    timestamp: 'Today, 08:30 AM',
  },
  {
    id: 'act-2',
    type: 'pickup',
    icon: 'CheckCircle2',
    title: 'Pickup completed',
    desc: 'Transporter #TN-37 picked up batch from farm',
    timestamp: 'Today, 10:15 AM',
  },
  {
    id: 'act-3',
    type: 'warehouse',
    icon: 'CheckCircle2',
    title: 'Warehouse received batch',
    desc: 'Inspected and safely stored at Coimbatore Hub',
    timestamp: 'Today, 01:20 PM',
  },
  {
    id: 'act-4',
    type: 'offer',
    icon: 'Bell',
    title: 'New buyer offer received',
    desc: 'GreenFresh Traders offered ₹44/kg for UZH-TOM-00128',
    timestamp: 'Today, 03:45 PM',
  },
]
