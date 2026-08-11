import { LayoutDashboard, Package, TrendingUp, HandCoins, User } from 'lucide-react'
import styles from './MobileBottomNav.module.css'

const MOBILE_NAV_ITEMS = [
  { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
  { id: 'batches',   label: 'Batches', icon: Package, badge: '3' },
  { id: 'prices',    label: 'Prices', icon: TrendingUp },
  { id: 'offers',    label: 'Offers', icon: HandCoins, badge: '5' },
  { id: 'profile',   label: 'Profile', icon: User },
]

/**
 * Touch-friendly Mobile Bottom Navigation Bar (visible <= 768px)
 * @param {{ activeTab: string, onTabChange: (id: string) => void }} props
 */
export default function MobileBottomNav({ activeTab, onTabChange }) {
  return (
    <nav className={styles.bottomNav} aria-label="Mobile Bottom Navigation">
      <div className={styles.navRow}>
        {MOBILE_NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`${styles.itemBtn} ${isActive ? styles.itemBtnActive : ''}`}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className={styles.iconWrap}>
                <Icon size={20} className={styles.icon} aria-hidden="true" />
                {item.badge && <span className={styles.badge}>{item.badge}</span>}
              </div>
              <span className={styles.label}>{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
