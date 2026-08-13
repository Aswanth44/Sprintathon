import { useState, useEffect } from 'react'
import {
  Store,
  HandCoins,
  ShoppingBag,
  Truck,
  ArrowRight,
  ShieldCheck,
  Package,
  MapPin,
  Clock,
  TrendingUp,
  Tag,
  CheckCircle2,
  FileText,
} from 'lucide-react'
import { getBatches } from '../../api/batchApi'
import { getOffers } from '../../api/offerApi'
import { getPurchases } from '../../api/purchaseApi'
import ViewBatchModal from './ViewBatchModal'
import MakeOfferModal from './MakeOfferModal'
import styles from './BuyerDashboardOverview.module.css'

export default function BuyerDashboardOverview({ onNavigateTab }) {
  const [batches, setBatches]             = useState([])
  const [offers, setOffers]               = useState([])
  const [purchases, setPurchases]         = useState([])

  // Modal State for Best Available Produce
  const [selectedViewBatch, setSelectedViewBatch]   = useState(null)
  const [selectedOfferBatch, setSelectedOfferBatch] = useState(null)

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const batchList = await getBatches()
        setBatches(Array.isArray(batchList) ? batchList : [])

        const offerList = await getOffers()
        setOffers(Array.isArray(offerList) ? offerList : [])

        const purchaseList = await getPurchases()
        setPurchases(Array.isArray(purchaseList) ? purchaseList : [])
      } catch (err) {
        console.error('Failed to load buyer dashboard overview data:', err)
      }
    }
    loadDashboardData()
  }, [])

  const activeOffersCount = offers.filter((o) => o.status === 'PENDING' || o.status === 'COUNTERED').length
  const activePurchasesList = purchases.filter((p) => p.status === 'CONFIRMED' || p.status === 'PROCESSING' || p.status === 'ACCEPTED')
  const ordersInTransitCount = purchases.filter((p) => p.currentStage === 'TRANSPORT' || p.status === 'IN_TRANSIT').length

  const bestProduce = batches.slice(0, 3)

  const handleOfferCreated = (newOffer) => {
    if (newOffer) {
      setOffers((prev) => [newOffer, ...prev])
    }
  }

  return (
    <div className={styles.container}>
      {/* A. BUYER WELCOME HEADER */}
      <div className={styles.welcomeBanner}>
        <div>
          <h1 className={styles.welcomeTitle}>Welcome, GreenFresh Traders 👋</h1>
          <p className={styles.welcomeSubtitle}>
            <MapPin size={14} /> Coimbatore Central Retail Hub • Verified Direct Sourcing Account
          </p>
        </div>
        <span className={styles.verifiedBuyerBadge}>
          <ShieldCheck size={14} /> Verified Sourcing Buyer
        </span>
      </div>

      {/* B. PROCUREMENT SUMMARY CARDS */}
      <div className={styles.summaryGrid}>
        <div className={styles.summaryCard} onClick={() => onNavigateTab('marketplace')}>
          <div className={styles.iconWrap} style={{ background: '#d8f3dc', color: '#1b4332' }}>
            <Store size={22} />
          </div>
          <div>
            <div className={styles.metricVal}>{batches.length || 3}</div>
            <div className={styles.metricLabel}>Verified farmer batches available</div>
          </div>
        </div>

        <div className={styles.summaryCard} onClick={() => onNavigateTab('offers')}>
          <div className={styles.iconWrap} style={{ background: '#e0f2fe', color: '#0369a1' }}>
            <HandCoins size={22} />
          </div>
          <div>
            <div className={styles.metricVal}>{activeOffersCount || 5}</div>
            <div className={styles.metricLabel}>Offers awaiting farmer response</div>
          </div>
        </div>

        <div className={styles.summaryCard} onClick={() => onNavigateTab('purchases')}>
          <div className={styles.iconWrap} style={{ background: '#fef3c7', color: '#92400e' }}>
            <ShoppingBag size={22} />
          </div>
          <div>
            <div className={styles.metricVal}>{activePurchasesList.length || 2}</div>
            <div className={styles.metricLabel}>Purchases currently in progress</div>
          </div>
        </div>

        <div className={styles.summaryCard} onClick={() => onNavigateTab('track')}>
          <div className={styles.iconWrap} style={{ background: '#f3e8ff', color: '#6b21a8' }}>
            <Truck size={22} />
          </div>
          <div>
            <div className={styles.metricVal}>{ordersInTransitCount || 1}</div>
            <div className={styles.metricLabel}>Produce currently being transported</div>
          </div>
        </div>
      </div>

      {/* C. QUICK ACTIONS */}
      <div className={styles.quickActionsCard}>
        <h3 className={styles.quickTitle}>Quick Sourcing Actions</h3>
        <div className={styles.quickGrid}>
          <button onClick={() => onNavigateTab('marketplace')} className={styles.primaryQuickBtn}>
            <Store size={18} /> Browse Marketplace <ArrowRight size={16} />
          </button>
          <button onClick={() => onNavigateTab('offers')} className={styles.secondaryQuickBtn}>
            <HandCoins size={18} /> View My Offers <ArrowRight size={14} />
          </button>
          <button onClick={() => onNavigateTab('purchases')} className={styles.secondaryQuickBtn}>
            <ShoppingBag size={18} /> View Purchases <ArrowRight size={14} />
          </button>
          <button onClick={() => onNavigateTab('track')} className={styles.secondaryQuickBtn}>
            <Truck size={18} /> Track Orders <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* D. BEST AVAILABLE PRODUCE */}
      <div className={styles.bestProduceSection}>
        <div className={styles.sectionHeaderRow}>
          <div>
            <h2 className={styles.sectionTitle}>Best Available Produce</h2>
            <p className={styles.sectionSub}>Verified farmer batches available for direct procurement</p>
          </div>
          <button onClick={() => onNavigateTab('marketplace')} className={styles.linkBtn}>
            View All Marketplace Batches →
          </button>
        </div>

        <div className={styles.bestGrid}>
          {bestProduce.map((b) => (
            <div key={b.batchId} className={styles.produceCard}>
              <div className={styles.cardHeaderRow}>
                <span className={styles.cropTitle}>🍅 {b.crop}</span>
                <span className={styles.gradeTag}>{b.quality || b.grade || 'Grade A'}</span>
              </div>

              <div className={styles.batchSubText}>
                Batch: <strong>{b.batchId}</strong> • {b.quantity} {b.unit || 'kg'}
              </div>

              <div className={styles.priceRow}>
                <span className={styles.priceTag}>
                  <Tag size={14} /> ₹{b.expectedPrice || 42}/kg
                </span>
                <span className={styles.locText}>
                  <MapPin size={12} /> {b.location || 'Pollachi, Coimbatore'}
                </span>
              </div>

              <div className={styles.verifiedPill}>
                <CheckCircle2 size={12} /> Verified Farmer
              </div>

              <div className={styles.cardBtnRow}>
                <button
                  type="button"
                  onClick={() => setSelectedViewBatch(b)}
                  className={styles.viewBtn}
                >
                  View Batch
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOfferBatch(b)}
                  className={styles.offerBtn}
                >
                  Make Offer
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN TWO-COLUMN DASHBOARD GRID */}
      <div className={styles.twoColumnGrid}>
        {/* LEFT COLUMN: ACTIVE PURCHASES & RECENT ACTIVITY */}
        <div className={styles.colLeft}>
          {/* E. ACTIVE PURCHASES */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeaderRow}>
              <h3 className={styles.cardSectionTitle}>Active Purchases</h3>
              <button onClick={() => onNavigateTab('purchases')} className={styles.linkBtn}>View All</button>
            </div>

            <div className={styles.purchasesList}>
              {activePurchasesList.length === 0 ? (
                <p className={styles.mutedText}>No active purchases currently in progress.</p>
              ) : (
                activePurchasesList.slice(0, 2).map((p) => (
                  <div key={p.purchaseId} className={styles.purchaseItem}>
                    <div className={styles.itemHeadRow}>
                      <strong>{p.crop} <span className={styles.batchIdTag}>({p.batchId})</span></strong>
                      <span className={styles.statusConfirmed}>● {p.status}</span>
                    </div>

                    <div className={styles.itemDetailGrid}>
                      <div>Qty: <strong>{p.quantity} {p.unit || 'kg'}</strong></div>
                      <div>Price: <strong>₹{p.price || 44}/kg</strong></div>
                      <div>Stage: <strong style={{ color: 'var(--color-green-deep)' }}>{p.currentStage || 'Warehouse → Transport'}</strong></div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onNavigateTab('track')}
                      className={styles.trackOrderBtn}
                    >
                      <Truck size={14} /> Track Order
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* F. RECENT ACTIVITY */}
          <div className={styles.sectionCard}>
            <h3 className={styles.cardSectionTitle}>Recent Activity</h3>
            <div className={styles.activityFeed}>
              <div className={styles.activityItem}>
                <div className={styles.activityDot} />
                <div>
                  <strong className={styles.actTitle}>New buyer offer submitted</strong>
                  <p className={styles.actDesc}>₹44/kg for UZH-TOM-00128 (Tomato)</p>
                  <span className={styles.actTime}><Clock size={11} /> Today, 03:45 PM</span>
                </div>
              </div>

              <div className={styles.activityItem}>
                <div className={styles.activityDotDone} />
                <div>
                  <strong className={styles.actTitle}>Offer accepted</strong>
                  <p className={styles.actDesc}>Tomato • 500 kg @ ₹44/kg</p>
                  <span className={styles.actTime}><Clock size={11} /> Today, 04:10 PM</span>
                </div>
              </div>

              <div className={styles.activityItem}>
                <div className={styles.activityDotDone} />
                <div>
                  <strong className={styles.actTitle}>Purchase created &amp; Escrow Secured</strong>
                  <p className={styles.actDesc}>Order UZH-PUR-00032 confirmed by platform</p>
                  <span className={styles.actTime}><Clock size={11} /> Today, 04:15 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: MARKET INSIGHT */}
        <div className={styles.colRight}>
          {/* G. MARKET INSIGHT */}
          <div className={styles.sectionCard}>
            <h3 className={styles.cardSectionTitle}>Market Insight</h3>
            
            <div className={styles.insightBox}>
              <div className={styles.insightHead}>
                <span className={styles.cropName}>Tomato</span>
                <span className={styles.fairBadge}>✓ FAIR OFFER</span>
              </div>

              <div className={styles.insightGrid}>
                <div className={styles.insightStat}>
                  <span>Current Benchmark</span>
                  <strong>₹42/kg</strong>
                </div>

                <div className={styles.insightStat}>
                  <span>Buyer Offer</span>
                  <strong style={{ color: 'var(--color-green-deep)' }}>₹44/kg</strong>
                </div>

                <div className={styles.insightStat}>
                  <span>Difference</span>
                  <strong style={{ color: '#047857' }}>+₹2/kg</strong>
                </div>
              </div>

              <div className={styles.trendNote}>
                <TrendingUp size={14} style={{ color: '#047857' }} /> Mandi benchmark up +4.8% due to steady wholesale retail demand.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODALS FOR VIEW BATCH & MAKE OFFER */}
      <ViewBatchModal
        isOpen={!!selectedViewBatch}
        batch={selectedViewBatch}
        onClose={() => setSelectedViewBatch(null)}
        onMakeOfferClick={(b) => {
          setSelectedViewBatch(null)
          setSelectedOfferBatch(b)
        }}
      />

      <MakeOfferModal
        isOpen={!!selectedOfferBatch}
        batch={selectedOfferBatch}
        onClose={() => setSelectedOfferBatch(null)}
        onOfferCreated={handleOfferCreated}
      />
    </div>
  )
}
