/**
 * Reusable Formatters for UzhavarSetu
 */

/**
 * Formats enum-style batch status strings into human-readable labels.
 * Example: "IN_TRANSIT" -> "In Transit"
 *
 * @param {string} status - Raw API status enum
 * @returns {string} Human-readable status label
 */
export function formatBatchStatus(status) {
  if (!status) return 'Unknown'

  const STATUS_MAP = {
    IN_TRANSIT: 'In Transit',
    WAREHOUSE_STORED: 'Warehouse Stored',
    PICKUP_SCHEDULED: 'Pickup Scheduled',
    CREATED: 'Created',
    PICKUP_COMPLETED: 'Pickup Completed',
    DELIVERED: 'Delivered',
    CANCELLED: 'Cancelled',
  }

  if (STATUS_MAP[status]) {
    return STATUS_MAP[status]
  }

  // Fallback: convert SNAKE_CASE to Title Case
  return status
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Formats YYYY-MM-DD or ISO date strings into human-readable format.
 * Example: "2026-08-10" -> "10 Aug 2026"
 *
 * @param {string} dateStr - Date string from API
 * @returns {string} Formatted date (e.g. "10 Aug 2026")
 */
export function formatDate(dateStr) {
  if (!dateStr) return '10 Aug 2026'
  if (dateStr === 'Today') return '10 Aug 2026'

  try {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return dateStr

    const day = date.getDate().toString().padStart(2, '0')
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ]
    const month = monthNames[date.getMonth()]
    const year = date.getFullYear()

    return `${day} ${month} ${year}`
  } catch {
    return dateStr
  }
}
