import { useState, useEffect } from 'react'
import {
  Menu,
  Bell,
  Globe,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react'
import BuyerSidebar from '../components/buyer/BuyerSidebar'
import BuyerDashboardOverview from '../components/buyer/BuyerDashboardOverview'
import BuyerMarketplaceView from '../components/buyer/BuyerMarketplaceView'
import BuyerOffersView from '../components/buyer/BuyerOffersView'
import BuyerPurchasesView from '../components/buyer/BuyerPurchasesView'
import BuyerTrackOrdersView from '../components/buyer/BuyerTrackOrdersView'
import BuyerProfileView from '../components/buyer/BuyerProfileView'
import BuyerSettingsView from '../components/buyer/BuyerSettingsView'
import BuyerMobileBottomNav from '../components/buyer/BuyerMobileBottomNav'
import NotificationModal from '../components/common/NotificationModal'
import Logo from '../components/branding/Logo'
import styles from './FarmerDashboard.module.css' // Reuse layout styles

export default function BuyerDashboard({ onNavigate }) {
  const [activeTab, setActiveTab]               = useState('dashboard') // Default to Dashboard
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isNotifModalOpen, setIsNotifModalOpen]   = useState(false)
  const [language, setLanguage]                 = useState('English')
  const [toastMsg, setToastMsg]                 = useState('')

  // Hash-based routing synchronization (e.g. #buyer-marketplace, #buyer-offers, #buyer-purchases, #buyer-track, #buyer-profile, #buyer-settings)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '')
      if (hash === 'buyer-marketplace' || hash === 'marketplace') {
        setActiveTab('marketplace')
      } else if (hash === 'buyer-offers' || hash === 'offers') {
        setActiveTab('offers')
      } else if (hash === 'buyer-purchases' || hash === 'purchases') {
        setActiveTab('purchases')
      } else if (hash === 'buyer-track' || hash === 'track') {
        setActiveTab('track')
      } else if (hash === 'buyer-profile' || hash === 'profile') {
        setActiveTab('profile')
      } else if (hash === 'buyer-settings' || hash === 'settings') {
        setActiveTab('settings')
      } else if (hash === 'buyer-dashboard' || hash === 'dashboard') {
        setActiveTab('dashboard')
      }
    }

    handleHashChange()
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    if (tabId === 'dashboard') {
      window.location.hash = '#buyer-dashboard'
    } else if (tabId === 'marketplace') {
      window.location.hash = '#buyer-marketplace'
    } else if (tabId === 'offers') {
      window.location.hash = '#buyer-offers'
    } else {
      window.location.hash = `#buyer-${tabId}`
    }
  }

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang)
    setToastMsg(`Language changed to ${newLang}`)
    setTimeout(() => setToastMsg(''), 3500)
  }

  const handleLogout = () => {
    localStorage.removeItem('uzhavarsetu_user_role')
    localStorage.removeItem('uzhavarsetu_auth_status')
    if (onNavigate) {
      onNavigate('login')
    } else {
      window.location.hash = '#login'
    }
  }

  return (
    <div className={styles.dashboardContainer}>
      {/* Role-Specific Buyer Sidebar */}
      <BuyerSidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onLogout={handleLogout}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Layout Area */}
      <div className={styles.mainWrapper}>
        {/* Top Header */}
        <header className={styles.topHeader}>
          <div className={styles.headerLeft}>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={styles.menuToggleBtn}
              aria-label="Toggle Navigation Menu"
            >
              <Menu size={22} />
            </button>

            <div className={styles.greetingWrap}>
              <h1 className={styles.greetingTitle}>
                Welcome, GreenFresh Traders 👋
              </h1>
              <p className={styles.greetingSubtitle}>
                Coimbatore Central Retail Hub
              </p>
            </div>
          </div>

          <div className={styles.headerLogoWrap}>
            <Logo height={32} isLight={false} />
          </div>

          <div className={styles.headerRight}>
            <span className={styles.profileBadge}>
              <span className={styles.avatarCircle}>B</span>
              <span className={styles.verifiedText}>
                <ShieldCheck size={10} className={styles.verifiedIcon} /> Verified Buyer
              </span>
            </span>

            <button
              onClick={() => setIsNotifModalOpen(!isNotifModalOpen)}
              className={styles.notificationBtn}
              aria-label="Notifications"
            >
              <Bell size={18} />
              <span className={styles.notifDot} />
            </button>
          </div>
        </header>

        <NotificationModal
          isOpen={isNotifModalOpen}
          role="buyer"
          onClose={() => setIsNotifModalOpen(false)}
          onNavigateTab={(tab) => handleTabChange(tab)}
        />

        {/* Floating Toast Popup on Left */}
        {toastMsg && (
          <div className={styles.leftToastPopup} role="status">
            <CheckCircle2 size={18} className={styles.toastIcon} />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Dynamic Content Body Area */}
        <main className={styles.contentBody}>
          {/* TAB: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <BuyerDashboardOverview onNavigateTab={handleTabChange} />
          )}

          {/* TAB: MARKETPLACE */}
          {activeTab === 'marketplace' && (
            <BuyerMarketplaceView onNavigateTab={handleTabChange} />
          )}

          {/* TAB: MY OFFERS */}
          {activeTab === 'offers' && (
            <BuyerOffersView />
          )}

          {/* TAB: PURCHASES */}
          {activeTab === 'purchases' && (
            <BuyerPurchasesView onNavigateTab={handleTabChange} />
          )}

          {/* TAB: TRACK ORDERS */}
          {activeTab === 'track' && (
            <BuyerTrackOrdersView />
          )}

          {/* TAB: PROFILE */}
          {activeTab === 'profile' && (
            <BuyerProfileView />
          )}

          {/* TAB: SETTINGS */}
          {activeTab === 'settings' && (
            <BuyerSettingsView onLogout={handleLogout} />
          )}
        </main>

        {/* Mobile Bottom Navigation */}
        <BuyerMobileBottomNav activeTab={activeTab} onTabChange={handleTabChange} />
      </div>
    </div>
  )
}
