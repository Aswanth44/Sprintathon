import {
  LayoutDashboard,
  Store,
  HandCoins,
  ShoppingBag,
  Truck,
  UserCheck,
  Settings,
  LogOut,
  X,
} from 'lucide-react'
import Logo from '../branding/Logo'
import styles from './BuyerSidebar.module.css'

const BUYER_NAV_ITEMS = [
  { id: 'dashboard',   label: 'Dashboard',   icon: LayoutDashboard },
  { id: 'marketplace', label: 'Marketplace', icon: Store, badge: 'NEW' },
  { id: 'offers',      label: 'My Offers',   icon: HandCoins },
  { id: 'purchases',   label: 'Purchases',   icon: ShoppingBag },
  { id: 'track',       label: 'Track Orders', icon: Truck },
  { id: 'profile',     label: 'Profile',     icon: UserCheck },
  { id: 'settings',    label: 'Settings',    icon: Settings },
]

/**
 * Role-Isolated Buyer Sidebar Navigation Component
 */
export default function BuyerSidebar({
  activeTab,
  onTabChange,
  onLogout,
  isOpen = false,
  onClose,
}) {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && <div className={styles.backdrop} onClick={onClose} aria-hidden="true" />}

      <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
        {/* Brand Header */}
        <div className={styles.brandHeader}>
          <Logo height={34} isLight={false} />
          {onClose && (
            <button onClick={onClose} className={styles.closeBtn} aria-label="Close sidebar">
              <X size={20} />
            </button>
          )}
        </div>

        {/* Role Tag */}
        <div className={styles.roleTagWrap}>
          <span className={styles.roleTag}>Verified Sourcing Buyer</span>
        </div>

        {/* Navigation Items */}
        <nav className={styles.navGroup} aria-label="Buyer Navigation">
          {BUYER_NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id

            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id)
                  if (onClose) onClose()
                }}
                className={`${styles.navItem} ${isActive ? styles.activeNavItem : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon size={18} className={styles.navIcon} />
                <span className={styles.navLabel}>{item.label}</span>
                {item.badge && (
                  <span className={styles.badge}>{item.badge}</span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Sign Out Footer */}
        <div className={styles.footerWrap}>
          <button
            onClick={onLogout}
            className={styles.logoutBtn}
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  )
}
