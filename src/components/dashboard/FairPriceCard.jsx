import { useState } from 'react'
import { TrendingUp, ShieldCheck, ChevronDown } from 'lucide-react'
import PriceChart from './PriceChart'
import styles from './FairPriceCard.module.css'

/**
 * Today's Fair Price Card Component
 * Receives market prices list from marketApi service
 * 
 * // TODO: Replace demo market-price data with backend API response.
 * @param {{ pricesList?: Array<any> }} props
 */
export default function FairPriceCard({ pricesList = [] }) {
  const [selectedCrop, setSelectedCrop] = useState('Tomato')

  const priceArray = Array.isArray(pricesList)
    ? pricesList
    : pricesList && typeof pricesList === 'object'
    ? [pricesList]
    : []

  // Find selected crop or fallback to first
  const activeCropData =
    priceArray.find((p) => p && p.crop && p.crop.toLowerCase() === selectedCrop.toLowerCase()) ||
    priceArray[0] ||
    {}

  // Safely extract price properties supporting multiple property names across demo datasets
  const displayPrice = activeCropData.currentPrice ?? activeCropData.price ?? activeCropData.mandiBenchmark ?? 42
  const minPrice = activeCropData.minimumPrice ?? activeCropData.minPrice ?? activeCropData.min ?? 38
  const maxPrice = activeCropData.maximumPrice ?? activeCropData.maxPrice ?? activeCropData.max ?? 46
  const changePct = activeCropData.changePercent ?? activeCropData.changePercentage ?? activeCropData.change ?? 6.2
  const unitText = activeCropData.unit || 'kg'
  const historyData = activeCropData.history || [
    { day: 'Mon', price: minPrice },
    { day: 'Tue', price: minPrice + 1 },
    { day: 'Wed', price: minPrice + 2 },
    { day: 'Thu', price: displayPrice - 1 },
    { day: 'Fri', price: displayPrice },
  ]

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
            {priceArray.length > 0 ? (
              priceArray.map((p) => (
                <option key={p.crop || 'crop'} value={p.crop || 'Tomato'}>
                  {p.crop || 'Tomato'} ({p.locationName || p.district || 'Mandi'})
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
              ₹{displayPrice}<span className={styles.unit}>/{unitText}</span>
            </div>
          </div>
          <div className={styles.trendInfo}>
            <span className={styles.trendBadge}>
              <TrendingUp size={14} /> {changePct >= 0 ? `+${changePct}` : changePct}%
            </span>
            <span className={styles.rangeText}>
              Range: ₹{minPrice} - ₹{maxPrice}/{unitText}
            </span>
          </div>
        </div>

        {/* Clean SVG Trend Line Chart */}
        <div className={styles.chartWrap}>
          <PriceChart history={historyData} currentPrice={displayPrice} />
        </div>
      </div>
    </div>
  )
}
