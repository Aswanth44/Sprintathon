import { useState, useEffect } from 'react'
import {
  Menu,
  Bell,
  MapPin,
  CheckCircle2,
  Plus,
  Loader2,
  Package,
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
import CreateBatchPage from '../components/dashboard/CreateBatchPage'
import BatchQrView from '../components/dashboard/BatchQrView'
import BatchDetailsView from '../components/dashboard/BatchDetailsView'
import Logo from '../components/branding/Logo'

// API Services — Centralized API Layer
import { getDashboard } from '../api/farmerApi'
import { getBatches } from '../api/batchApi'
import { getMarketPrices } from '../api/marketApi'
import { getOffers } from '../api/offerApi'

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

  // DEMO API & FUTURE BACKEND INTEGRATION POINT:
  // Loads all dashboard data asynchronously via API Service Layer
  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const [dashRes, batchesRes, marketRes, offersRes] = await Promise.all([
          getDashboard(),
          getBatches(),
          getMarketPrices(),
          getOffers(),
        ])
        setDashboardData(dashRes)
        setBatches(batchesRes)
        setMarketPrices(marketRes)
        setOffers(offersRes)
      } catch (err) {
        console.error('Failed to fetch Farmer Dashboard API data:', err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
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

  const farmerProfile = dashboardData?.farmer || {
    name: 'Aswanth',
    mobile: '+91 98765 43210',
    village: 'Coimbatore',
    district: 'Coimbatore',
    state: 'Tamil Nadu',
    farmSize: '5.5 acres',
    primaryCrops: ['Tomato', 'Onion', 'Coconut'],
    verified: true,
  }

  const summary = dashboardData?.summary || {
    activeBatchesCount: batches.length || 3,
    totalOffersCount: offers.length || 5,
    estimatedPayout: '₹ 1,42,000',
    fairPriceRange: '₹38 - ₹45 / kg',
  }

  const primaryBatch = batches[0] || {
    batchId: 'UZH-TOM-00128',
    crop: 'Tomato',
    quantity: '500 kg',
    quality: 'Grade A',
    status: 'IN_TRANSIT',
    harvestDate: '2026-08-10',
  }

  const topOffer = offers[0] || {
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
                        onTrackClick={() => handleTabChange('track')}
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
                          onTrackClick={(batchId) => handleNavigateSubView('batch-details', { batchId, batch: b })}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB: MARKET PRICES */}
              {activeTab === 'prices' && (
                <div className={styles.tabSection}>
                  <div className={styles.tabHeaderRow}>
                    <div>
                      <h2 className={styles.tabTitle}>Live Market &amp; Mandi Prices</h2>
                      <p className={styles.tabSubtitle}>Government benchmark prices across Tamil Nadu mandis</p>
                    </div>
                  </div>
                  <FairPriceCard pricesList={marketPrices} />
                </div>
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

              {/* TAB: TRACK PRODUCE */}
              {activeTab === 'track' && (
                <div className={styles.tabSection}>
                  <div className={styles.tabHeaderRow}>
                    <div>
                      <h2 className={styles.tabTitle}>Track Produce Journey</h2>
                      <p className={styles.tabSubtitle}>Verified farm-to-market chain traceability</p>
                    </div>
                  </div>
                  <BatchCard
                    batch={primaryBatch}
                    onTrackClick={(batchId) => handleNavigateSubView('batch-details', { batchId, batch: primaryBatch })}
                  />
                </div>
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

              {/* TAB: PROFILE & SETTINGS */}
              {(activeTab === 'profile' || activeTab === 'settings') && (
                <SettingsView
                  farmerProfile={farmerProfile}
                  onProfileUpdated={handleProfileUpdated}
                  onLogout={handleLogout}
                />
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
