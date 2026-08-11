import { Plus, TrendingUp, Truck, HandCoins } from 'lucide-react'
import styles from './QuickActions.module.css'

/**
 * Large accessible Quick Actions Component
 * @param {{ onCreateBatchClick: () => void, onTabChange: (tab: string) => void }} props
 */
export default function QuickActions({ onCreateBatchClick, onTabChange }) {
  return (
    <div className={styles.section}>
      <h2 className={styles.heading}>Quick Actions</h2>
      <div className={styles.actionsGrid}>
        <button
          onClick={onCreateBatchClick}
          className={`${styles.actionBtn} ${styles.primaryBtn}`}
          id="btn-create-new-batch"
        >
          <div className={styles.iconCirclePrimary}>
            <Plus size={20} />
          </div>
          <span>+ Create New Batch</span>
        </button>

        <button
          onClick={() => onTabChange('prices')}
          className={styles.actionBtn}
          id="btn-view-market-prices"
        >
          <div className={styles.iconCircle} style={{ background: 'rgba(212, 160, 23, 0.12)', color: 'var(--color-gold)' }}>
            <TrendingUp size={20} />
          </div>
          <span>View Market Prices</span>
        </button>

        <button
          onClick={() => onTabChange('track')}
          className={styles.actionBtn}
          id="btn-track-my-produce"
        >
          <div className={styles.iconCircle} style={{ background: 'rgba(128, 90, 213, 0.12)', color: '#805ad5' }}>
            <Truck size={20} />
          </div>
          <span>Track My Produce</span>
        </button>

        <button
          onClick={() => onTabChange('offers')}
          className={styles.actionBtn}
          id="btn-view-buyer-offers"
        >
          <div className={styles.iconCircle} style={{ background: 'rgba(43, 108, 176, 0.12)', color: '#2b6cb0' }}>
            <HandCoins size={20} />
          </div>
          <span>View Buyer Offers</span>
        </button>
      </div>
    </div>
  )
}
