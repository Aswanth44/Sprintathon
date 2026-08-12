/**
 * DEMO FARMER DATA ARCHITECTURE
 * Contains mock data for Farmer Profile, Farm Details, Verification Status, Activity Stats, and App Settings.
 * Ready for backend integration handoff to Spring Boot.
 *
 * TODO: Replace localStorage/demo persistence with backend API
 * Backend teammate will connect this to the Farmer Profile API.
 */

export const INITIAL_FARMER_PROFILE = {
  fullName: 'Aswanth Kumar',
  name: 'Aswanth Kumar',
  farmerId: 'UZH-FMR-000128',
  avatar: 'A',
  status: 'Verified Farmer',
  verified: true,
  mobile: '+91 98765 43210',
  phone: '+91 98765 43210',
  email: 'aswanth.farmer@uzhavarsetu.in',
  registrationDate: '15 Jan 2025',
  village: 'Pollachi',
  district: 'Coimbatore',
  state: 'Tamil Nadu',
  location: 'Pollachi, Tamil Nadu',
  farmLocation: 'Pollachi North, Coimbatore - 642001',
  farmSize: '5.5 acres',
  primaryCrop: 'Tomato, Onion, Coconut',
  primaryCrops: ['Tomato', 'Onion', 'Coconut'],
}

export const MOCK_FARMER_PROFILE = INITIAL_FARMER_PROFILE

export const MOCK_DASHBOARD_SUMMARY = {
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
}

export const MOCK_RECENT_ACTIVITIES = [
  { id: 'ACT-001', title: 'Batch Delivered', desc: 'UZH-TOM-00128 successfully delivered to Coimbatore Mandi', timestamp: '2 hours ago' },
  { id: 'ACT-002', title: 'New Offer Received', desc: 'FreshMart Foods offered ₹44/kg for Tomato Batch', timestamp: '5 hours ago' },
  { id: 'ACT-003', title: 'Batch Created', desc: 'Registered 500kg Grade A Tomato Batch', timestamp: '1 day ago' },
]

export const INITIAL_FARM_DETAILS = {
  farmSize: '5.5 acres',
  primaryCrops: ['Tomato', 'Onion', 'Coconut'],
  otherCrops: ['Banana', 'Turmeric'],
  farmingType: 'Organic & Drip Irrigated',
  experienceYears: '12 Years',
  farmLocation: 'Pollachi North, Coimbatore - 642001',
}

export const INITIAL_FARMER_VERIFICATION = {
  identityVerification: 'Verified',
  mobileVerification: 'Verified',
  bankAccount: 'Verified',
  farmerRegistration: 'Verified',
}

export const INITIAL_FARMER_STATS = {
  totalBatches: 18,
  produceSold: '14.2 Tons',
  activeBatches: 3,
  completedTransactions: 15,
}

export const INITIAL_USER_SETTINGS = {
  notifications: {
    buyerOfferAlerts: true,
    marketPriceAlerts: true,
    pickupUpdates: true,
    paymentNotifications: true,
  },
  preferences: {
    language: 'English',
    location: 'Coimbatore',
    defaultCrop: 'Tomato',
    measurementUnit: 'kg',
  },
  privacySecurity: {
    twoFactorAuth: true,
    loginActivity: 'Chrome on Windows 11 (Active Now)',
    dataSharing: 'Minimal (Verified Buyers Only)',
  },
}

/**
 * Load persisted farmer profile from localStorage or fallback to initial mock
 */
export function getPersistedProfile() {
  // TODO: Replace localStorage/demo persistence with backend API
  // Backend teammate will connect this to the Farmer Profile API.
  try {
    const saved = localStorage.getItem('uzhavarsetu_farmer_profile')
    return saved ? JSON.parse(saved) : INITIAL_FARMER_PROFILE
  } catch {
    return INITIAL_FARMER_PROFILE
  }
}

/**
 * Save updated farmer profile to localStorage
 */
export function savePersistedProfile(profileData) {
  // TODO: Replace localStorage/demo persistence with backend API
  // Backend teammate will connect this to the Farmer Profile API.
  try {
    localStorage.setItem('uzhavarsetu_farmer_profile', JSON.stringify(profileData))
  } catch {
    /* fallback */
  }
}

/**
 * Load persisted farm details from localStorage or fallback to initial mock
 */
export function getPersistedFarmDetails() {
  // TODO: Replace demo persistence with backend API
  // Backend teammate will connect this to the Farmer Farm Details API.
  try {
    const saved = localStorage.getItem('uzhavarsetu_farm_details')
    return saved ? JSON.parse(saved) : INITIAL_FARM_DETAILS
  } catch {
    return INITIAL_FARM_DETAILS
  }
}

/**
 * Save updated farm details to localStorage
 */
export function savePersistedFarmDetails(farmData) {
  // TODO: Replace demo persistence with backend API
  // Backend teammate will connect this to the Farmer Farm Details API.
  try {
    localStorage.setItem('uzhavarsetu_farm_details', JSON.stringify(farmData))
  } catch {
    /* fallback */
  }
}
