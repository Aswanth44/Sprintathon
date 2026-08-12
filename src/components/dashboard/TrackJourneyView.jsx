import { useState, useEffect } from 'react'
import {
  ArrowLeft,
  CheckCircle2,
  Truck,
  Building2,
  MapPin,
  Calendar,
  ShieldCheck,
  Package,
  UserCheck,
  Clock,
  QrCode,
  Tag,
  Loader2,
} from 'lucide-react'
import { getBatch } from '../../api/batchApi'
import { formatBatchStatus, formatDate } from '../../utils/formatters'
import styles from './TrackJourneyView.module.css'

/**
 * Dedicated Verified Produce Journey Traceability Component
 * Receives the selected batch dynamically (batchId / batch).
 *
 * DEMO API ONLY
 * TODO: Replace with actual backend endpoint:
 * GET /api/batches/{batchId}/journey
 *
 * @param {{
 *   batchId?: string,
 *   batch?: any,
 *   onNavigateView?: (view: string, extraData?: any) => void
 * }} props
 */
export default function TrackJourneyView({ batchId, batch: initialBatch, onNavigateView }) {
  const [loading, setLoading] = useState(!initialBatch)
  const [batchData, setBatchData] = useState(initialBatch || null)

  useEffect(() => {
    // TODO: Fetch verified journey events using batch ID from backend.
    async function loadJourneyData() {
      if (initialBatch && initialBatch.batchId === batchId) {
        setBatchData(initialBatch)
        setLoading(false)
        return
      }

      const idToFetch = batchId || initialBatch?.batchId || 'UZH-TOM-00128'
      setLoading(true)
      try {
        const fetched = await getBatch(idToFetch)
        setBatchData(fetched)
      } catch (err) {
        console.error('Failed to load batch journey details:', err)
      } finally {
        setLoading(false)
      }
    }

    loadJourneyData()
  }, [batchId, initialBatch])

  if (loading || !batchData) {
    return (
      <div className={styles.loadingBox}>
        <Loader2 size={36} className={styles.spinner} />
        <p>Loading verified journey for batch...</p>
      </div>
    )
  }

  const cropName = batchData.crop || 'Tomato'
  const displayId = batchData.batchId || 'UZH-TOM-00128'
  const displayStatus = formatBatchStatus(batchData.status || 'IN_TRANSIT')
  const displayDate = formatDate(batchData.harvestDate || '2026-08-10')
  const displayQty = typeof batchData.quantity === 'number' ? `${batchData.quantity} ${batchData.unit || 'kg'}` : batchData.quantity || '500 kg'
  const locationText = batchData.location || `${batchData.village || 'Pollachi'}, ${batchData.district || 'Coimbatore'}, Tamil Nadu`

  // Stage-specific details dictionary based on batch crop/ID
  const journeyDetails = {
    farm: {
      title: 'Farm Harvest',
      status: 'Harvested & Registered',
      location: locationText,
      harvestDate: displayDate,
      batchId: displayId,
      quality: batchData.quality || 'Grade A',
      farmer: 'Aswanth Kumar (ID: UZH-FMR-000128)',
      completed: true,
    },
    pickup: {
      title: 'Farmgate Pickup',
      status: batchData.currentStageIndex >= 1 ? 'Picked Up & Verified' : 'Scheduled',
      pickupTime: '10 Aug 2026, 02:30 PM',
      transporterId: 'TN-37-AG-4921 (Uzhavar Logistics)',
      driverName: 'R. Velumani',
      completed: batchData.currentStageIndex >= 1,
    },
    warehouse: {
      title: 'Cold Storage & Quality Check',
      status: batchData.currentStageIndex >= 2 ? 'Received & Stored' : 'Pending Warehouse Receipt',
      warehouseName: 'UzhavarSetu Cold Hub #4',
      warehouseLocation: 'Pollachi Road, Coimbatore',
      receivedTime: '10 Aug 2026, 06:15 PM',
      tempControl: '12°C Controlled Humidity',
      completed: batchData.currentStageIndex >= 2,
    },
    transport: {
      title: 'Inter-Mandi Transport',
      status: batchData.status === 'IN_TRANSIT' ? 'In Transit to Mandi' : batchData.currentStageIndex > 3 ? 'Completed' : 'Pending Dispatch',
      vehicleNo: 'TN-38-V-8812 (GPS Tracked Reefer Truck)',
      estArrival: '12 Aug 2026, 06:00 AM',
      currentLoc: 'NH-44 Highway near Erode Tollgate',
      completed: batchData.currentStageIndex >= 3,
      isCurrent: batchData.currentStageIndex === 3 || batchData.status === 'IN_TRANSIT',
    },
    buyer: {
      title: 'Buyer Delivery & Payout',
      status: batchData.currentStageIndex >= 4 ? 'Delivered & Payment Released' : 'Pending Final Delivery',
      buyerName: 'GreenFresh Traders',
      destMandi: 'Coimbatore Wholesale Produce Mandi',
      escrowStatus: 'Payment Secured in UzhavarSetu Fair Payout Escrow',
      completed: batchData.currentStageIndex >= 4,
    },
  }

  return (
    <div className={styles.container}>
      {/* Navigation & Header */}
      <div className={styles.topNavRow}>
        <button
          onClick={() => onNavigateView && onNavigateView('batches')}
          className={styles.backBtn}
        >
          <ArrowLeft size={18} /> Back to My Batches
        </button>

        <div className={styles.batchHeaderBadge}>
          <span className={styles.batchIdCode}>{displayId}</span>
          <span className={styles.statusPill}>● {displayStatus}</span>
        </div>
      </div>

      {/* Hero Journey Overview Banner */}
      <div className={styles.heroBanner}>
        <div className={styles.heroLeft}>
          <div className={styles.iconWrap}>
            <Package size={24} />
          </div>
          <div>
            <h2 className={styles.heroTitle}>{cropName} Harvest Journey</h2>
            <p className={styles.heroSub}>
              <MapPin size={13} /> {locationText} • {displayQty} ({batchData.quality || 'Grade A'})
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigateView && onNavigateView('batch-qr', { batch: batchData })}
          className={styles.qrBtn}
        >
          <QrCode size={16} /> View Batch QR
        </button>
      </div>

      {/* Main Journey Timeline Section */}
      <div className={styles.timelineCard}>
        <div className={styles.timelineHeader}>
          <div className={styles.headerTitleWrap}>
            <ShieldCheck size={20} className={styles.shieldIcon} />
            <div>
              <h3 className={styles.cardTitle}>Verified Farm-to-Market Supply Chain</h3>
              <p className={styles.cardSubtitle}>
                Tamper-evident milestone tracking from farm harvest to buyer delivery
              </p>
            </div>
          </div>
        </div>

        <div className={styles.stagesVerticalTimeline}>
          {/* STAGE 1: FARM */}
          <div className={`${styles.stageNode} ${journeyDetails.farm.completed ? styles.stageDone : ''}`}>
            <div className={styles.nodeIconWrap}>
              <CheckCircle2 size={20} className={styles.doneIcon} />
            </div>
            <div className={styles.stageContent}>
              <div className={styles.stageTitleRow}>
                <h4 className={styles.stageTitle}>1. {journeyDetails.farm.title}</h4>
                <span className={styles.stageStatusDone}>✓ {journeyDetails.farm.status}</span>
              </div>

              <div className={styles.detailGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.dLabel}>Farm Location</span>
                  <span className={styles.dVal}>{journeyDetails.farm.location}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.dLabel}>Harvest Date</span>
                  <span className={styles.dVal}>
                    <Calendar size={13} /> {journeyDetails.farm.harvestDate}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.dLabel}>Batch ID</span>
                  <span className={styles.dValHighlight}>{journeyDetails.farm.batchId}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.dLabel}>Registered Farmer</span>
                  <span className={styles.dVal}>{journeyDetails.farm.farmer}</span>
                </div>
              </div>
            </div>
          </div>

          {/* STAGE 2: PICKUP */}
          <div className={`${styles.stageNode} ${journeyDetails.pickup.completed ? styles.stageDone : ''}`}>
            <div className={styles.nodeIconWrap}>
              {journeyDetails.pickup.completed ? (
                <CheckCircle2 size={20} className={styles.doneIcon} />
              ) : (
                <Clock size={20} className={styles.pendingIcon} />
              )}
            </div>
            <div className={styles.stageContent}>
              <div className={styles.stageTitleRow}>
                <h4 className={styles.stageTitle}>2. {journeyDetails.pickup.title}</h4>
                <span className={journeyDetails.pickup.completed ? styles.stageStatusDone : styles.stageStatusPending}>
                  {journeyDetails.pickup.completed ? '✓ Picked Up' : 'Scheduled'}
                </span>
              </div>

              <div className={styles.detailGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.dLabel}>Pickup Date &amp; Time</span>
                  <span className={styles.dVal}>{journeyDetails.pickup.pickupTime}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.dLabel}>Transporter ID</span>
                  <span className={styles.dVal}>{journeyDetails.pickup.transporterId}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.dLabel}>Driver Name</span>
                  <span className={styles.dVal}>{journeyDetails.pickup.driverName}</span>
                </div>
              </div>
            </div>
          </div>

          {/* STAGE 3: WAREHOUSE */}
          <div className={`${styles.stageNode} ${journeyDetails.warehouse.completed ? styles.stageDone : ''}`}>
            <div className={styles.nodeIconWrap}>
              {journeyDetails.warehouse.completed ? (
                <CheckCircle2 size={20} className={styles.doneIcon} />
              ) : (
                <Building2 size={20} className={styles.pendingIcon} />
              )}
            </div>
            <div className={styles.stageContent}>
              <div className={styles.stageTitleRow}>
                <h4 className={styles.stageTitle}>3. {journeyDetails.warehouse.title}</h4>
                <span className={journeyDetails.warehouse.completed ? styles.stageStatusDone : styles.stageStatusPending}>
                  {journeyDetails.warehouse.completed ? '✓ Received & Stored' : 'Pending'}
                </span>
              </div>

              <div className={styles.detailGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.dLabel}>Warehouse Name</span>
                  <span className={styles.dVal}>{journeyDetails.warehouse.warehouseName}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.dLabel}>Warehouse Location</span>
                  <span className={styles.dVal}>{journeyDetails.warehouse.warehouseLocation}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.dLabel}>Received Time</span>
                  <span className={styles.dVal}>{journeyDetails.warehouse.receivedTime}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.dLabel}>Climate Control</span>
                  <span className={styles.dVal}>{journeyDetails.warehouse.tempControl}</span>
                </div>
              </div>
            </div>
          </div>

          {/* STAGE 4: TRANSPORT */}
          <div className={`${styles.stageNode} ${journeyDetails.transport.isCurrent ? styles.stageActive : journeyDetails.transport.completed ? styles.stageDone : ''}`}>
            <div className={styles.nodeIconWrap}>
              {journeyDetails.transport.isCurrent ? (
                <Truck size={20} className={styles.activeIcon} />
              ) : journeyDetails.transport.completed ? (
                <CheckCircle2 size={20} className={styles.doneIcon} />
              ) : (
                <Truck size={20} className={styles.pendingIcon} />
              )}
            </div>
            <div className={styles.stageContent}>
              <div className={styles.stageTitleRow}>
                <h4 className={styles.stageTitle}>4. {journeyDetails.transport.title}</h4>
                <span className={journeyDetails.transport.isCurrent ? styles.stageStatusActive : journeyDetails.transport.completed ? styles.stageStatusDone : styles.stageStatusPending}>
                  {journeyDetails.transport.isCurrent ? '● In Transit' : journeyDetails.transport.completed ? '✓ Completed' : 'Pending Dispatch'}
                </span>
              </div>

              <div className={styles.detailGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.dLabel}>Transport Vehicle</span>
                  <span className={styles.dVal}>{journeyDetails.transport.vehicleNo}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.dLabel}>Live Location Status</span>
                  <span className={styles.dValHighlight}>{journeyDetails.transport.currentLoc}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.dLabel}>Estimated Mandi Arrival</span>
                  <span className={styles.dVal}>{journeyDetails.transport.estArrival}</span>
                </div>
              </div>
            </div>
          </div>

          {/* STAGE 5: BUYER */}
          <div className={`${styles.stageNode} ${journeyDetails.buyer.completed ? styles.stageDone : ''}`}>
            <div className={styles.nodeIconWrap}>
              {journeyDetails.buyer.completed ? (
                <UserCheck size={20} className={styles.doneIcon} />
              ) : (
                <Tag size={20} className={styles.pendingIcon} />
              )}
            </div>
            <div className={styles.stageContent}>
              <div className={styles.stageTitleRow}>
                <h4 className={styles.stageTitle}>5. {journeyDetails.buyer.title}</h4>
                <span className={journeyDetails.buyer.completed ? styles.stageStatusDone : styles.stageStatusPending}>
                  {journeyDetails.buyer.completed ? '✓ Delivered & Paid' : '○ Pending Final Delivery'}
                </span>
              </div>

              <div className={styles.detailGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.dLabel}>Assigned Buyer</span>
                  <span className={styles.dValBold}>{journeyDetails.buyer.buyerName}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.dLabel}>Destination Mandi</span>
                  <span className={styles.dVal}>{journeyDetails.buyer.destMandi}</span>
                </div>
                <div className={styles.detailItem} style={{ gridColumn: 'span 2' }}>
                  <span className={styles.dLabel}>Fair Payout Security</span>
                  <span className={styles.dVal}>{journeyDetails.buyer.escrowStatus}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
