import { LayoutDashboard, Store, HandCoins, ShoppingBag, UserCheck } from 'lucide-react'
import styles from './BuyerMobileBottomNav.module.css'

const NAV_ITEMS = [
  { id: 'dashboard',   label: 'Home',        icon: LayoutDashboard },
  { id: 'marketplace', label: 'Marketplace', icon: Store },
  { id: 'offers',      label: 'Offers',      icon: HandCoins },
  { id: 'purchases',   label: 'Purchases',   icon: ShoppingBag },
  { id: 'profile',     label: 'Profile',     icon: UserCheck },
]

export default function BuyerMobileBottomNav({ activeTab, onTabChange }) {
  return (
    <nav className={styles.bottomNav} aria-label="Buyer Mobile Navigation">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon
        const isActive = activeTab === item.id

        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`${styles.navBtn} ${isActive ? styles.activeNavBtn : ''}`}
            aria-label={item.label}
          >
            <Icon size={20} className={styles.icon} />
            <span className={styles.label}>{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
