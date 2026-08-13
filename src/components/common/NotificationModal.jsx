import { useState, useEffect } from 'react'
import { Bell, X, CheckCheck, Circle, Clock, ArrowRight, ShieldCheck } from 'lucide-react'
import { getNotifications, markAsRead, markAllAsRead } from '../../api/notificationApi'
import styles from './NotificationModal.module.css'

export default function NotificationModal({ isOpen, role = 'farmer', onClose, onNavigateTab }) {
  const [notifications, setNotifications] = useState([])

  const loadNotifs = () => {
    const list = getNotifications(role)
    setNotifications(list)
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      loadNotifs()
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen, role])

  if (!isOpen) return null

  const handleItemClick = (item) => {
    markAsRead(item.id)
    loadNotifs()
    onClose()
    if (onNavigateTab && item.targetTab) {
      onNavigateTab(item.targetTab)
    }
  }

  const handleMarkAllRead = () => {
    markAllAsRead(role)
    loadNotifs()
  }

  const unreadCount = notifications.filter((n) => n.unread).length

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.headerTitleWrap}>
            <Bell className={styles.headerIcon} size={20} />
            <div>
              <h2 className={styles.modalTitle}>Notifications</h2>
              <span className={styles.subText}>{unreadCount} unread alerts</span>
            </div>
          </div>

          <div className={styles.headerRight}>
            {unreadCount > 0 && (
              <button onClick={handleMarkAllRead} className={styles.markAllBtn}>
                <CheckCheck size={14} /> Mark all read
              </button>
            )}
            <button onClick={onClose} className={styles.closeBtn} aria-label="Close modal">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className={styles.modalBody}>
          {notifications.length === 0 ? (
            <div className={styles.emptyState}>
              <Bell size={36} className={styles.emptyIcon} />
              <p>No notifications yet.</p>
            </div>
          ) : (
            <div className={styles.list}>
              {notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={`${styles.itemCard} ${item.unread ? styles.itemUnread : ''}`}
                >
                  <div className={styles.itemHeader}>
                    <div className={styles.titleWrap}>
                      {item.unread ? (
                        <Circle size={10} className={styles.unreadDot} />
                      ) : (
                        <CheckCheck size={14} className={styles.readCheck} />
                      )}
                      <strong className={styles.itemTitle}>{item.title}</strong>
                    </div>
                    <span className={styles.itemTime}>
                      <Clock size={11} /> {item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                    </span>
                  </div>

                  <p className={styles.itemMessage}>{item.message}</p>

                  <div className={styles.itemFooter}>
                    {item.batchId && <span className={styles.tag}>Batch: {item.batchId}</span>}
                    <span className={styles.navLink}>View <ArrowRight size={12} /></span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={styles.modalFooter}>
          <button onClick={onClose} className={styles.doneBtn}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
