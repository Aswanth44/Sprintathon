import { useState, useEffect } from 'react'
import {
  Menu,
  Bell,
  MapPin,
  CheckCircle2,
  Plus,
  Loader2,
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
        console.error('Failed to load dashboard API data:', err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleLogout = () => {
    onNavigate('login')
  }

  const handleBatchCreated = (newBatchObj) => {
    if (newBatchObj) {
      setBatches((prev) => [newBatchObj, ...prev])
    }
  }

  // Extracted values from API responses
  const farmerProfile = dashboardData?.farmer || {
    name: 'Aswanth',
    location: 'Coimbatore, Tamil Nadu',
    status: 'Verified Farmer',
    farmerId: 'FARM-TN-3789',
    phone: '+91 98765 43210',
    primaryCrop: 'Tomato',
    farmSize: '5.5 Acres',
    rating: 4.9,
    totalBatchesSold: 24,
  }

  const summary = dashboardData?.summary || {
    marketPrice: 42,
    activeBatches: batches.length || 3,
    buyerOffers: offers.length || 5,
    inTransit: 2,
  }

  const summaryCardsData = [
    {
      id: 'market-price',
      title: "Today's Market Price",
      value: `₹${summary.marketPrice}/kg`,
      subtext: 'Tomato (Grade A)',
      trend: '+6.2%',
      trendPositive: true,
      icon: 'TrendingUp',
      accentColor: 'var(--color-gold)',
      bgColor: 'rgba(212, 160, 23, 0.1)',
    },
    {
      id: 'active-batches',
      title: 'Active Batches',
      value: `${batches.length || summary.activeBatches}`,
      subtext: '500 kg in transit',
      trend: '2 pending pickup',
      trendPositive: true,
      icon: 'Package',
      accentColor: 'var(--color-green-mid)',
      bgColor: 'rgba(45, 106, 79, 0.1)',
    },
    {
      id: 'buyer-offers',
      title: 'Buyer Offers',
      value: `${offers.length || summary.buyerOffers}`,
      subtext: 'Top offer ₹44/kg',
      trend: '+2 new today',
      trendPositive: true,
      icon: 'HandCoins',
      accentColor: '#2b6cb0',
      bgColor: 'rgba(43, 108, 176, 0.1)',
    },
    {
      id: 'in-transit',
      title: 'Produce in Transit',
      value: `${summary.inTransit}`,
      subtext: 'En route to Market',
      trend: 'ETA Today 5 PM',
      trendPositive: true,
      icon: 'Truck',
      accentColor: '#805ad5',
      bgColor: 'rgba(128, 90, 213, 0.1)',
    },
  ]

  const primaryBatch = batches[0]
  const topOffer     = offers[0]

  return (
    <div className={styles.dashboardContainer}>
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Wrapper */}
      <div className={styles.mainWrapper}>
        {/* Top Header Bar */}
        <header className={styles.topHeader}>
          <div className={styles.headerLeft}>
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className={styles.menuToggleBtn}
              aria-label="Open navigation menu"
            >
              <Menu size={22} />
            </button>
            <div className={styles.headerLogoWrap}>
              <Logo size="sm" />
            </div>
            <div className={styles.greetingWrap}>
              <h1 className={styles.greetingText}>
                Good Morning, {farmerProfile.name} 👋
              </h1>
              <div className={styles.locationTag}>
                <MapPin size={13} className={styles.mapIcon} />
                <span>{farmerProfile.location}</span>
              </div>
            </div>
          </div>

          <div className={styles.headerRight}>
            <div className={styles.profileBadge}>
              <CheckCircle2 size={15} className={styles.verifiedIcon} />
              <span className={styles.verifiedText}>{farmerProfile.status}</span>
            </div>
            <button
              className={styles.notificationBtn}
              aria-label="Notifications (3 unread)"
              title="Notifications"
            >
              <Bell size={19} />
              <span className={styles.notifDot} />
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className={styles.contentBody}>
          {loading ? (
            /* API Loading State */
            <div className={styles.loadingContainer}>
              <Loader2 size={36} className={styles.spinner} />
              <p className={styles.loadingText}>Fetching live market &amp; batch data via API Layer...</p>
            </div>
          ) : (
            <>
              {/* TAB: DASHBOARD */}
              {activeTab === 'dashboard' && (
                <div className={styles.dashboardGrid}>
                  {/* 1. Summary Cards */}
                  <section className={styles.summaryGrid} aria-label="Summary metrics">
                    {summaryCardsData.map((stat) => (
                      <SummaryCard key={stat.id} {...stat} />
                    ))}
                  </section>

                  {/* 2. Quick Actions */}
                  <section>
                    <QuickActions
                      onCreateBatchClick={() => setIsCreateModalOpen(true)}
                      onTabChange={setActiveTab}
                    />
                  </section>

                  {/* 3. Main Dashboard Two-Column Grid */}
                  <div className={styles.twoColumnGrid}>
                    {/* Left Column */}
                    <div className={styles.columnLeft}>
                      <FairPriceCard pricesList={marketPrices} />
                      <BatchCard batch={primaryBatch} onTrackClick={() => setActiveTab('track')} />
                    </div>

                    {/* Right Column */}
                    <div className={styles.columnRight}>
                      <OfferCard
                        offer={topOffer}
                        totalOffersCount={offers.length}
                        onViewOffersClick={() => setActiveTab('offers')}
                      />
                      <RecentActivity />
                    </div>
                  </div>
                </div>
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
                      onClick={() => setIsCreateModalOpen(true)}
                      className={styles.primaryActionBtn}
                    >
                      <Plus size={18} /> + Create New Batch
                    </button>
                  </div>

                  <div className={styles.batchesListGrid}>
                    {batches.map((b) => (
                      <div key={b.batchId} className={styles.batchItemCard}>
                        <div className={styles.batchCardHead}>
                          <div>
                            <span className={styles.batchTag}>{b.batchId}</span>
                            <h3 className={styles.batchTitle}>{b.crop} Harvest</h3>
                          </div>
                          <span className={styles.statusPill}>{b.status}</span>
                        </div>

                        <div className={styles.batchInfoGrid}>
                          <div>Quantity: <strong>{b.quantity} {b.unit || 'kg'}</strong></div>
                          <div>Quality: <strong>{b.quality}</strong></div>
                          <div>Harvested: <strong>{b.harvestDate || '2026-08-10'}</strong></div>
                        </div>

                        <button
                          onClick={() => setActiveTab('track')}
                          className={styles.secondaryBtn}
                        >
                          Track Verified Journey
                        </button>
                      </div>
                    ))}
                  </div>
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
                  <BatchCard batch={primaryBatch} onTrackClick={() => {}} />
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
                <div className={styles.tabSection}>
                  <div className={styles.tabHeaderRow}>
                    <div>
                      <h2 className={styles.tabTitle}>Farmer Profile</h2>
                      <p className={styles.tabSubtitle}>Manage your personal and farm details</p>
                    </div>
                  </div>

                  <div className={styles.profileCard}>
                    <div className={styles.profileHead}>
                      <div className={styles.avatarCircle}>
                        {farmerProfile.name[0]}
                      </div>
                      <div>
                        <h3 className={styles.profileName}>{farmerProfile.name}</h3>
                        <p className={styles.profileSub}>{farmerProfile.location}</p>
                      </div>
                    </div>

                    <div className={styles.profileGrid}>
                      <div>Farmer ID: <strong>{farmerProfile.farmerId}</strong></div>
                      <div>Phone: <strong>{farmerProfile.phone}</strong></div>
                      <div>Primary Crop: <strong>{farmerProfile.primaryCrop}</strong></div>
                      <div>Farm Size: <strong>{farmerProfile.farmSize}</strong></div>
                      <div>Rating: <strong>{farmerProfile.rating} ★</strong></div>
                      <div>Batches Sold: <strong>{farmerProfile.totalBatchesSold}</strong></div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav activeTab={activeTab} onTabChange={setActiveTab} />
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
