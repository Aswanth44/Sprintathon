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
