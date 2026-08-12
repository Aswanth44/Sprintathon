import { request } from './apiClient'
import { MOCK_DASHBOARD_SUMMARY, MOCK_FARMER_PROFILE, MOCK_RECENT_ACTIVITIES } from '../mock/mockFarmerData'

// DEMO API:
// Replace this mock implementation with the Spring Boot API when the backend is available.
// Backend developer: replace these functions only. Do not modify the dashboard components.

/**
 * DEMO API
 * FUTURE BACKEND ENDPOINT:
 * GET /api/farmer/dashboard
 *
 * Fetches farmer profile, high-level summary metrics, and recent activities.
 */
export async function getDashboard() {
  const demoResponse = {
    ...MOCK_DASHBOARD_SUMMARY,
    farmer: MOCK_FARMER_PROFILE,
    recentActivities: MOCK_RECENT_ACTIVITIES,
  }

  return request('/farmer/dashboard', { method: 'GET' }, demoResponse)
}

/**
 * DEMO API
 * FUTURE BACKEND ENDPOINT:
 * GET /api/farmer/profile
 */
export async function getProfile() {
  return request('/farmer/profile', { method: 'GET' }, MOCK_FARMER_PROFILE)
}

/**
 * DEMO API
 * FUTURE BACKEND ENDPOINT:
 * PUT /api/farmer/profile
 *
 * Updates farmer personal profile details (Name, Village, District, State).
 */
export async function updateProfile(profileData) {
  const updatedProfile = {
    ...MOCK_FARMER_PROFILE,
    ...profileData,
    location: `${profileData.village || profileData.district || 'Coimbatore'}, ${profileData.state || 'Tamil Nadu'}`,
  }

  const demoResponse = {
    success: true,
    message: 'Profile updated successfully',
    farmer: updatedProfile,
  }

  return request('/farmer/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  }, demoResponse)
}

/**
 * DEMO API
 * FUTURE BACKEND ENDPOINT:
 * PUT /api/farmer/farm-details
 *
 * Updates farm operational details (Farm Size, Primary Crops, Village, District).
 */
export async function updateFarmDetails(farmData) {
  const updatedFarm = {
    ...MOCK_FARMER_PROFILE,
    farmSize: typeof farmData.farmSize === 'number' ? `${farmData.farmSize} acres` : farmData.farmSize,
    primaryCrop: farmData.primaryCrops || farmData.primaryCrop || 'Tomato',
    village: farmData.village || 'Coimbatore',
    district: farmData.district || 'Coimbatore',
  }

  const demoResponse = {
    success: true,
    message: 'Farm details updated successfully',
    farm: updatedFarm,
  }

  return request('/farmer/farm-details', {
    method: 'PUT',
    body: JSON.stringify(farmData),
  }, demoResponse)
}
