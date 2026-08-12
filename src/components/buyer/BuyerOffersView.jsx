import { useState, useEffect } from 'react'
import {
  HandCoins,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  MapPin,
  User,
  ArrowRight,
  ShieldAlert,
  Eye,
} from 'lucide-react'
import { getOffers, respondToCounter } from '../../api/offerApi'
import styles from './BuyerOffersView.module.css'

/**
 * Buyer My Offers Page Component
 * Formatted for clean mobile responsiveness (320px - 430px) & Desktop.
 */
export default function BuyerOffersView() {
  const [offers, setOffers]       = useState([])
  const [activeTab, setActiveTab] = useState('ALL')
  const [loading, setLoading]     = useState(true)
  const [toastMsg, setToastMsg]   = useState('')

  const loadOffers = async () => {
    try {
      setLoading(true)
      const data = await getOffers()
      setOffers(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to load buyer offers:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOffers()
  }, [])

  const handleRespondCounter = async (offerId, action) => {
    try {
      await respondToCounter(offerId, action)
      setToastMsg(`Counter offer ${action === 'accept' ? 'Accepted' : 'Rejected'} successfully!`)
      setTimeout(() => setToastMsg(''), 4000)
      loadOffers()
    } catch (err) {
      console.error('Failed to respond to counter offer:', err)
    }
  }

  const filteredOffers = offers.filter((o) => {
    if (activeTab === 'ALL') return true
    if (activeTab === 'PENDING') return o.status === 'PENDING'
    if (activeTab === 'ACCEPTED') return o.status === 'ACCEPTED'
    if (activeTab === 'REJECTED') return o.status === 'REJECTED'
    if (activeTab === 'COUNTERED') return o.status === 'COUNTERED'
    return true
  })

  return (
    <div className={styles.container}>
      {/* Toast Notification */}
      {toastMsg && (
        <div className={styles.toastPopup}>
          <CheckCircle2 size={18} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>My Purchase Offers</h1>
          <p className={styles.subtitle}>Track offer statuses, negotiate counter offers, and finalize procurement</p>
        </div>
      </div>

      {/* Filter Tabs - Horizontal Scrollable Row */}
      <div className={styles.tabsRow}>
        <button
          onClick={() => setActiveTab('ALL')}
          className={`${styles.tabBtn} ${activeTab === 'ALL' ? styles.activeTab : ''}`}
        >
          All Offers ({offers.length})
        </button>
        <button
          onClick={() => setActiveTab('PENDING')}
          className={`${styles.tabBtn} ${activeTab === 'PENDING' ? styles.activeTab : ''}`}
        >
          Pending ({offers.filter((o) => o.status === 'PENDING').length})
        </button>
        <button
          onClick={() => setActiveTab('COUNTERED')}
          className={`${styles.tabBtn} ${activeTab === 'COUNTERED' ? styles.activeTab : ''}`}
        >
          Countered ({offers.filter((o) => o.status === 'COUNTERED').length})
        </button>
        <button
          onClick={() => setActiveTab('ACCEPTED')}
          className={`${styles.tabBtn} ${activeTab === 'ACCEPTED' ? styles.activeTab : ''}`}
        >
          Accepted ({offers.filter((o) => o.status === 'ACCEPTED').length})
        </button>
        <button
          onClick={() => setActiveTab('REJECTED')}
          className={`${styles.tabBtn} ${activeTab === 'REJECTED' ? styles.activeTab : ''}`}
        >
          Rejected ({offers.filter((o) => o.status === 'REJECTED').length})
        </button>
      </div>

      {/* Offers Cards Grid */}
      {loading ? (
        <div className={styles.loadingState}>
          <HandCoins size={32} className={styles.spinner} />
          <p>Loading your purchase offers...</p>
        </div>
      ) : filteredOffers.length === 0 ? (
        <div className={styles.emptyState}>
          <HandCoins size={40} className={styles.emptyIcon} />
          <h3>No Offers Found</h3>
          <p>No purchase offers found in this category.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredOffers.map((offer) => {
            const isCountered = offer.status === 'COUNTERED'
            const isAccepted = offer.status === 'ACCEPTED'
            const isRejected = offer.status === 'REJECTED'
            const isPending = offer.status === 'PENDING'
            const totalValue = (offer.quantity || 500) * (offer.offeredPrice || 44)

            return (
              <div key={offer.offerId} className={styles.card}>
                {/* Header: Crop + Status */}
                <div className={styles.cardHeader}>
                  <div className={styles.cropTitleWrap}>
                    <h3 className={styles.cropName}>{offer.crop}</h3>
                  </div>

                  <span className={`${styles.statusBadge} ${
                    isAccepted ? styles.bgAccepted :
                    isRejected ? styles.bgRejected :
                    isCountered ? styles.bgCountered : styles.bgPending
                  }`}>
                    {isAccepted && <CheckCircle2 size={12} />}
                    {isRejected && <XCircle size={12} />}
                    {isCountered && <RotateCcw size={12} />}
                    {isPending && <Clock size={12} />}
                    {offer.statusLabel || offer.status}
                  </span>
                </div>

                {/* Batch ID */}
                <div className={styles.batchIdCode}>{offer.batchId}</div>

                {/* Farmer & Location Info */}
                <div className={styles.infoMetaGrid}>
                  <div className={styles.metaBlock}>
                    <span className={styles.metaLabel}>Farmer</span>
                    <strong className={styles.metaVal}>
                      <User size={12} /> {offer.farmerName || 'Aswanth Kumar'}
                    </strong>
                  </div>

                  <div className={styles.metaBlock}>
                    <span className={styles.metaLabel}>Location</span>
                    <strong className={styles.metaVal}>
                      <MapPin size={12} /> {offer.farmerLocation || 'Pollachi, Coimbatore'}
                    </strong>
                  </div>
                </div>

                {/* Financial Table Box */}
                <div className={styles.tableBox}>
                  <div className={styles.tableRow}>
                    <span className={styles.label}>Quantity</span>
                    <span className={styles.val}>{offer.quantity} kg</span>
                  </div>

                  <div className={styles.tableRow}>
                    <span className={styles.label}>Offer Price</span>
                    <span className={styles.valOffer}>₹{offer.offeredPrice}/kg</span>
                  </div>

                  <div className={`${styles.tableRow} ${styles.netRow}`}>
                    <span className={styles.netLabel}>Total Value</span>
                    <span className={styles.netVal}>₹{totalValue.toLocaleString()}</span>
                  </div>
                </div>

                {/* Counter Offer Box */}
                {isCountered && offer.counterOffer && (
                  <div className={styles.counterBox}>
                    <div className={styles.counterHeader}>
                      <ShieldAlert size={16} /> Counter Offer Received from Farmer!
                    </div>

                    <div className={styles.counterGrid}>
                      <div>
                        <span className={styles.counterSubLabel}>Original Offer</span>
                        <div className={styles.counterPriceText}>₹{offer.offeredPrice}/kg</div>
                      </div>
                      <div className={styles.arrowCol}>
                        <ArrowRight size={18} />
                      </div>
                      <div>
                        <span className={styles.counterSubLabel}>Farmer Counter</span>
                        <div className={`${styles.counterPriceText} ${styles.counterPriceHighlight}`}>
                          ₹{offer.counterOffer.counterPrice}/kg
                        </div>
                      </div>
                    </div>

                    {offer.counterOffer.message && (
                      <div className={styles.farmerNote}>
                        &quot;{offer.counterOffer.message}&quot;
                      </div>
                    )}

                    <div className={styles.counterActions}>
                      <button
                        type="button"
                        onClick={() => handleRespondCounter(offer.offerId, 'accept')}
                        className={styles.acceptCounterBtn}
                      >
                        <CheckCircle2 size={15} /> Accept Counter (₹{offer.counterOffer.counterPrice}/kg)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRespondCounter(offer.offerId, 'reject')}
                        className={styles.rejectCounterBtn}
                      >
                        <XCircle size={15} /> Reject Counter
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
