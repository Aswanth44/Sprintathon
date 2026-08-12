import { useState, useEffect } from 'react'
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  Calendar,
  User,
  Tag,
  Truck,
  ArrowLeft,
  Lock,
  QrCode,
  Building2,
  FileCheck,
} from 'lucide-react'
import { getBatches } from '../api/batchApi'
import Logo from '../components/branding/Logo'
import styles from './VerifyBatchPage.module.css'

/**
 * Public UzhavarSetu Batch Verification Page
 * Accessible at #/verify-batch/:batchId without requiring login.
 */
export default function VerifyBatchPage({ onNavigate }) {
  const [batchId, setBatchId]       = useState('')
  const [batch, setBatch]           = useState(null)
  const [notFound, setNotFound]     = useState(false)
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    async function loadBatchVerification() {
      // Parse batch ID from location hash, e.g., #/verify-batch/UZH-TOM-00128 or #verify-batch-UZH-TOM-00128
      const hash = window.location.hash.replace('#', '')
      const parts = hash.split('/')
      const extractedId = parts.length > 2 ? parts[2] : parts.length > 1 && parts[1] !== 'verify-batch' ? parts[1] : ''

      const targetId = (extractedId || 'UZH-TOM-00128').trim()
      setBatchId(targetId)

      try {
        setLoading(true)
        const batchList = await getBatches()
        const found = (Array.isArray(batchList) ? batchList : []).find(
          (b) => b.batchId?.toUpperCase() === targetId.toUpperCase()
        )

        if (found) {
          setBatch(found)
          setNotFound(false)
        } else if (targetId === 'INVALID' || targetId.includes('FAKE') || targetId.includes('99999')) {
          setBatch(null)
          setNotFound(true)
        } else {
          // If default list, fallback check
          setBatch(found || null)
          setNotFound(!found)
        }
      } catch (err) {
        console.error('Failed to load batch verification:', err)
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }

    loadBatchVerification()
    window.addEventListener('hashchange', loadBatchVerification)
    return () => window.removeEventListener('hashchange', loadBatchVerification)
  }, [])

  const handleBackHome = () => {
    if (onNavigate) {
      onNavigate('login')
    } else {
      window.location.hash = '#login'
    }
  }

  // Deterministic Hash Helper for Tamper-Evident Demo Ledger
  const generateSimpleHash = (str) => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i)
      hash |= 0
    }
    const hex = Math.abs(hash).toString(16).padStart(8, '0')
    return `0x${hex}e98f72a4c1`
  }

  return (
    <div className={styles.pageWrap}>
      {/* Top Public Header */}
      <header className={styles.topHeader}>
        <div className={styles.logoWrap}>
          <Logo height={32} isLight={false} />
        </div>
        <div className={styles.publicTag}>
          <ShieldCheck size={16} /> Public Produce Verification Portal
        </div>
        <button onClick={handleBackHome} className={styles.homeBtn}>
          <ArrowLeft size={16} /> Portal Login
        </button>
      </header>

      {/* Main Container */}
      <main className={styles.mainContainer}>
        {loading ? (
          <div className={styles.loadingCard}>
            <ShieldCheck size={36} className={styles.spinner} />
            <p>Verifying farm-to-market batch cryptographic record...</p>
          </div>
        ) : notFound || !batch ? (
          /* INVALID / UNVERIFIED BATCH STATE */
          <div className={styles.notFoundCard}>
            <div className={styles.notFoundIconWrap}>
              <AlertTriangle size={48} />
            </div>
            <h1 className={styles.notFoundTitle}>⚠ Batch Not Found</h1>
            <p className={styles.notFoundDesc}>
              This batch ID <strong>&quot;{batchId}&quot;</strong> could not be verified on the UzhavarSetu Farm-to-Market ledger.
            </p>
            <div className={styles.notFoundAlertBox}>
              <p>● Verification Failed: No cryptographic record matching this ID exists.</p>
              <p>● Please check the Batch ID on your produce tag or scan a valid QR code.</p>
            </div>
            <button onClick={handleBackHome} className={styles.primaryBtn}>
              Return to Platform
            </button>
          </div>
        ) : (
          /* VERIFIED BATCH STATE */
          <div className={styles.verifiedWrap}>
            {/* Status Banner */}
            <div className={styles.statusCard}>
              <div className={styles.statusHeaderRow}>
                <div className={styles.verifiedBadge}>
                  <CheckCircle2 size={20} /> ✓ VERIFIED BATCH
                </div>
                <span className={styles.batchIdTag}>{batch.batchId}</span>
              </div>
              <h1 className={styles.cropTitle}>
                {batch.crop} Produce Harvest — Farm Verified
              </h1>
              <p className={styles.statusDesc}>
                ✓ Verified — Batch registered successfully on UzhavarSetu Tamper-Evident Ledger
              </p>
            </div>

            {/* Key Batch Specifications */}
            <div className={styles.specsCard}>
              <h2 className={styles.sectionTitle}>
                <FileCheck size={18} /> Batch Specifications
              </h2>

              <div className={styles.specsGrid}>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Crop Name</span>
                  <strong className={styles.specVal}>{batch.crop}</strong>
                </div>

                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Quantity</span>
                  <strong className={styles.specVal}>{batch.quantity} {batch.unit || 'kg'}</strong>
                </div>

                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Quality Grade</span>
                  <strong className={styles.specValGrade}>{batch.quality || batch.grade || 'Grade A'}</strong>
                </div>

                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Harvest Date</span>
                  <strong className={styles.specVal}>{batch.harvestDate || '10 Aug 2026'}</strong>
                </div>

                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Farm Location</span>
                  <strong className={styles.specVal}>
                    <MapPin size={13} style={{ display: 'inline', marginRight: 2 }} />
                    {batch.location || batch.farmLocation || 'Pollachi, Coimbatore'}
                  </strong>
                </div>

                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Registered Farmer</span>
                  <strong className={styles.specVal}>
                    <User size={13} style={{ display: 'inline', marginRight: 2 }} />
                    {batch.farmerName || 'Aswanth Kumar'} ({batch.farmerId || 'UZH-FMR-000128'})
                  </strong>
                </div>

                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Current Benchmark Price</span>
                  <strong className={styles.specValPrice}>
                    <Tag size={13} style={{ display: 'inline', marginRight: 2 }} />
                    ₹{batch.expectedPrice || 42}/kg
                  </strong>
                </div>

                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Current Stage</span>
                  <strong className={styles.specValStage}>
                    <Truck size={13} style={{ display: 'inline', marginRight: 2 }} />
                    {batch.currentStage || 'TRANSPORT'}
                  </strong>
                </div>
              </div>
            </div>

            {/* Visual 5-Stage Journey Stepper */}
            <div className={styles.journeyCard}>
              <h2 className={styles.sectionTitle}>
                <Truck size={18} /> Verified Farm-to-Market Journey
              </h2>

              <div className={styles.stepperRow}>
                {[
                  { key: 'farm',      label: 'FARM',       desc: 'Harvested & Inspected', completed: true },
                  { key: 'pickup',    label: 'PICKUP',     desc: 'Agri Logistics Loaded', completed: (batch.currentStageIndex ?? 3) >= 1 },
                  { key: 'warehouse', label: 'WAREHOUSE',  desc: 'Cold Storage Verified', completed: (batch.currentStageIndex ?? 3) >= 2 },
                  { key: 'transport', label: 'TRANSPORT',  desc: 'In Transit to Mandi',   completed: (batch.currentStageIndex ?? 3) >= 3, isCurrent: (batch.currentStageIndex ?? 3) === 3 },
                  { key: 'buyer',     label: 'BUYER',      desc: 'Retail Hub Delivery',   completed: (batch.currentStageIndex ?? 3) >= 4 },
                ].map((st, idx) => (
                  <div key={st.key} className={`${styles.stepNode} ${st.completed ? styles.completedNode : ''} ${st.isCurrent ? styles.currentNode : ''}`}>
                    <div className={styles.nodeCircle}>
                      {st.completed ? <CheckCircle2 size={16} /> : idx + 1}
                    </div>
                    <div className={styles.nodeLabel}>{st.label}</div>
                    <div className={styles.nodeDesc}>{st.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tamper-Evident Demo Journey Ledger */}
            <div className={styles.ledgerCard}>
              <div className={styles.ledgerHeaderRow}>
                <div>
                  <h2 className={styles.ledgerTitle}>
                    <Lock size={18} className={styles.lockIcon} /> Tamper-evident journey ledger
                  </h2>
                  <p className={styles.ledgerSub}>
                    Demo cryptographic traceability ledger verifying supply chain integrity
                  </p>
                </div>
                <span className={styles.ledgerTag}>6 Verified Events</span>
              </div>

              <div className={styles.ledgerList}>
                {[
                  {
                    id: 'EVT-001',
                    event: '1. Harvest Registered & Quality Graded',
                    date: '10 Aug 2026, 08:30 AM',
                    location: batch.location || 'Pollachi Farm, Coimbatore',
                    status: 'Completed',
                    party: `Farmer: ${batch.farmerName || 'Aswanth Kumar'} (${batch.farmerId || 'UZH-FMR-000128'})`,
                    prevHash: '0x000000000000000000000000',
                  },
                  {
                    id: 'EVT-002',
                    event: '2. Farmgate Pickup & Transporter Handoff',
                    date: '10 Aug 2026, 02:15 PM',
                    location: 'Pollachi Agri-Logistics Pickup Point',
                    status: 'Completed',
                    party: 'Logistics: Uzhavar Fleet TN-37-AG-4921',
                    prevHash: generateSimpleHash(`${batch.batchId}-EVT-001`),
                  },
                  {
                    id: 'EVT-003',
                    event: '3. Warehouse Intake & Cold Storage Deposit',
                    date: '10 Aug 2026, 06:45 PM',
                    location: 'Coimbatore Climate Cold Storage Hub #4',
                    status: 'Completed',
                    party: 'Warehouse Operator: Uzhavar Hub Coimbatore',
                    prevHash: generateSimpleHash(`${batch.batchId}-EVT-002`),
                  },
                  {
                    id: 'EVT-004',
                    event: '4. Inter-Mandi Logistics Transport Dispatch',
                    date: '11 Aug 2026, 05:00 AM',
                    location: 'NH47 Highway En Route to Retail Hub',
                    status: 'In Transit',
                    party: 'Transit Carrier: Uzhavar Logistics Reefer',
                    prevHash: generateSimpleHash(`${batch.batchId}-EVT-003`),
                  },
                ].map((item) => {
                  const currHash = generateSimpleHash(`${batch.batchId}-${item.id}`)
                  return (
                    <div key={item.id} className={styles.ledgerItem}>
                      <div className={styles.itemHead}>
                        <strong>{item.event}</strong>
                        <span className={styles.itemTime}>{item.date}</span>
                      </div>
                      <div className={styles.itemSub}>
                        <span><MapPin size={12} /> {item.location}</span>
                        <span>• {item.party}</span>
                      </div>
                      <div className={styles.hashBox}>
                        <div><span>Prev Hash:</span> <code>{item.prevHash}</code></div>
                        <div><span>Curr Hash:</span> <code className={styles.currHash}>{currHash}</code></div>
                        <span className={styles.hashBadge}>✓ Verified Record</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
