import { Package, Truck, ArrowRight, Check } from 'lucide-react'
import { formatBatchStatus, formatDate } from '../../utils/formatters'
import styles from './BatchCard.module.css'

const DEFAULT_STAGES = [
  { key: 'farm',      label: 'Farm',      desc: 'Harvested',      completed: true  },
  { key: 'pickup',    label: 'Pickup',    desc: 'Picked Up',      completed: true  },
  { key: 'warehouse', label: 'Warehouse', desc: 'Stored Safely',  completed: true  },
  { key: 'transport', label: 'Transport', desc: 'In Transit',     completed: true, isCurrent: true },
  { key: 'buyer',     label: 'Buyer',     desc: 'Delivered',      completed: false },
]

/**
 * Active Produce Batch Card Component
 * Receives batch object from batchApi service
 *
 * @param {{ batch?: any, onTrackClick?: (batchId: string) => void }} props
 */
export default function BatchCard({ batch: inputBatch, onTrackClick, onQrClick }) {
  const batch = inputBatch || {
    batchId: 'UZH-TOM-00128',
    crop: 'Tomato',
    quantity: '500 kg',
    quality: 'Grade A',
    status: 'IN_TRANSIT',
    harvestDate: '2026-08-10',
    stages: DEFAULT_STAGES,
  }

  const stages = batch.stages || DEFAULT_STAGES
  const displayQuantity = typeof batch.quantity === 'number' ? `${batch.quantity} ${batch.unit || 'kg'}` : batch.quantity
  const displayStatus   = formatBatchStatus(batch.status)
  const displayDate     = formatDate(batch.harvestDate)

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.headerTitleWrap}>
          <div className={styles.iconWrap}>
            <Package size={18} />
          </div>
          <div>
            <h2 className={styles.cardTitle}>
              {batch.crop} <span className={styles.batchIdTag}>({batch.batchId})</span>
            </h2>
          </div>
        </div>
        <span className={styles.statusBadge}>
          <span className={styles.statusDot} /> {displayStatus}
        </span>
      </div>

      <div className={styles.detailsGrid}>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Crop</span>
          <span className={styles.detailValue}>{batch.crop}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Quantity</span>
          <span className={styles.detailValue}>{displayQuantity}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Quality Grade</span>
          <span className={styles.gradeBadge}>{batch.quality}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Harvest Date</span>
          <span className={styles.detailValue}>{displayDate}</span>
        </div>
      </div>

      {/* Progress Journey Step Bar */}
      <div className={styles.journeyWrap} aria-label="Batch progress journey">
        <span className={styles.journeyHeading}>Produce Journey</span>
        <div className={styles.stepsRow}>
          {stages.map((stage, idx) => (
            <div
              key={stage.key || idx}
              className={`${styles.stepNode} ${stage.isCurrent ? styles.stepCurrent : stage.completed ? styles.stepCompleted : styles.stepPending}`}
            >
              <div className={styles.stepCircle}>
                {stage.completed && !stage.isCurrent ? (
                  <Check size={11} className={styles.checkIcon} />
                ) : stage.isCurrent ? (
                  <Truck size={12} className={styles.currentIcon} />
                ) : (
                  <span className={styles.stepDot} />
                )}
              </div>
              <span className={styles.stepLabel} title={stage.label}>
                {stage.label === 'Farm Harvest' ? 'Farm' : stage.label === 'Buyer Delivery' ? 'Delivery' : stage.label}
              </span>
              {idx < stages.length - 1 && (
                <div className={`${styles.connectorLine} ${stage.completed ? styles.connectorDone : ''}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.actionBtnRow}>
        <button
          type="button"
          onClick={() => {
            if (onQrClick) onQrClick(batch)
            else window.location.hash = `#/verify-batch/${batch.batchId}`
          }}
          className={styles.qrBtn}
        >
          View Batch QR
        </button>
        <button
          type="button"
          onClick={() => onTrackClick && onTrackClick(batch.batchId)}
          className={styles.trackBtn}
        >
          Track Verified Journey <ArrowRight size={15} />
        </button>
      </div>
    </div>
  )
}
