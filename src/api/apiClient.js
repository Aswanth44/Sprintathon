import { API_CONFIG } from '../config/apiConfig'

/**
 * Reusable network latency simulator for mock REST API endpoints.
 * @param {number} ms - Milliseconds of delay (default 300ms)
 * @returns {Promise<void>}
 */
export function delay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Base API Client Helper
 * Handles switching between Demo Mock REST API (Promises + delay)
 * and Real Backend HTTP calls (fetch) to Spring Boot at API_CONFIG.BASE_URL.
 */
export async function request(path, options = {}, demoFallbackData = null) {
  if (API_CONFIG?.USE_DEMO_API ?? true) {
    await delay(API_CONFIG?.SIMULATED_DELAY_MS || 300)
    return demoFallbackData
  }

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
