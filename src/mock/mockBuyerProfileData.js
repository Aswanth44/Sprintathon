/**
 * Buyer Profile & Settings Mock Data Store with LocalStorage Persistence
 */

export const INITIAL_BUYER_PROFILE = {
  buyerName: 'GreenFresh Traders',
  buyerId: 'UZH-BYR-000021',
  verificationStatus: 'Verified Buyer',
  verified: true,
  organizationName: 'GreenFresh Retail Sourcing Pvt Ltd',
  buyerType: 'Retail Procurement Hub',
  contactPerson: 'Ramesh Kumar',
  mobile: '+91 98765 12345',
  email: 'procurement@greenfresh.in',
  location: 'Coimbatore, Tamil Nadu',
  registrationDate: '10 Jan 2025',
  gstNumber: '33AAAAA0000A1Z5',
  procurementCategory: 'Fresh Vegetables & Fruits',
}

export const INITIAL_BUYER_SETTINGS = {
  preferences: {
    preferredCrops: ['Tomato', 'Onion', 'Potato'],
    preferredGrades: ['Grade A', 'Grade B'],
    preferredLocations: ['Coimbatore', 'Pollachi', 'Erode'],
    minPurchaseQty: '100',
    maxPurchaseQty: '5000',
  },
  notifications: {
    newFarmerOffers: true,
    offerStatusUpdates: true,
    counterOffers: true,
    orderUpdates: true,
    deliveryUpdates: true,
    priceAlerts: true,
  },
  business: {
    organizationName: 'GreenFresh Retail Sourcing Pvt Ltd',
    gstNumber: '33AAAAA0000A1Z5',
    procurementCategory: 'Fresh Vegetables & Fruits',
  },
  account: {
    language: 'English',
  },
}

export function getPersistedBuyerProfile() {
  try {
    const saved = localStorage.getItem('uzhavarsetu_buyer_profile')
    if (saved) return JSON.parse(saved)
    localStorage.setItem('uzhavarsetu_buyer_profile', JSON.stringify(INITIAL_BUYER_PROFILE))
    return INITIAL_BUYER_PROFILE
  } catch {
    return INITIAL_BUYER_PROFILE
  }
}

export function savePersistedBuyerProfile(profile) {
  try {
    localStorage.setItem('uzhavarsetu_buyer_profile', JSON.stringify(profile))
  } catch (err) {
    console.error('Failed to save buyer profile:', err)
  }
}

export function getPersistedBuyerSettings() {
  try {
    const saved = localStorage.getItem('uzhavarsetu_buyer_settings')
    if (saved) return JSON.parse(saved)
    localStorage.setItem('uzhavarsetu_buyer_settings', JSON.stringify(INITIAL_BUYER_SETTINGS))
    return INITIAL_BUYER_SETTINGS
  } catch {
    return INITIAL_BUYER_SETTINGS
  }
}

export function savePersistedBuyerSettings(settings) {
  try {
    localStorage.setItem('uzhavarsetu_buyer_settings', JSON.stringify(settings))
  } catch (err) {
    console.error('Failed to save buyer settings:', err)
  }
}
