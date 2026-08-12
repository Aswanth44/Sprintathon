/**
 * UzhavarSetu Telecom Service Abstraction (SMS / USSD Gateway Boundary)
 * 
 * Handles simulated SMS notifications and USSD feature-phone menu requests.
 * 
 * // TODO: Connect SMS/USSD gateway through Spring Boot in production.
 */

/**
 * Sends SMS notification to a registered farmer or buyer mobile number.
 * 
 * // SPRING BOOT ENDPOINT: POST /api/telecom/sms
 * // Controller: TelecomController.sendSMS(SMSRequest request)
 * // Real implementation: integrates with Twilio/D7Networks SMS Gateway via Spring Boot.
 */
export async function sendFarmerSMS(mobileNumber, message) {
  console.info(`[SMS Gateway -> ${mobileNumber}]: ${message}`)
  return {
    success: true,
    messageId: `SMS-${Date.now()}`,
    status: 'DELIVERED',
    recipient: mobileNumber,
  }
}

/**
 * Handles USSD feature phone menu request (e.g. *141# for market prices).
 * 
 * // SPRING BOOT ENDPOINT: POST /api/telecom/ussd
 * // Controller: TelecomController.handleUSSD(USSDRequest request)
 * // Real implementation: parses USSD session input from Telecom Aggregator.
 */
export async function handleUSSDRequest(input) {
  const code = (input || '').trim()

  if (code.includes('1') || code.toLowerCase().includes('price')) {
    return {
      sessionEnded: true,
      menuText: 'UzhavarSetu Mandi Benchmark:\n1. Tomato: Rs.42/kg\n2. Onion: Rs.36/kg\n3. Potato: Rs.30/kg',
    }
  }

  return {
    sessionEnded: false,
    menuText: 'Welcome to UzhavarSetu USSD:\n1. Market Prices\n2. Batch Status\n3. Active Offers',
  }
}
