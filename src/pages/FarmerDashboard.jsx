import { useState, useEffect } from 'react'
import {
  Menu,
  Bell,
  MapPin,
  CheckCircle2,
  Plus,
  Loader2,
  Package,
  Globe,
} from 'lucide-react'
import Sidebar from '../components/dashboard/Sidebar'
import MobileBottomNav from '../components/dashboard/MobileBottomNav'
import SummaryCard from '../components/dashboard/SummaryCard'
import FairPriceCard from '../components/dashboard/FairPriceCard'
import BatchCard from '../components/dashboard/BatchCard'
import OfferCard from '../components/dashboard/OfferCard'
import QuickActions from '../components/dashboard/QuickActions'
import RecentActivity from '../components/dashboard/RecentActivity'
import CreateBatchModal from '../components/dashboard/CreateBatchModal'
import SettingsView from '../components/dashboard/SettingsView'
import ProfileView from '../components/dashboard/ProfileView'
import MarketPricesView from '../components/dashboard/MarketPricesView'
import CreateBatchPage from '../components/dashboard/CreateBatchPage'
import BatchQrView from '../components/dashboard/BatchQrView'
import BatchDetailsView from '../components/dashboard/BatchDetailsView'
import TrackJourneyView from '../components/dashboard/TrackJourneyView'
import Logo from '../components/branding/Logo'

// API Services — Centralized API Layer
import { getDashboard } from '../api/farmerApi'
import { getBatches } from '../api/batchApi'
import { getMarketPrices } from '../api/marketApi'
import { getOffers } from '../api/offerApi'
import { getPersistedProfile } from '../mock/mockFarmerData'

import styles from './FarmerDashboard.module.css'

/**
 * Farmer Dashboard Module Component
 * Consumes data exclusively through the API Layer (farmerApi, batchApi, marketApi, offerApi).
 * Ready for backend handoff to Spring Boot.
 *
 * @param {{ onNavigate: (view: string) => void }} props
 */
