import { delay, request } from './apiClient'

/**
 * // SPRING BOOT ENDPOINT: POST /api/auth/login
 * // Controller: AuthController.login(LoginRequest request)
 * // Request DTO:
 * // {
 * //     email: String,
 * //     password: String
 * // }
 * // Response DTO:
 * // {
 * //     token: String,
 * //     role: "farmer" | "buyer",
 * //     user: Object
 * // }
 * // Real implementation: validates credentials against PostgreSQL and issues a JWT token.
 */
export async function login(credentials) {
  await delay(300)

  const email = (credentials?.email || '').toLowerCase()
  const role = credentials?.role || (email.includes('buyer') ? 'buyer' : 'farmer')

  const demoResponse = {
    success: true,
    token: `demo-jwt-token-${Date.now()}`,
    role,
    user: {
      id: role === 'buyer' ? 'BUYER-001' : 'UZH-FMR-000128',
      name: credentials?.name || (role === 'buyer' ? 'GreenFresh Traders' : 'Aswanth Kumar'),
      email: credentials?.email || (role === 'buyer' ? 'procurement@greenfresh.com' : 'aswanth@uzhavarsetu.in'),
      role,
    },
  }

  return request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }, demoResponse)
}
