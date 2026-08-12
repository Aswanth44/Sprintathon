import { useState, useEffect } from 'react'
import {
  Package,
  QrCode,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Tag,
  Loader2,
  Calendar,
  Layers,
} from 'lucide-react'
import { getBatch, getBatchHistory } from '../../api/batchApi'
import { formatBatchStatus, formatDate } from '../../utils/formatters'
import BatchCard from './BatchCard'
import styles from './BatchDetailsView.module.css'

/**
 * Full Produce Batch Details & Traceability Page Component
 *
 * @param {{
 *   batchId?: string,
 *   batch?: any,
 *   onNavigateView: (view: string, extraData?: any) => void
 * }} props
 */
export default function BatchDetailsView({ batchId, batch: initialBatch, onNavigateView }) {
  const [loading, setLoading]   = useState(!initialBatch)
  const [batchData, setBatchData] = useState(initialBatch || null)
  const [history, setHistory]     = useState([])

  useEffect(() => {
    async function loadBatchDetails() {
      if (initialBatch) {
        setBatchData(initialBatch)
        try {
          const hist = await getBatchHistory(initialBatch.batchId)
          setHistory(hist)
        } catch {
          /* fallback */
        }
        return
      }

      setLoading(true)
      try {
        const idToFetch = batchId || 'UZH-TOM-00128'
        const [bRes, hRes] = await Promise.all([
          getBatch(idToFetch),
          getBatchHistory(idToFetch),
        ])
        setBatchData(bRes)
        setHistory(hRes)
      } catch (err) {
        console.error('Failed to load batch details API data:', err)
      } finally {
        setLoading(false)
      }
    }

    loadBatchDetails()
  }, [batchId, initialBatch])

  if (loading || !batchData) {
    return (
      <div className={styles.loadingBox}>
        <Loader2 size={36} className={styles.spinner} />
        <p>Loading batch traceability details...</p>
      </div>
    )
  }

  const displayStatus = formatBatchStatus(batchData.status)
  const displayDate   = formatDate(batchData.harvestDate)
  const displayQty    = typeof batchData.quantity === 'number' ? `${batchData.quantity} ${batchData.unit || 'kg'}` : batchData.quantity

  return (
    <div className={styles.container}>
      {/* Top Header Row */}
      <div className={styles.headerRow}>
        <div>
          <div className={styles.badgeCodeRow}>
            <span className={styles.batchCode}>{batchData.batchId}</span>
            <span className={styles.statusPill}>● {displayStatus}</span>
          </div>
          <h2 className={styles.title}>🍅 {batchData.crop} Harvest Details</h2>
          <p className={styles.subtitle}>
            <MapPin size={13} /> {batchData.location || 'Coimbatore, Tamil Nadu'}
          </p>
        </div>

        <div className={styles.headerActions}>
          <button
            onClick={() => onNavigateView && onNavigateView('batch-qr', { batch: batchData })}
            className={styles.qrBtn}
          >
            <QrCode size={18} /> View QR Code
          </button>
          <button
            onClick={() => onNavigateView && onNavigateView('batches')}
            className={styles.backBtn}
          >
            <ArrowLeft size={18} /> Back to Batches
          </button>
        </div>
      </div>

      {/* Main Grid: Details Overview + Journey */}
      <div className={styles.detailsGrid}>
        {/* Left Column: Key Parameters */}
        <div className={styles.metricsCard}>
          <h3 className={styles.cardTitle}>
            <Package size={18} /> Batch Specifications
          </h3>

          <div className={styles.specGrid}>
            <div className={styles.specItem}>
              <span className={styles.specLabel}>Produce Crop</span>
              <span className={styles.specValue}>{batchData.crop}</span>
            </div>

            <div className={styles.specItem}>
              <span className={styles.specLabel}>Total Quantity</span>
              <span className={styles.specValue}>{displayQty}</span>
            </div>

            <div className={styles.specItem}>
              <span className={styles.specLabel}>Quality Grade</span>
              <span className={styles.gradeBadge}>{batchData.quality}</span>
            </div>

            <div className={styles.specItem}>
              <span className={styles.specLabel}>Harvest Date</span>
              <span className={styles.specValue}>
                <Calendar size={13} /> {displayDate}
              </span>
            </div>

            <div className={styles.specItem}>
              <span className={styles.specLabel}>Expected Price</span>
              <span className={styles.specValue} style={{ color: 'var(--color-green-mid)' }}>
                <Tag size={13} /> ₹{batchData.expectedPrice || 42} / {batchData.unit || 'kg'}
              </span>
            </div>

            <div className={styles.specItem}>
              <span className={styles.specLabel}>Current Stage</span>
              <span className={styles.specValue}>
                <Layers size={13} /> {batchData.currentStage || 'FARM'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Reused Produce Journey Card */}
        <div className={styles.journeyCardWrap}>
          <BatchCard batch={batchData} onTrackClick={() => {}} />
        </div>
      </div>

      {/* Verified History Section (Demo Ledger) */}
      <section className={styles.historySection}>
        <div className={styles.historyHeader}>
          <div>
            <h3 className={styles.sectionTitle}>
              <ShieldCheck size={20} className={styles.shieldIcon} /> Verified Journey History
            </h3>
            <p className={styles.sectionSubtitle}>
              {history.length || 1} event recorded • Demo tamper-evident traceability ledger
            </p>
          </div>
        </div>

        <div className={styles.timelineList}>
          {history.map((evt) => (
            <div key={evt.id} className={styles.timelineItem}>
              <div className={styles.timelineIconNode}>
                <CheckCircle2 size={20} />
              </div>
              <div className={styles.timelineContent}>
                <div className={styles.timelineHead}>
                  <h4 className={styles.evtTitle}>{evt.event}</h4>
                  <span className={styles.evtTime}>{evt.timestamp}</span>
                </div>
                <p className={styles.evtDesc}>{evt.description}</p>
                <div className={styles.hashBox}>
                  <span>Hash: <code>{evt.hash}</code></span>
                  <span className={styles.verifiedTag}>✓ Verified Event</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
