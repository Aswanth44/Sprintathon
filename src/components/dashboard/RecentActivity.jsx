import { CheckCircle2, Bell, Clock } from 'lucide-react'
import { RECENT_ACTIVITIES } from '../../data/mockFarmerData'
import styles from './RecentActivity.module.css'

export default function RecentActivity() {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.headerTitleWrap}>
          <Clock size={18} className={styles.headerIcon} />
          <h2 className={styles.cardTitle}>Recent Activity</h2>
        </div>
        <span className={styles.badge}>Live Feed</span>
      </div>

      <ul className={styles.activityList}>
        {RECENT_ACTIVITIES.map((act) => (
          <li key={act.id} className={styles.activityItem}>
            <div className={`${styles.iconWrap} ${act.type === 'offer' ? styles.iconOffer : styles.iconSuccess}`}>
              {act.type === 'offer' ? (
                <Bell size={15} />
              ) : (
                <CheckCircle2 size={15} />
              )}
            </div>
            <div className={styles.itemContent}>
              <div className={styles.itemTitle}>{act.title}</div>
              <div className={styles.itemDesc}>{act.desc}</div>
            </div>
            <span className={styles.timestamp}>{act.timestamp}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
