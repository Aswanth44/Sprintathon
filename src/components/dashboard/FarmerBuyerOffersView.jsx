import { useState, useEffect } from 'react'
import {
  HandCoins,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ShieldCheck,
  Tag,
  MapPin,
  Clock,
  Loader2,
  X,
} from 'lucide-react'
import { getOffers, updateOfferStatus, counterOffer } from '../../api/offerApi'
import styles from './FarmerBuyerOffersView.module.css'

/**
 * Interactive Farmer Buyer Offers Management Hub
 * Displays all incoming buyer offers with real-time Accept, Reject, and Counter Offer modals.
 */
export default function FarmerBuyerOffersView() {
  const [offers, setOffers]           = useState([])
  const [loading, setLoading]         = useState(true)

  // Modals state
  const [confirmAcceptOffer, setConfirmAcceptOffer] = useState(null)
  const [confirmRejectOffer, setConfirmRejectOffer] = useState(null)
  const [counterModalOffer, setCounterModalOffer]   = useState(null)

  // Counter offer form state
  const [counterPrice, setCounterPrice]   = useState('')
  const [counterQty, setCounterQty]       = useState('')
  const [counterMsg, setCounterMsg]       = useState('')
  const [submitting, setSubmitting]       = useState(false)
  const [toastMsg, setToastMsg]           = useState('')

  const loadOffers = async () => {
    try {
      setLoading(true)
      const data = await getOffers()
      setOffers(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to load farmer offers:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOffers()
  }, [])

  const handleAcceptConfirm = async () => {
    if (!confirmAcceptOffer) return
    setSubmitting(true)
    try {
      await updateOfferStatus(confirmAcceptOffer.offerId, 'ACCEPTED')
      setToastMsg(`Offer accepted! Batch status updated to Negotiated / Delivery Scheduled.`)
      setTimeout(() => setToastMsg(''), 4000)
      setConfirmAcceptOffer(null)
      loadOffers()
    } catch (err) {
      console.error('Failed to accept offer:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleRejectConfirm = async () => {
    if (!confirmRejectOffer) return
    setSubmitting(true)
    try {
      await updateOfferStatus(confirmRejectOffer.offerId, 'REJECTED')
      setToastMsg(`Offer rejected. Activity recorded.`)
      setTimeout(() => setToastMsg(''), 4000)
      setConfirmRejectOffer(null)
      loadOffers()
    } catch (err) {
      console.error('Failed to reject offer:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleCounterSubmit = async (e) => {
    e.preventDefault()
    if (!counterModalOffer || !counterPrice) return
    setSubmitting(true)
    try {
      await counterOffer(counterModalOffer.offerId, {
        counterPrice: Number(counterPrice),
        quantity: Number(counterQty) || counterModalOffer.quantity,
        message: counterMsg,
      })
      setToastMsg(`Counter offer of ₹${counterPrice}/kg sent to ${counterModalOffer.buyerName}!`)
      setTimeout(() => setToastMsg(''), 4000)
      setCounterModalOffer(null)
      loadOffers()
    } catch (err) {
      console.error('Failed to counter offer:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const openCounterModal = (offer) => {
    setCounterModalOffer(offer)
    setCounterPrice(String(offer.offeredPrice + 2))
    setCounterQty(String(offer.quantity))
    setCounterMsg('')
  }

  return (
    <div className={styles.container}>
      {/* Toast Notification */}
      {toastMsg && (
        <div className={styles.toastPopup}>
          <CheckCircle2 size={18} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Tab Section Header */}
      <div className={styles.tabHeaderRow}>
        <div>
          <h2 className={styles.tabTitle}>Buyer Offers &amp; Bids</h2>
          <p className={styles.tabSubtitle}>Review buyer purchase bids, calculate net payouts, accept or issue counter offers</p>
        </div>
      </div>

      {loading ? (
        <div className={styles.loadingState}>
          <Loader2 size={32} className={styles.spinner} />
          <p>Loading active buyer offers...</p>
        </div>
      ) : offers.length === 0 ? (
        <div className={styles.emptyState}>
          <HandCoins size={40} className={styles.emptyIcon} />
          <h3>No Offers Yet</h3>
          <p>Offers submitted by buyers in the Marketplace will appear here automatically.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {offers.map((offer) => {
            const isPending = offer.status === 'PENDING'
            const isAccepted = offer.status === 'ACCEPTED'
            const isRejected = offer.status === 'REJECTED'
            const isCountered = offer.status === 'COUNTERED'

            const buyerOfferVal = offer.offeredPrice || offer.buyerOffer || 44
            const transportVal = offer.transportCost || 0
            const netVal = offer.netPayout || (buyerOfferVal - transportVal)
            const marketVal = offer.marketPrice || 42

            return (
              <div key={offer.offerId} className={styles.card}>
                {/* Header */}
                <div className={styles.cardHeader}>
                  <div className={styles.headerLeft}>
                    <div className={styles.iconWrap}>
                      <HandCoins size={20} />
                    </div>
                    <div>
                      <h3 className={styles.buyerName}>{offer.buyerName}</h3>
                      <div className={styles.locationSub}>
                        <MapPin size={12} /> {offer.buyerLocation || 'Coimbatore Hub'}
                      </div>
                    </div>
                  </div>

                  <span className={`${styles.statusBadge} ${
                    isAccepted ? styles.bgAccepted :
                    isRejected ? styles.bgRejected :
                    isCountered ? styles.bgCountered : styles.bgPending
                  }`}>
                    <Tag size={12} /> {offer.statusLabel || offer.status}
                  </span>
                </div>

                {/* Batch Meta Banner */}
                <div className={styles.batchBanner}>
                  <div>
                    <span className={styles.batchLabel}>Batch ID</span>
                    <strong className={styles.batchValue}>{offer.batchId} ({offer.crop})</strong>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className={styles.batchLabel}>Requested Quantity</span>
                    <strong className={styles.batchValue}>{offer.quantity} kg</strong>
                  </div>
                </div>

                {/* Financial Table Breakdown */}
                <div className={styles.tableBox}>
                  <div className={styles.tableRow}>
                    <span>Market Benchmark</span>
                    <span className={styles.valMarket}>₹{marketVal}/kg</span>
                  </div>
                  <div className={styles.tableRow}>
                    <span>Buyer Offer</span>
                    <span className={styles.valOffer}>₹{buyerOfferVal}/kg</span>
                  </div>
                  <div className={styles.tableRow}>
                    <span>Transport Deduction</span>
                    <span className={styles.valDeduct}>- ₹{transportVal}/kg</span>
                  </div>
                  <div className={`${styles.tableRow} ${styles.netRow}`}>
                    <span>Net Farmer Payout</span>
                    <span className={styles.valNet}>₹{netVal}/kg</span>
                  </div>
                </div>

                {/* Assessment Badge */}
                <div className={styles.assessmentWrap}>
                  <ShieldCheck size={14} className={styles.shieldIcon} />
                  <span className={styles.assessmentText}>
                    {offer.assessment || (netVal >= marketVal ? '✓ FAIR OFFER' : 'BELOW MARKET')}
                  </span>
                </div>

                {/* Counter Offer Info if already countered */}
                {isCountered && offer.counterOffer && (
                  <div className={styles.counterInfoCard}>
                    <strong>Counter Offer Issued:</strong> ₹{offer.counterOffer.counterPrice}/kg (Net Payout: ₹{offer.counterOffer.netPayout}/kg)
                  </div>
                )}

                {/* Action Buttons for Pending Offers */}
                {isPending && (
                  <div className={styles.actionRow}>
                    <button
                      type="button"
                      onClick={() => setConfirmAcceptOffer(offer)}
                      className={styles.acceptBtn}
                    >
                      <CheckCircle2 size={15} /> Accept
                    </button>
                    <button
                      type="button"
                      onClick={() => openCounterModal(offer)}
                      className={styles.counterBtn}
                    >
                      <RotateCcw size={15} /> Counter Offer
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmRejectOffer(offer)}
                      className={styles.rejectBtn}
                    >
                      <XCircle size={15} /> Reject
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Accept Confirmation Modal */}
      {confirmAcceptOffer && (
        <div className={styles.overlay} onClick={() => setConfirmAcceptOffer(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Accept Buyer Offer?</h3>
              <button onClick={() => setConfirmAcceptOffer(null)} className={styles.closeBtn}><X size={18} /></button>
            </div>
            <div className={styles.modalBody}>
              <p>Are you sure you want to accept this offer from <strong>{confirmAcceptOffer.buyerName}</strong>?</p>
              <div className={styles.modalSummary}>
                <div>Batch: <strong>{confirmAcceptOffer.batchId} ({confirmAcceptOffer.crop})</strong></div>
                <div>Quantity: <strong>{confirmAcceptOffer.quantity} kg</strong></div>
                <div>Buyer Offer: <strong>₹{confirmAcceptOffer.offeredPrice}/kg</strong></div>
                <div>Net Farmer Payout: <strong style={{ color: 'var(--color-green-deep)' }}>₹{confirmAcceptOffer.netPayout}/kg</strong></div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button onClick={() => setConfirmAcceptOffer(null)} className={styles.cancelBtn}>Cancel</button>
              <button onClick={handleAcceptConfirm} disabled={submitting} className={styles.acceptBtn}>
                {submitting ? <Loader2 size={16} className={styles.spinner} /> : 'Confirm & Accept'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Confirmation Modal */}
      {confirmRejectOffer && (
        <div className={styles.overlay} onClick={() => setConfirmRejectOffer(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Reject Buyer Offer?</h3>
              <button onClick={() => setConfirmRejectOffer(null)} className={styles.closeBtn}><X size={18} /></button>
            </div>
            <div className={styles.modalBody}>
              <p>Rejecting offer from <strong>{confirmRejectOffer.buyerName}</strong>. The buyer will be notified.</p>
            </div>
            <div className={styles.modalFooter}>
              <button onClick={() => setConfirmRejectOffer(null)} className={styles.cancelBtn}>Cancel</button>
              <button onClick={handleRejectConfirm} disabled={submitting} className={styles.rejectBtn}>
                {submitting ? <Loader2 size={16} className={styles.spinner} /> : 'Confirm & Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Counter Offer Modal */}
      {counterModalOffer && (
        <div className={styles.overlay} onClick={() => setCounterModalOffer(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Submit Counter Offer</h3>
              <button onClick={() => setCounterModalOffer(null)} className={styles.closeBtn}><X size={18} /></button>
            </div>
            <form onSubmit={handleCounterSubmit} className={styles.modalBody}>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Original Buyer Offer</label>
                <input type="text" readOnly value={`₹${counterModalOffer.offeredPrice}/kg`} className={styles.readOnlyInput} />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Your Counter Price (₹/kg)*</label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={counterPrice}
                  onChange={(e) => setCounterPrice(e.target.value)}
                  className={styles.textInput}
                  placeholder="Enter counter price"
                />
              </div>

              <div className={styles.calcPreview}>
                <span>Transport Deduction: - ₹{counterModalOffer.transportCost}/kg</span>
                <strong>Estimated Net Payout: ₹{(Number(counterPrice) || 0) - (counterModalOffer.transportCost || 0)}/kg</strong>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Message to Buyer (Optional)</label>
                <textarea
                  value={counterMsg}
                  onChange={(e) => setCounterMsg(e.target.value)}
                  rows={2}
                  className={styles.textArea}
                  placeholder="e.g. Higher quality Grade A crop, minimum ₹44 net payout required."
                />
              </div>

              <div className={styles.modalFooter}>
                <button type="button" onClick={() => setCounterModalOffer(null)} className={styles.cancelBtn}>Cancel</button>
                <button type="submit" disabled={submitting} className={styles.counterBtn}>
                  {submitting ? <Loader2 size={16} className={styles.spinner} /> : 'Send Counter Offer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
