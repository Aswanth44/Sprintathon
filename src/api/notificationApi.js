import { getPersistedNotifications, savePersistedNotifications } from '../mock/mockNotificationData'

/**
 * Gets notifications for a specific user role (farmer or buyer).
 */
export function getNotifications(role = 'farmer') {
  const all = getPersistedNotifications()
  return all.filter((n) => n.recipientRole === role)
}

/**
 * Adds a new notification to the store.
 */
export function addNotification(notificationData) {
  const all = getPersistedNotifications()
  const newNotif = {
    id: `NOTIF-00${all.length + 1}`,
    unread: true,
    createdAt: new Date().toISOString(),
    ...notificationData,
  }

  const updated = [newNotif, ...all]
  savePersistedNotifications(updated)
  return newNotif
}

/**
 * Marks a single notification as read.
 */
export function markAsRead(id) {
  const all = getPersistedNotifications()
  const updated = all.map((n) => (n.id === id ? { ...n, unread: false } : n))
  savePersistedNotifications(updated)
  return updated
}

/**
 * Marks all notifications for a role as read.
 */
export function markAllAsRead(role = 'farmer') {
  const all = getPersistedNotifications()
  const updated = all.map((n) => (n.recipientRole === role ? { ...n, unread: false } : n))
  savePersistedNotifications(updated)
  return updated
}
