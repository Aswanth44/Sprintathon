import { useEffect } from 'react'
import { X, CheckCircle2, MapPin, Calendar, Award, User, Sprout, Tag, ArrowRight, ShieldCheck } from 'lucide-react'
import styles from './ViewBatchModal.module.css'

/**
 * View Batch Modal Component for Buyer Marketplace
 * Displays detailed batch specs, verification credentials, and 5-stage traceability journey.
 */
export default function ViewBatchModal({ isOpen, batch, onClose, onMakeOfferClick }) {
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

  if (!isOpen || !batch) return null

  const cropName = batch.crop || 'Tomato'
  const batchId = batch.batchId || 'UZH-TOM-00128'
  const quantity = batch.quantity || 500
  const unit = batch.unit || 'kg'
  const quality = batch.quality || 'Grade A'
  const expectedPrice = batch.expectedPrice || batch.price || (cropName === 'Tomato' ? 42 : cropName === 'Onion' ? 35 : 28)
  const harvestDate = batch.harvestDate || '10 Aug 2026'
  const farmerId = batch.farmerId || 'UZH-FMR-000128'
  const farmerName = batch.farmerName || 'Aswanth Kumar'
  const location = batch.location || batch.farmLocation || 'Pollachi, Coimbatore'
  const farmingType = batch.farmingType || 'Organic & Drip Irrigated'

  const stages = batch.stages || [
    { key: 'farm',      label: 'Farm',      desc: 'Harvested & Inspected',  completed: true  },
    { key: 'pickup',    label: 'Pickup',    desc: 'Logistics Pickup Ready', completed: true  },
    { key: 'warehouse', label: 'Warehouse', desc: 'Climate Warehouse Stored', completed: true  },
    { key: 'transport', label: 'Transport', desc: 'In Transit to Hub',      completed: true, isCurrent: true },
    { key: 'buyer',     label: 'Buyer',     desc: 'Direct Buyer Delivery',  completed: false },
  ]

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.headerTitleWrap}>
            <Sprout className={styles.headerIcon} size={22} />
            <div>
              <h2 className={styles.modalTitle}>{cropName} Batch <span className={styles.batchIdTag}>({batchId})</span></h2>
              <span className={styles.verifiedBadge}>
                <CheckCircle2 size={12} /> Verified Produce
              </span>
            </div>
          </div>
          <button onClick={onClose} className={styles.closeBtn} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className={styles.modalBody}>
          {/* Key Specs Grid */}
          <div className={styles.specsGrid}>
            <div className={styles.specCard}>
              <span className={styles.specLabel}>Available Quantity</span>
              <span className={styles.specValue}>{quantity} {unit}</span>
            </div>
            <div className={styles.specCard}>
              <span className={styles.specLabel}>Quality Grade</span>
              <span className={styles.specValue}>{quality}</span>
            </div>
            <div className={styles.specCard}>
              <span className={styles.specLabel}>Expected Price</span>
              <span className={`${styles.specValue} ${styles.priceHighlight}`}>₹{expectedPrice}/kg</span>
            </div>
            <div className={styles.specCard}>
              <span className={styles.specLabel}>Harvest Date</span>
              <span className={styles.specValue}>{harvestDate}</span>
            </div>
          </div>

          {/* Farmer & Location Info Box */}
          <div className={styles.infoCard}>
            <h3 className={styles.infoTitle}>Farmer & Farm Information</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoRow}>
                <User size={15} className={styles.infoIcon} />
                <span>Farmer: <strong>{farmerName} ({farmerId})</strong></span>
              </div>
              <div className={styles.infoRow}>
                <MapPin size={15} className={styles.infoIcon} />
                <span>Location: <strong>{location}</strong></span>
              </div>
              <div className={styles.infoRow}>
                <Award size={15} className={styles.infoIcon} />
                <span>Farming Method: <strong>{farmingType}</strong></span>
              </div>
              <div className={styles.infoRow}>
                <Calendar size={15} className={styles.infoIcon} />
                <span>Batch Status: <strong style={{ color: 'var(--color-green-deep)' }}>{batch.status || 'Verified & Ready'}</strong></span>
              </div>
            </div>
          </div>

          {/* Verified Journey Timeline */}
          <div className={styles.journeySection}>
            <h3 className={styles.journeyTitle}>Verified Supply Chain Journey</h3>
            <div className={styles.timelineList}>
              {stages.map((stage, idx) => (
                <div
                  key={stage.key || idx}
                  className={`${styles.timelineItem} ${stage.completed ? styles.completed : ''} ${stage.isCurrent ? styles.current : ''}`}
                >
                  <div className={styles.dotWrap}>
                    <span className={styles.dot}>
                      {stage.completed && <CheckCircle2 size={12} />}
                    </span>
                    {idx < stages.length - 1 && <span className={styles.line} />}
                  </div>
                  <div className={styles.timelineContent}>
                    <div className={styles.stageName}>
                      {stage.label} {stage.isCurrent && <span className={styles.activeTag}>Current</span>}
                    </div>
                    <div className={styles.stageDesc}>{stage.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className={styles.btnRow}>
          <button
            type="button"
            onClick={() => {
              onClose()
              window.location.hash = `#/verify-batch/${batchId}`
            }}
            className={styles.verifyBtn}
          >
            <ShieldCheck size={16} /> Verify Farm-to-Market Journey
          </button>
          <button type="button" onClick={onClose} className={styles.cancelBtn}>
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              onClose()
              if (onMakeOfferClick) onMakeOfferClick(batch)
            }}
            className={styles.submitBtn}
          >
            <Tag size={18} /> Make an Offer <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
