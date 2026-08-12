import { useEffect } from 'react'
import { X, ShoppingBag, CheckCircle2, MapPin, User, Tag, Calendar, Truck } from 'lucide-react'
import styles from './ViewPurchaseModal.module.css'

export default function ViewPurchaseModal({ isOpen, purchase, onClose }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen || !purchase) return null

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.headerTitleWrap}>
            <ShoppingBag className={styles.headerIcon} size={22} />
            <div>
              <h2 className={styles.modalTitle}>Purchase Details ({purchase.purchaseId})</h2>
              <span className={styles.verifiedBadge}>
                <CheckCircle2 size={12} /> Confirmed Purchase Order
              </span>
            </div>
          </div>
          <button onClick={onClose} className={styles.closeBtn} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.specsGrid}>
            <div className={styles.specCard}>
              <span className={styles.label}>Crop &amp; Batch</span>
              <strong className={styles.val}>{purchase.crop} ({purchase.batchId})</strong>
            </div>
            <div className={styles.specCard}>
              <span className={styles.label}>Purchased Qty</span>
              <strong className={styles.val}>{purchase.quantity} {purchase.unit || 'kg'}</strong>
            </div>
            <div className={styles.specCard}>
              <span className={styles.label}>Purchase Price</span>
              <strong className={styles.val}>₹{purchase.purchasePrice}/kg</strong>
            </div>
            <div className={styles.specCard}>
              <span className={styles.label}>Transport Deduction</span>
              <strong className={styles.val} style={{ color: 'var(--color-error)' }}>₹{purchase.transportCost}/kg</strong>
            </div>
          </div>

          <div className={styles.totalBox}>
            <div>
              <span className={styles.totalLabel}>Total Procurement Amount</span>
              <div className={styles.totalVal}>₹{purchase.totalAmount?.toLocaleString()}</div>
            </div>
            <span className={styles.statusConfirmed}>{purchase.status}</span>
          </div>

          <div className={styles.infoCard}>
            <h3 className={styles.infoTitle}>Farmer &amp; Sourcing Details</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoRow}>
                <User size={15} className={styles.icon} />
                <span>Farmer: <strong>{purchase.farmerName || 'Aswanth Kumar'} ({purchase.farmerId || 'UZH-FMR-000128'})</strong></span>
              </div>
              <div className={styles.infoRow}>
                <MapPin size={15} className={styles.icon} />
                <span>Location: <strong>{purchase.farmerLocation || 'Pollachi, Coimbatore'}</strong></span>
              </div>
              <div className={styles.infoRow}>
                <Calendar size={15} className={styles.icon} />
                <span>Purchase Date: <strong>{purchase.purchaseDate}</strong></span>
              </div>
              <div className={styles.infoRow}>
                <Truck size={15} className={styles.icon} />
                <span>Expected Delivery: <strong>{purchase.expectedDelivery}</strong></span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button type="button" onClick={onClose} className={styles.doneBtn}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
