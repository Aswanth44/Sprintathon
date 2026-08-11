import { request } from './apiClient'
import { MOCK_OFFERS } from '../mock/mockOfferData'

// DEMO API:
// Replace this mock implementation with the Spring Boot API when the backend is available.
// Backend developer: replace these functions only. Do not modify the dashboard components.

/**
 * DEMO API
 * FUTURE BACKEND ENDPOINT:
 * GET /api/farmer/offers
 *
 * Fetches buyer offers for farmer produce batches.
 */
export async function getOffers(batchId) {
  const path = batchId ? `/farmer/offers?batchId=${batchId}` : '/farmer/offers'
  return request(path, { method: 'GET' }, MOCK_OFFERS)
}
