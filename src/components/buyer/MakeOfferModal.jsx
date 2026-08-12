import { useState, useEffect } from 'react'
import { X, HandCoins, CheckCircle2, ShieldCheck, Tag, Loader2, ArrowRight } from 'lucide-react'
import { createOffer } from '../../api/offerApi'
import styles from './MakeOfferModal.module.css'

/**
 * Make Offer Modal Component for Buyer
 * Calculates net farmer payout in real time and assesses offer against market benchmark.
 */
export default function MakeOfferModal({ isOpen, batch, onClose, onOfferSubmitted }) {
  const [purchaseQty, setPurchaseQty]   = useState('500')
  const [offerPrice, setOfferPrice]     = useState('44')
  const [transportCost, setTransportCost] = useState('2')
  const [expectedDate, setExpectedDate] = useState('2026-08-15')
  const [buyerMessage, setBuyerMessage] = useState('')

  const [loading, setLoading]           = useState(false)
  const [submittedOffer, setSubmittedOffer] = useState(null)
  const [error, setError]               = useState('')

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      if (batch) {
        setPurchaseQty(String(batch.quantity || 500))
        const defaultPrice = batch.expectedPrice || (batch.crop === 'Tomato' ? 44 : batch.crop === 'Onion' ? 38 : 28)
        setOfferPrice(String(defaultPrice))
      }
      setSubmittedOffer(null)
      setError('')
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen, batch])

  if (!isOpen || !batch) return null

  const availableQty = batch.quantity || 500
  const cropName = batch.crop || 'Tomato'
  const batchId = batch.batchId || 'UZH-TOM-00128'
  const marketPrice = batch.marketPrice || (cropName === 'Tomato' ? 42 : cropName === 'Onion' ? 35 : 28)

  // Clean numeric values (strip leading zeros)
  const handleNumberInput = (rawVal, setter) => {
    const cleaned = rawVal.replace(/^0+(?=\d)/, '')
    setter(cleaned)
  }

  const numericQty = Number(purchaseQty) || 0
  const numericPrice = Number(offerPrice) || 0
  const numericTransport = Number(transportCost) || 0
  const netPayout = numericPrice - numericTransport

  const isFairOffer = netPayout >= marketPrice
  const assessmentText = isFairOffer ? '✓ FAIR OFFER' : 'BELOW MARKET BENCHMARK'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!numericQty || numericQty <= 0) {
      setError('Please enter a valid purchase quantity greater than 0 kg.')
      return
    }

    if (numericQty > availableQty) {
      setError(`Requested quantity cannot exceed available batch quantity (${availableQty} kg).`)
      return
    }

    if (!numericPrice || numericPrice <= 0) {
      setError('Please enter a valid offer price per kg.')
      return
    }

    setLoading(true)

    try {
      const payload = {
        batchId,
        crop: cropName,
        quantity: numericQty,
        unit: batch.unit || 'kg',
        farmerName: batch.farmerName || 'Aswanth Kumar',
        farmerId: batch.farmerId || 'UZH-FMR-000128',
        farmerLocation: batch.location || batch.farmLocation || 'Pollachi, Coimbatore',
        buyerName: 'Coimbatore Fresh Retail',
        buyerLocation: 'Coimbatore Central Hub',
        marketPrice,
        offeredPrice: numericPrice,
        transportCost: numericTransport,
        expectedDelivery: expectedDate,
        buyerMessage: buyerMessage.trim(),
        assessment: assessmentText,
      }

      const res = await createOffer(payload)
      if (res && res.offer) {
        setSubmittedOffer(res.offer)
        if (onOfferSubmitted) onOfferSubmitted(res.offer)
      } else {
        setSubmittedOffer({
          ...payload,
          offerId: `OFF-00${Math.floor(10 + Math.random() * 90)}`,
          status: 'PENDING',
          netPayout,
        })
      }
    } catch {
      setError('Failed to submit offer. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.headerTitleWrap}>
            <HandCoins className={styles.headerIcon} size={22} />
            <div>
              <h2 className={styles.modalTitle}>Make Purchase Offer</h2>
              <span className={styles.batchSub}>{cropName} ({batchId})</span>
            </div>
          </div>
          <button onClick={onClose} className={styles.closeBtn} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        {submittedOffer ? (
          /* Confirmation State */
          <div className={styles.successBody}>
            <div className={styles.successIconWrap}>
              <CheckCircle2 size={40} />
            </div>
            <h3 className={styles.successTitle}>Offer Submitted Successfully!</h3>
            <p className={styles.successDesc}>
              Your offer has been submitted directly to the farmer for review.
            </p>

            <div className={styles.summaryCard}>
              <div className={styles.summaryRow}>
                <span>Batch ID</span>
                <strong>{submittedOffer.batchId}</strong>
              </div>
              <div className={styles.summaryRow}>
                <span>Purchase Quantity</span>
                <strong>{submittedOffer.quantity} kg</strong>
              </div>
              <div className={styles.summaryRow}>
                <span>Offer Price</span>
                <strong>₹{submittedOffer.offeredPrice}/kg</strong>
              </div>
              <div className={styles.summaryRow}>
                <span>Transport Cost</span>
                <strong style={{ color: 'var(--color-error)' }}>- ₹{submittedOffer.transportCost}/kg</strong>
              </div>
              <div className={`${styles.summaryRow} ${styles.summaryNet}`}>
                <span>Net Farmer Payout</span>
                <strong style={{ color: 'var(--color-green-deep)', fontSize: '1.1rem' }}>
                  ₹{submittedOffer.netPayout}/kg
                </strong>
              </div>
              <div className={styles.summaryRow}>
                <span>Status</span>
                <span className={styles.statusPending}>PENDING REVIEW</span>
              </div>
            </div>

            <button type="button" onClick={onClose} className={styles.doneBtn}>
              Done &amp; Close
            </button>
          </div>
        ) : (
          /* Form Input State */
          <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.errorAlert}>{error}</div>}

            {/* Read-Only Info */}
            <div className={styles.readOnlyBanner}>
              <div>
                <span className={styles.bannerLabel}>Crop &amp; Batch</span>
                <span className={styles.bannerValue}>{cropName} — {batchId}</span>
              </div>
              <div>
                <span className={styles.bannerLabel}>Available Stock</span>
                <span className={styles.bannerValue}>{availableQty} kg</span>
              </div>
            </div>

            {/* Quantity Input */}
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Purchase Quantity (kg)*</label>
              <input
                type="number"
                min="1"
                max={availableQty}
                value={purchaseQty}
                onChange={(e) => handleNumberInput(e.target.value, setPurchaseQty)}
                required
                className={styles.textInput}
                placeholder="Enter quantity in kg"
              />
            </div>

            {/* Price & Transport Grid */}
            <div className={styles.grid2}>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Offer Price (₹/kg)*</label>
                <input
                  type="number"
                  min="1"
                  step="0.5"
                  value={offerPrice}
                  onChange={(e) => handleNumberInput(e.target.value, setOfferPrice)}
                  required
                  className={styles.textInput}
                  placeholder="e.g. 44"
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Transport Cost (₹/kg)*</label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={transportCost}
                  onChange={(e) => handleNumberInput(e.target.value, setTransportCost)}
                  required
                  className={styles.textInput}
                  placeholder="e.g. 2"
                />
              </div>
            </div>

            {/* Expected Delivery Date */}
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Expected Delivery Date</label>
              <input
                type="date"
                value={expectedDate}
                onChange={(e) => setExpectedDate(e.target.value)}
                className={styles.textInput}
              />
            </div>

            {/* Optional Message */}
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Buyer Note / Terms (Optional)</label>
              <textarea
                value={buyerMessage}
                onChange={(e) => setBuyerMessage(e.target.value)}
                rows={2}
                className={styles.textArea}
                placeholder="e.g. Require crates, payment via UPI on pickup..."
              />
            </div>

            {/* Live Financial Breakdown Card */}
            <div className={styles.calcCard}>
              <div className={styles.calcTitle}>Live Net Payout Calculation</div>
              <div className={styles.calcRow}>
                <span>Buyer Offer</span>
                <span className={styles.valOffer}>₹{numericPrice}/kg</span>
              </div>
              <div className={styles.calcRow}>
                <span>Transport Cost</span>
                <span className={styles.valDeduct}>- ₹{numericTransport}/kg</span>
              </div>
              <div className={`${styles.calcRow} ${styles.netCalcRow}`}>
                <span>Net Farmer Payout</span>
                <span className={styles.valNet}>₹{netPayout}/kg</span>
              </div>

              <div className={styles.calcRow} style={{ marginTop: 6, paddingTop: 6, borderTop: '1px dashed var(--color-border-light)' }}>
                <span>Market Benchmark</span>
                <span>₹{marketPrice}/kg</span>
              </div>

              <div className={`${styles.assessmentBadge} ${isFairOffer ? styles.fair : styles.below}`}>
                <ShieldCheck size={14} /> {assessmentText}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className={styles.btnRow}>
              <button type="button" onClick={onClose} className={styles.cancelBtn}>
                Cancel
              </button>
              <button type="submit" disabled={loading} className={styles.submitBtn}>
                {loading ? <Loader2 size={18} className={styles.spinner} /> : <><HandCoins size={18} /> Submit Offer</>}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
