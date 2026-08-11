import {
  LayoutDashboard,
  Package,
  TrendingUp,
  HandCoins,
  Truck,
  History,
  User,
  Settings,
  LogOut,
  X,
} from 'lucide-react'
import Logo from '../branding/Logo'
import styles from './Sidebar.module.css'

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'batches',   label: 'My Batches', icon: Package, badge: '3' },
  { id: 'prices',    label: 'Market Prices', icon: TrendingUp },
  { id: 'offers',    label: 'Buyer Offers', icon: HandCoins, badge: '5' },
  { id: 'track',     label: 'Track Produce', icon: Truck },
  { id: 'history',   label: 'Verified History', icon: History },
  { id: 'profile',   label: 'Profile', icon: User },
  { id: 'settings',  label: 'Settings', icon: Settings },
]

/**
 * Desktop & Tablet Sidebar component
 * @param {{ activeTab: string, onTabChange: (id: string) => void, onLogout: () => void, isOpenMobile?: boolean, onCloseMobile?: () => void }} props
 */
export default function Sidebar({ activeTab, onTabChange, onLogout, isOpenMobile, onCloseMobile }) {
  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div
          className={styles.overlay}
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside className={`${styles.sidebar} ${isOpenMobile ? styles.sidebarMobileOpen : ''}`}>
        {/* Header with Logo & Mobile Close */}
        <div className={styles.sidebarHeader}>
          <Logo size="md" />
          {isOpenMobile && (
            <button
              onClick={onCloseMobile}
              className={styles.closeBtn}
              aria-label="Close Sidebar"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className={styles.nav} aria-label="Farmer Dashboard Navigation">
          <ul className={styles.navList}>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id

              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      onTabChange(item.id)
                      if (onCloseMobile) onCloseMobile()
                    }}
                    className={`${styles.navBtn} ${isActive ? styles.navBtnActive : ''}`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon size={19} className={styles.navIcon} aria-hidden="true" />
                    <span className={styles.navLabel}>{item.label}</span>
                    {item.badge && (
                      <span className={`${styles.badge} ${isActive ? styles.badgeActive : ''}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Footer with Logout */}
        <div className={styles.sidebarFooter}>
          <button onClick={onLogout} className={styles.logoutBtn}>
            <LogOut size={18} className={styles.logoutIcon} aria-hidden="true" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  )
}
