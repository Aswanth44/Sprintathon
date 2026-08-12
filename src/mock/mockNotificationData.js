/**
 * UzhavarSetu Centralized Notification Store with LocalStorage Persistence
 * Manages real-time notifications for Farmer and Buyer accounts.
 */

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'NOTIF-001',
    recipientRole: 'farmer',
    type: 'offer_received',
    title: 'New buyer offer received',
    message: 'FreshMart Foods submitted an offer of ₹44/kg for Tomato (UZH-TOM-00128).',
    batchId: 'UZH-TOM-00128',
    offerId: 'OFF-001',
    targetTab: 'offers',
    unread: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: 'NOTIF-002',
    recipientRole: 'buyer',
    type: 'counter_offer',
    title: 'Counter offer received',
    message: 'Farmer Aswanth Kumar sent a counter offer of ₹46/kg for Tomato (UZH-TOM-00128).',
    batchId: 'UZH-TOM-00128',
    offerId: 'OFF-001',
    targetTab: 'offers',
    unread: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 'NOTIF-003',
    recipientRole: 'buyer',
    type: 'offer_accepted',
    title: 'Your offer was accepted',
    message: 'Offer for 800 kg Onion (UZH-ONI-00094) @ ₹38/kg accepted by farmer!',
    batchId: 'UZH-ONI-00094',
    offerId: 'OFF-002',
    purchaseId: 'UZH-PUR-00032',
    targetTab: 'purchases',
    unread: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
]

export function getPersistedNotifications() {
  try {
    const saved = localStorage.getItem('uzhavarsetu_notifications')
    if (saved) return JSON.parse(saved)
    localStorage.setItem('uzhavarsetu_notifications', JSON.stringify(INITIAL_NOTIFICATIONS))
    return INITIAL_NOTIFICATIONS
  } catch {
    return INITIAL_NOTIFICATIONS
  }
}

export function savePersistedNotifications(notifications) {
  try {
    localStorage.setItem('uzhavarsetu_notifications', JSON.stringify(notifications))
  } catch (err) {
    console.error('Failed to save notifications:', err)
  }
}
