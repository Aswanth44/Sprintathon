import { useState, useEffect } from 'react'
import { TrendingUp, ShieldCheck, ChevronDown } from 'lucide-react'
import { getMarketPrice } from '../../api/priceApi'
import PriceChart from './PriceChart'
import styles from './FairPriceCard.module.css'

/**
 * Today's Fair Price Card Component
 * Consumes official Government OGD / AGMARKNET market prices service with fallback.
 * 
 * // TODO: Replace mock data source with live Spring Boot endpoint GET /api/price/{cropName}
 * @param {{ pricesList?: Array<any> }} props
 */
export default function FairPriceCard({ pricesList = [] }) {
  const [selectedCrop, setSelectedCrop] = useState('Tomato')
  const [marketData, setMarketData]     = useState(null)

  useEffect(() => {
    async function loadPrice() {
      try {
        const res = await getMarketPrice(selectedCrop, 'Coimbatore')
        setMarketData(res)
      } catch (err) {
        console.error('Failed to load market price benchmark:', err)
      }
    }
    loadPrice()
  }, [selectedCrop])

  const priceArray = Array.isArray(pricesList)
    ? pricesList
    : pricesList && typeof pricesList === 'object'
    ? [pricesList]
    : []

  const activeCropData =
    priceArray.find((p) => p && p.crop && p.crop.toLowerCase() === selectedCrop.toLowerCase()) ||
    priceArray[0] ||
    {}

  const displayPrice = marketData?.modalPricePerKg ?? marketData?.marketPrice ?? activeCropData.currentPrice ?? 42
  const minPrice = marketData?.minPricePerKg ?? activeCropData.minimumPrice ?? 38
  const maxPrice = marketData?.maxPricePerKg ?? activeCropData.maximumPrice ?? 46
  const sourceName = marketData?.source || 'Government OGD / AGMARKNET'
  const isLive = marketData?.isLive ?? false
  const changePct = activeCropData.changePercent ?? 4.8
  const unitText = 'kg'

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
            <p className={styles.subtitle}>
              {sourceName} • {isLive ? '✓ LIVE AGMARKNET' : 'DEMO BENCHMARK'}
            </p>
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
            <option value="Tomato">Tomato (Coimbatore Mandi)</option>
            <option value="Onion">Onion (Coimbatore Mandi)</option>
            <option value="Potato">Potato (Coimbatore Mandi)</option>
            <option value="Coconut">Coconut (Pollachi Mandi)</option>
            <option value="Banana">Banana (Coimbatore Mandi)</option>
          </select>
          <ChevronDown size={14} className={styles.selectChevron} />
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.priceRow}>
          <div>
            <span className={styles.priceLabel}>Government Mandi Benchmark</span>
            <div className={styles.priceValue}>
              ₹{displayPrice}<span className={styles.unit}>/{unitText}</span>
            </div>
          </div>
          <div className={styles.trendInfo}>
            <span className={styles.trendBadge}>
              <TrendingUp size={14} /> +{changePct}%
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
