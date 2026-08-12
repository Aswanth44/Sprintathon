import { useState, useEffect } from 'react'
import {
  ShoppingBag,
  CheckCircle2,
  Eye,
  Truck,
  Loader2,
} from 'lucide-react'
import { getPurchases } from '../../api/purchaseApi'
import ViewPurchaseModal from './ViewPurchaseModal'
import styles from './BuyerPurchasesView.module.css'

/**
 * Functional Buyer Purchases Page Component
 * Responsive layout formatted for 320px - 430px mobile & desktop.
 */
export default function BuyerPurchasesView({ onNavigateTab }) {
  const [purchases, setPurchases]         = useState([])
  const [activeTab, setActiveTab]         = useState('ALL')
  const [loading, setLoading]             = useState(true)
  const [viewPurchase, setViewPurchase]   = useState(null)

  useEffect(() => {
    async function loadPurchases() {
      try {
        setLoading(true)
        const list = await getPurchases()
        setPurchases(Array.isArray(list) ? list : [])
      } catch (err) {
        console.error('Failed to load buyer purchases:', err)
      } finally {
        setLoading(false)
      }
    }
    loadPurchases()
  }, [])

  const filteredPurchases = purchases.filter((p) => {
    if (activeTab === 'ALL') return true
    if (activeTab === 'CONFIRMED') return p.status === 'CONFIRMED'
    if (activeTab === 'PROCESSING') return p.status === 'PROCESSING'
    if (activeTab === 'COMPLETED') return p.status === 'COMPLETED'
    if (activeTab === 'CANCELLED') return p.status === 'CANCELLED'
    return true
  })

  return (
    <div className={styles.container}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Purchases</h1>
          <p className={styles.subtitle}>Manage your confirmed farmer purchases and procurement orders</p>
        </div>
      </div>

      {/* Filter Tabs Row */}
      <div className={styles.tabsRow}>
        <button
          onClick={() => setActiveTab('ALL')}
          className={`${styles.tabBtn} ${activeTab === 'ALL' ? styles.activeTab : ''}`}
        >
          All ({purchases.length})
        </button>
        <button
          onClick={() => setActiveTab('CONFIRMED')}
          className={`${styles.tabBtn} ${activeTab === 'CONFIRMED' ? styles.activeTab : ''}`}
        >
          Confirmed ({purchases.filter((p) => p.status === 'CONFIRMED').length})
        </button>
        <button
          onClick={() => setActiveTab('PROCESSING')}
          className={`${styles.tabBtn} ${activeTab === 'PROCESSING' ? styles.activeTab : ''}`}
        >
          Processing ({purchases.filter((p) => p.status === 'PROCESSING').length})
        </button>
        <button
          onClick={() => setActiveTab('COMPLETED')}
          className={`${styles.tabBtn} ${activeTab === 'COMPLETED' ? styles.activeTab : ''}`}
        >
          Completed ({purchases.filter((p) => p.status === 'COMPLETED').length})
        </button>
        <button
          onClick={() => setActiveTab('CANCELLED')}
          className={`${styles.tabBtn} ${activeTab === 'CANCELLED' ? styles.activeTab : ''}`}
        >
          Cancelled ({purchases.filter((p) => p.status === 'CANCELLED').length})
        </button>
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className={styles.loadingState}>
          <Loader2 size={32} className={styles.spinner} />
          <p>Loading confirmed purchases...</p>
        </div>
      ) : filteredPurchases.length === 0 ? (
        <div className={styles.emptyState}>
          <ShoppingBag size={40} className={styles.emptyIcon} />
          <h3>No Purchases Found</h3>
          <p>Purchases generated from accepted farmer offers will appear here automatically.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredPurchases.map((purchase) => (
            <div key={purchase.purchaseId} className={styles.card}>
              {/* Header: Crop + Status */}
              <div className={styles.cardHeader}>
                <div>
                  <h3 className={styles.cropName}>{purchase.crop}</h3>
                  <span className={styles.purTag}>{purchase.purchaseId}</span>
                </div>

                <span className={styles.statusBadge}>
                  <CheckCircle2 size={12} /> {purchase.status}
                </span>
              </div>

              {/* Table Specs */}
              <div className={styles.tableBox}>
                <div className={styles.tableRow}>
                  <span>Batch ID</span>
                  <strong>{purchase.batchId}</strong>
                </div>

                <div className={styles.tableRow}>
                  <span>Quantity</span>
                  <strong>{purchase.quantity} {purchase.unit || 'kg'}</strong>
                </div>

                <div className={styles.tableRow}>
                  <span>Price</span>
                  <strong>₹{purchase.purchasePrice || purchase.price || 44}/kg</strong>
                </div>

                <div className={styles.tableRow}>
                  <span>Current Stage</span>
                  <strong style={{ color: 'var(--color-green-deep)' }}>
                    {purchase.currentStage || 'Warehouse'}
                  </strong>
                </div>
              </div>

              {/* Actions */}
              <div className={styles.cardActions}>
                <button
                  type="button"
                  onClick={() => {
                    if (onNavigateTab) onNavigateTab('track')
                    else setViewPurchase(purchase)
                  }}
                  className={styles.trackBtn}
                >
                  <Truck size={15} /> Track Order
                </button>
                <button
                  type="button"
                  onClick={() => setViewPurchase(purchase)}
                  className={styles.viewBtn}
                >
                  <Eye size={15} /> View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Purchase Modal */}
      <ViewPurchaseModal
        isOpen={Boolean(viewPurchase)}
        purchase={viewPurchase}
        onClose={() => setViewPurchase(null)}
      />
    </div>
  )
}