export default function FarmerDashboard({ onNavigate }) {
  const [activeTab, setActiveTab]                 = useState('dashboard')
  const [isMobileMenuOpen, setIsMobileMenuOpen]   = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [subViewData, setSubViewData]             = useState(null)

  // API State
  const [loading, setLoading]                     = useState(true)
  const [dashboardData, setDashboardData]         = useState(null)
  const [batches, setBatches]                     = useState([])
  const [marketPrices, setMarketPrices]           = useState([])
  const [offers, setOffers]                       = useState([])

  // Global Language & Left Toast Popup State
  const [language, setLanguage]                   = useState('English')
  const [toastMsg, setToastMsg]                   = useState('')

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang)
    setToastMsg(`Language changed to ${newLang}`)
    setTimeout(() => setToastMsg(''), 3500)
  }

  // Hash-based routing synchronization (e.g. #/market-prices)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash
      if (hash === '#/market-prices' || hash === '#/prices') {
        setActiveTab('prices')
      } else if (hash === '#/batches' || hash === '#/track') {
        setActiveTab('batches')
      } else if (hash === '#/offers') {
        setActiveTab('offers')
      } else if (hash === '#/history') {
        setActiveTab('history')
      } else if (hash === '#/profile') {
        setActiveTab('profile')
      } else if (hash === '#/settings') {
        setActiveTab('settings')
      } else if (hash === '#/dashboard') {
        setActiveTab('dashboard')
      }
    }

    handleHashChange()
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  // DEMO API & FUTURE BACKEND INTEGRATION POINT:
  // Loads all dashboard data asynchronously via API Service Layer
  useEffect(() => {
    let isMounted = true

    async function loadData() {
      setLoading(true)
      try {
        const [dashResult, batchesResult, marketResult, offersResult] = await Promise.allSettled([
          getDashboard(),
          getBatches(),
          getMarketPrices(),
          getOffers(),
        ])

        if (!isMounted) return

        if (dashResult.status === 'fulfilled' && dashResult.value) {
          setDashboardData(dashResult.value)
        }
        if (batchesResult.status === 'fulfilled' && Array.isArray(batchesResult.value)) {
          setBatches(batchesResult.value)
        }
        if (marketResult.status === 'fulfilled' && Array.isArray(marketResult.value)) {
          setMarketPrices(marketResult.value)
        }
        if (offersResult.status === 'fulfilled' && Array.isArray(offersResult.value)) {
          setOffers(offersResult.value)
        }
      } catch (err) {
        console.error('Failed to fetch Farmer Dashboard API data:', err)
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadData()

    return () => {
      isMounted = false
    }
  }, [])

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    setIsMobileMenuOpen(false)
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }

  const handleNavigateSubView = (tabId, extraData = null) => {
    if (extraData) {
      setSubViewData(extraData)
    }
    handleTabChange(tabId)
  }

  // Refreshes produce batches list when a new batch is created
  const handleBatchCreated = async (newBatch) => {
    if (newBatch) {
      setBatches((prev) => [newBatch, ...prev.filter((b) => b.batchId !== newBatch.batchId)])
    }
    try {
      const refreshedBatches = await getBatches()
      setBatches(refreshedBatches)
    } catch {
      /* fallback */
    }
  }

  const handleLogout = () => {
    if (onNavigate) {
      onNavigate('login')
    }
  }

  const handleProfileUpdated = (updatedProfile) => {
    if (dashboardData) {
      setDashboardData({
        ...dashboardData,
        farmer: {
          ...dashboardData.farmer,
          name: updatedProfile.name || dashboardData.farmer.name,
          mobile: updatedProfile.mobile || dashboardData.farmer.mobile,
          village: updatedProfile.village || dashboardData.farmer.village,
          district: updatedProfile.district || dashboardData.farmer.district,
          state: updatedProfile.state || dashboardData.farmer.state,
          farmSize: updatedProfile.farmSize || dashboardData.farmer.farmSize,
          primaryCrops: updatedProfile.primaryCrops || dashboardData.farmer.primaryCrops,
        },
      })
    }
  }

  const savedProfile = getPersistedProfile()
  const farmerProfile = {
    ...savedProfile,
    ...(dashboardData?.farmer || {}),
    name: savedProfile?.name || savedProfile?.fullName || dashboardData?.farmer?.name || 'Aswanth',
  }

  const safeBatches = Array.isArray(batches) ? batches : []
  const safeOffers = Array.isArray(offers) ? offers : []

  const summary = dashboardData?.summary || {
    activeBatchesCount: safeBatches.length || 3,
    totalOffersCount: safeOffers.length || 5,
    estimatedPayout: '₹ 1,42,000',
    fairPriceRange: '₹38 - ₹45 / kg',
  }

  const primaryBatch = safeBatches[0] || {
    batchId: 'UZH-TOM-00128',
    crop: 'Tomato',
    quantity: '500 kg',
    quality: 'Grade A',
    status: 'IN_TRANSIT',
    harvestDate: '2026-08-10',
  }

  const topOffer = safeOffers[0] || {
    buyerName: 'Coimbatore Fresh Retail',
    location: 'Coimbatore, TN',
    offeredPrice: 42,
    marketPrice: 38,
    transportDeduction: 2,
    netPayout: 40,
    crop: 'Tomato',
  }

  return (
    <div className={styles.dashboardContainer}>
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        batchesCount={batches.length}
        offersCount={offers.length}
        onLogout={handleLogout}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Layout Area */}
      <div className={styles.mainWrapper}>
        {/* Global Dashboard Header */}
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
                Welcome, {farmerProfile.name} 👋
              </h1>
              <p className={styles.greetingSubtitle}>
                <MapPin size={13} /> {farmerProfile.location || `${farmerProfile.village || 'Coimbatore'}, ${farmerProfile.state || 'Tamil Nadu'}`}
              </p>
            </div>
          </div>

          <div className={styles.headerLogoWrap}>
            <Logo height={32} isLight={false} />
          </div>

          <div className={styles.headerRight}>
            {/* Language Selector Dropdown */}
            <div className={styles.langSelectWrap}>
              <Globe size={15} className={styles.globeIcon} />
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className={styles.langSelect}
                aria-label="Select Language"
              >
                <option value="English">English</option>
                <option value="தமிழ்">தமிழ் (Tamil)</option>
              </select>
            </div>

            <span className={styles.profileBadge}>
              <span className={styles.avatarCircle}>
                {farmerProfile.name ? farmerProfile.name.charAt(0) : 'A'}
              </span>
              <span className={styles.verifiedText}>
                <CheckCircle2 size={10} className={styles.verifiedIcon} /> Verified Farmer
              </span>
            </span>

            <button className={styles.notificationBtn} aria-label="Notifications">
              <Bell size={18} />
              <span className={styles.notifDot} />
            </button>
          </div>
        </header>

        {/* Floating Toast Popup on Left */}
        {toastMsg && (
          <div className={styles.leftToastPopup} role="status">
            <CheckCircle2 size={18} className={styles.toastIcon} />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Dynamic Content Body Area */}
        <main className={styles.contentBody}>
          {loading ? (
            <div className={styles.loadingContainer}>
              <Loader2 size={36} className={styles.spinner} />
              <p className={styles.loadingText}>Loading UzhavarSetu Dashboard...</p>
            </div>
          ) : (
            <>
              {/* TAB: DASHBOARD HOME */}
              {activeTab === 'dashboard' && (
                <div className={styles.dashboardGrid}>
                  {/* Summary Metric Cards */}
                  <div className={styles.summaryGrid}>
                    <SummaryCard
                      title="In Transit & Stored"
                      value={summary.inTransitAndStored || 5}
                      subtext="Batches currently moving/stored"
                      icon="Truck"
                    />
                    <SummaryCard
                      title="Pending Review"
                      value={summary.pendingReview || 2}
                      subtext="Batches awaiting verification"
                      icon="Package"
                    />
                    <SummaryCard
                      title="Highest Buyer Bid"
                      value={`₹${summary.highestBuyerBid || 44}/${summary.highestBuyerBidUnit || 'kg'}`}
                      subtext={summary.highestBuyerBidCrop || 'Tomato'}
                      icon="HandCoins"
                    />
                    <SummaryCard
                      title="Govt. Mandi Index"
                      value={`₹${summary.mandiIndex || 42}/${summary.mandiIndexUnit || 'kg'}`}
                      subtext={`${summary.mandiIndexCrop || 'Tomato'} • ${summary.mandiIndexLocation || 'Coimbatore'}`}
                      icon="TrendingUp"
                    />
                  </div>

                  {/* Main Two Column Layout */}
                  <div className={styles.twoColumnGrid}>
                    {/* Left Column */}
                    <div className={styles.columnLeft}>
                      <QuickActions
                        onCreateBatchClick={() => handleTabChange('create-batch')}
                        onViewPricesClick={() => handleTabChange('prices')}
                        onCompareOffersClick={() => handleTabChange('offers')}
                        onTrackProduceClick={() => handleTabChange('track')}
                      />

                      <FairPriceCard
                        pricesList={marketPrices}
                        onViewAllClick={() => handleTabChange('prices')}
                      />

                      <BatchCard
                        batch={primaryBatch}
                        onTrackClick={(batchId) => handleNavigateSubView('track-journey', { batchId, batch: primaryBatch })}
                      />
                    </div>

                    {/* Right Column */}
                    <div className={styles.columnRight}>
                      <OfferCard
                        offer={topOffer}
                        totalOffersCount={offers.length}
                        onViewOffersClick={() => handleTabChange('offers')}
                      />
                      <RecentActivity />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: CREATE NEW BATCH */}
              {activeTab === 'create-batch' && (
                <CreateBatchPage
                  onBatchCreated={handleBatchCreated}
                  onNavigateView={handleNavigateSubView}
                />
              )}

              {/* TAB: BATCH QR CODE VIEW */}
              {activeTab === 'batch-qr' && (
                <BatchQrView
                  batch={subViewData?.batch || primaryBatch}
                  onNavigateView={handleNavigateSubView}
                />
              )}

              {/* TAB: BATCH DETAILS VIEW */}
              {activeTab === 'batch-details' && (
                <BatchDetailsView
                  batchId={subViewData?.batchId || primaryBatch?.batchId}
                  batch={subViewData?.batch}
                  onNavigateView={handleNavigateSubView}
                />
              )}

              {/* TAB: MY BATCHES */}
              {activeTab === 'batches' && (
                <div className={styles.tabSection}>
                  <div className={styles.tabHeaderRow}>
                    <div>
                      <h2 className={styles.tabTitle}>My Produce Batches</h2>
                      <p className={styles.tabSubtitle}>Manage and track all registered harvest batches</p>
                    </div>
                    <button
                      onClick={() => handleTabChange('create-batch')}
                      className={styles.primaryActionBtn}
                    >
                      <Plus size={18} /> Create New Batch
                    </button>
                  </div>

                  {batches.length === 0 ? (
                    <div className={styles.emptyState}>
                      <Package size={48} className={styles.emptyIcon} />
                      <h3 className={styles.emptyTitle}>No produce batches yet</h3>
                      <p className={styles.emptyDesc}>
                        Create your first batch to start tracking your produce.
                      </p>
                      <button
                        onClick={() => handleTabChange('create-batch')}
                        className={styles.primaryActionBtn}
                      >
                        <Plus size={18} /> Create New Batch
                      </button>
                    </div>
                  ) : (
                    <div className={styles.batchesListGrid}>
                      {batches.map((b) => (
                        <BatchCard
                          key={b.batchId}
                          batch={b}
                          onTrackClick={(batchId) => handleNavigateSubView('track-journey', { batchId, batch: b })}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB: MARKET PRICES */}
              {activeTab === 'prices' && (
                <MarketPricesView />
              )}

              {/* TAB: BUYER OFFERS */}
              {activeTab === 'offers' && (
                <div className={styles.tabSection}>
                  <div className={styles.tabHeaderRow}>
                    <div>
                      <h2 className={styles.tabTitle}>Buyer Offers &amp; Bids</h2>
                      <p className={styles.tabSubtitle}>Compare net payouts after transport deductions</p>
                    </div>
                  </div>
                  <OfferCard offer={topOffer} totalOffersCount={offers.length} onViewOffersClick={() => {}} />
                </div>
              )}

              {/* TAB: DEDICATED BATCH JOURNEY VIEW */}
              {activeTab === 'track-journey' && (
                <TrackJourneyView
                  batchId={subViewData?.batchId || primaryBatch?.batchId}
                  batch={subViewData?.batch || primaryBatch}
                  onNavigateView={handleNavigateSubView}
                />
              )}

              {/* TAB: VERIFIED HISTORY */}
              {activeTab === 'history' && (
                <div className={styles.tabSection}>
                  <div className={styles.tabHeaderRow}>
                    <div>
                      <h2 className={styles.tabTitle}>Verified Produce History</h2>
                      <p className={styles.tabSubtitle}>Past completed transactions and payouts</p>
                    </div>
                  </div>
                  <RecentActivity />
                </div>
              )}

              {/* TAB: FARMER PROFILE */}
              {activeTab === 'profile' && (
                <ProfileView onProfileUpdated={handleProfileUpdated} />
              )}

              {/* TAB: APPLICATION SETTINGS */}
              {activeTab === 'settings' && (
                <SettingsView onLogout={handleLogout} />
              )}
            </>
          )}
        </main>

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav activeTab={activeTab} onTabChange={handleTabChange} />
      </div>

      {/* Create Batch Modal */}
      <CreateBatchModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onBatchCreated={handleBatchCreated}
      />
    </div>
  )
}
