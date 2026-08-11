import { HandCoins, ArrowRight, ShieldCheck, Tag } from 'lucide-react'
import styles from './OfferCard.module.css'

/**
 * Best Current Buyer Offer Card Component
 * Receives top offer data from offerApi service
 * @param {{ offer?: any, totalOffersCount?: number, onViewOffersClick?: () => void }} props
 */
export default function OfferCard({ offer: inputOffer, totalOffersCount = 5, onViewOffersClick }) {
  const topOffer = inputOffer || {
    offerId: 'OFF-001',
    buyerName: 'GreenFresh Traders',
    marketPrice: 42,
    offeredPrice: 44,
    buyerOffer: 44,
    transportCost: 2,
    netPayout: 42,
    statusLabel: 'Fair Offer',
  }

  const buyerOfferPrice = topOffer.offeredPrice || topOffer.buyerOffer || 44
  const statusText = topOffer.statusLabel || topOffer.status || 'Fair Offer'

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.headerTitleWrap}>
          <div className={styles.iconWrap}>
            <HandCoins size={20} />
          </div>
          <div>
            <h2 className={styles.cardTitle}>Best Current Offer</h2>
            <p className={styles.buyerName}>{topOffer.buyerName}</p>
          </div>
        </div>

        <span className={styles.statusBadge}>
          <Tag size={12} /> {statusText}
        </span>
      </div>

      {/* Financial Breakdown Table */}
      <div className={styles.tableBox}>
        <div className={styles.tableRow}>
          <span className={styles.rowLabel}>Market Price</span>
          <span className={styles.rowValue}>₹{topOffer.marketPrice}/kg</span>
        </div>
        <div className={styles.tableRow}>
          <span className={styles.rowLabel}>Buyer Offer</span>
          <span className={`${styles.rowValue} ${styles.offerHighlight}`}>₹{buyerOfferPrice}/kg</span>
        </div>
        <div className={styles.tableRow}>
          <span className={styles.rowLabel}>Transport Cost</span>
          <span className={styles.rowDeduct}>- ₹{topOffer.transportCost}/kg</span>
        </div>
        <div className={`${styles.tableRow} ${styles.netRow}`}>
          <span className={styles.netLabel}>Net Farmer Payout</span>
          <span className={styles.netValue}>₹{topOffer.netPayout}/kg</span>
        </div>
      </div>

      <div className={styles.guaranteeNote}>
        <ShieldCheck size={16} className={styles.shieldIcon} />
        <span>Direct bank transfer upon warehouse pickup</span>
      </div>

      <button onClick={onViewOffersClick} className={styles.viewBtn}>
        View All {totalOffersCount} Offers <ArrowRight size={16} />
      </button>
    </div>
  )
}
