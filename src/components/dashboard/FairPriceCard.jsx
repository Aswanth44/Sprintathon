import { useState } from 'react'
import { TrendingUp, ShieldCheck, ChevronDown } from 'lucide-react'
import PriceChart from './PriceChart'
import styles from './FairPriceCard.module.css'

/**
 * Today's Fair Price Card Component
 * Receives market prices list from marketApi service
 * @param {{ pricesList?: Array<any> }} props
 */
export default function FairPriceCard({ pricesList = [] }) {
  const [selectedCrop, setSelectedCrop] = useState('Tomato')

  // Find selected crop or fallback to first
  const activeCropData =
    pricesList.find((p) => p.crop.toLowerCase() === selectedCrop.toLowerCase()) ||
    pricesList[0] || {
      crop: 'Tomato',
      price: 42,
      unit: 'kg',
      minPrice: 38,
      maxPrice: 46,
      changePercentage: 6.2,
      history: [
        { day: 'Mon', price: 38 },
        { day: 'Tue', price: 39 },
        { day: 'Wed', price: 40 },
        { day: 'Thu', price: 41 },
        { day: 'Fri (Today)', price: 42 },
      ],
    }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.titleWrap}>
          <div className={styles.badgeIcon}>
            <ShieldCheck size={18} />
          </div>
          <div>
            <h2 className={styles.title}>Today&apos;s Fair Price</h2>
            <p className={styles.subtitle}>Verified Govt &amp; Mandi Benchmark</p>
          </div>
        </div>

        {/* Crop Selector Dropdown */}
        <div className={styles.selectWrap}>
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className={styles.cropSelect}
            aria-label="Select Crop"
          >
            {pricesList.length > 0 ? (
              pricesList.map((p) => (
                <option key={p.crop} value={p.crop}>
                  {p.crop} ({p.district || 'Mandi'})
                </option>
              ))
            ) : (
              <>
                <option value="Tomato">Tomato (Grade A)</option>
                <option value="Onion">Onion (Grade A)</option>
                <option value="Potato">Potato (Grade B)</option>
                <option value="Rice">Rice (Grade A)</option>
              </>
            )}
          </select>
          <ChevronDown size={14} className={styles.selectChevron} />
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.priceRow}>
          <div>
            <span className={styles.priceLabel}>Market Benchmark</span>
            <div className={styles.priceValue}>
              ₹{activeCropData.price}<span className={styles.unit}>/{activeCropData.unit || 'kg'}</span>
            </div>
          </div>
          <div className={styles.trendInfo}>
            <span className={styles.trendBadge}>
              <TrendingUp size={14} /> +{activeCropData.changePercentage || 6.2}%
            </span>
            <span className={styles.rangeText}>
              Range: ₹{activeCropData.minPrice || 38} - ₹{activeCropData.maxPrice || 46}/kg
            </span>
          </div>
        </div>

        {/* Clean SVG Trend Line Chart */}
        <div className={styles.chartWrap}>
          <PriceChart history={activeCropData.history} currentPrice={activeCropData.price} />
        </div>
      </div>
    </div>
  )
}
