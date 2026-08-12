/**
 * Central API Configuration
 * Switch `USE_DEMO_API` to `false` when connecting to the real Spring Boot backend.
 * AGMARKNET OGD Environment configuration for official Government of India market prices.
 */
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8080/api',
  USE_DEMO_API: true, // Set to false when Spring Boot backend is live at BASE_URL
  SIMULATED_DELAY_MS: 300, // Network latency simulation for demo API
  AGMARKNET_API_URL: import.meta.env?.VITE_AGMARKNET_API_URL || 'https://api.data.gov.in/resource/9ef74130-e098-458f-970d-aea50ce8572e',
  AGMARKNET_API_KEY: import.meta.env?.VITE_AGMARKNET_API_KEY || '',
  CACHE_DURATION_MS: 10 * 60 * 1000, // 10 minutes cache
}
