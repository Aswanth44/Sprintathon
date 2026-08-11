import { API_CONFIG } from '../config/apiConfig'

/**
 * Base API Client Helper
 * Handles switching between Demo Mock API (Promises + setTimeout)
 * and Real Backend HTTP calls (fetch) to Spring Boot at API_CONFIG.BASE_URL.
 */
export async function request(path, options = {}, demoFallbackData = null) {
  // If USE_DEMO_API is enabled, simulate backend network request
  if (API_CONFIG.USE_DEMO_API) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(demoFallbackData)
      }, API_CONFIG.SIMULATED_DELAY_MS)
    })
  }

  // Real HTTP request to Spring Boot backend
  const url = `${API_CONFIG.BASE_URL}${path}`
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`API Error ${response.status}: ${response.statusText}`)
  }

  return response.json()
}
