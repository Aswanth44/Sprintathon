import { useState, useEffect } from 'react'
import {
  Truck,
  CheckCircle2,
  MapPin,
  Calendar,
  User,
  Package,
  Loader2,
  ShieldCheck,
} from 'lucide-react'
import { getOrders } from '../../api/purchaseApi'
import ViewBatchModal from './ViewBatchModal'
import styles from './BuyerTrackOrdersView.module.css'

/**
 * Functional Buyer Track Orders Component
 * Displays active procurement orders with the 5-stage verified supply chain journey.
 */
export default function BuyerTrackOrdersView() {
  const [orders, setOrders]       = useState([])
  const [loading, setLoading]     = useState(true)
  const [selectedBatch, setSelectedBatch] = useState(null)

  useEffect(() => {
    async function loadOrders() {
      try {
        setLoading(true)
        const list = await getOrders()
        setOrders(Array.isArray(list) ? list : [])
      } catch (err) {
        console.error('Failed to load buyer orders:', err)
      } finally {
        setLoading(false)
      }
    }
    loadOrders()
  }, [])

  return (
    <div className={styles.container}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Track Orders</h1>
          <p className={styles.subtitle}>Track your verified produce from farm to delivery in real time</p>
        </div>
      </div>

      {loading ? (
        <div className={styles.loadingState}>
          <Loader2 size={32} className={styles.spinner} />
          <p>Loading active tracking orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className={styles.emptyState}>
          <Truck size={40} className={styles.emptyIcon} />
          <h3>No Active Delivery Orders</h3>
          <p>Confirmed purchases will appear here with live logistics tracking.</p>
        </div>
      ) : (
        <div className={styles.list}>
          {orders.map((order) => {
            const stages = order.stages || [
              { key: 'farm',      label: 'Farm Harvest',    desc: 'Harvested & Inspected', completed: true  },
              { key: 'pickup',    label: 'Pickup',          desc: 'Agri Logistics Loaded', completed: true  },
              { key: 'warehouse', label: 'Warehouse',       desc: 'Cold Storage Verified', completed: true  },
              { key: 'transport', label: 'Transport',       desc: 'In Transit to Hub',     completed: true, isCurrent: true },
              { key: 'buyer',     label: 'Buyer Delivery',  desc: 'Direct Retail Delivery', completed: false },
            ]

            return (
              <div key={order.orderId} className={styles.orderCard}>
                {/* Order Card Top Bar */}
                <div className={styles.cardHeader}>
                  <div className={styles.headerTitleWrap}>
                    <div className={styles.iconWrap}>
                      <Truck size={22} />
                    </div>
                    <div>
                      <h3 className={styles.cropTitle}>
                        {order.crop} Procurement ({order.orderId})
                      </h3>
                      <div className={styles.metaSub}>
                        Purchase: <strong>{order.purchaseId}</strong> • Batch: <strong>{order.batchId}</strong>
                      </div>
                    </div>
                  </div>

                  <span className={styles.verifiedBadge}>
                    <ShieldCheck size={14} /> Live Tracked
                  </span>
                </div>

                {/* Info Grid */}
                <div className={styles.infoGrid}>
                  <div className={styles.infoBox}>
                    <span className={styles.label}>Purchased Qty</span>
                    <strong className={styles.val}>{order.quantity} {order.unit || 'kg'}</strong>
                  </div>
                  <div className={styles.infoBox}>
                    <span className={styles.label}>Farmer Sourcing</span>
                    <strong className={styles.val}>{order.farmerName || 'Aswanth Kumar'}</strong>
                  </div>
                  <div className={styles.infoBox}>
                    <span className={styles.label}>Current Location</span>
                    <strong className={styles.val} style={{ color: 'var(--color-green-deep)' }}>
                      <MapPin size={13} style={{ display: 'inline', marginRight: 2 }} />
                      {order.currentLocation}
                    </strong>
                  </div>
                  <div className={styles.infoBox}>
                    <span className={styles.label}>Expected Delivery</span>
                    <strong className={styles.val}>{order.expectedDelivery}</strong>
                  </div>
                </div>

                {/* 5-Stage Supply Chain Stepper */}
                <div className={styles.stepperWrap}>
                  <h4 className={styles.stepperTitle}>5-Stage Supply Chain Traceability</h4>

                  <div className={styles.stepperRow}>
                    {stages.map((stage, idx) => (
                      <div
                        key={stage.key || idx}
                        className={`${styles.stepNode} ${stage.completed ? styles.completed : ''} ${stage.isCurrent ? styles.current : ''}`}
                      >
                        <div className={styles.nodeCircle}>
                          {stage.completed ? <CheckCircle2 size={16} /> : idx + 1}
                        </div>
                        <div className={styles.nodeLabel}>{stage.label}</div>
                        <div className={styles.nodeDesc}>{stage.desc}</div>
                        {idx < stages.length - 1 && (
                          <div className={`${styles.connectorLine} ${stage.completed ? styles.completedLine : ''}`} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className={styles.cardFooter}>
                  <button
                    type="button"
                    onClick={() => setSelectedBatch({
                      batchId: order.batchId,
                      crop: order.crop,
                      quantity: order.quantity,
                      unit: order.unit,
                      stages,
                    })}
                    className={styles.journeyBtn}
                  >
                    <ShieldCheck size={16} /> View Verified Journey
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal */}
      <ViewBatchModal
        isOpen={Boolean(selectedBatch)}
        batch={selectedBatch}
        onClose={() => setSelectedBatch(null)}
      />
    </div>
  )
}
