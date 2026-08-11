/**
 * Central API Configuration
 * Switch `USE_DEMO_API` to `false` when connecting to the real Spring Boot backend.
 */
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8080/api',
  USE_DEMO_API: true, // Set to false when Spring Boot backend is live at BASE_URL
  SIMULATED_DELAY_MS: 400, // Network latency simulation for demo API
}
