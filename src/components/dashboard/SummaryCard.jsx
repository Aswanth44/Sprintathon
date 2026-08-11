import { TrendingUp, Package, HandCoins, Truck } from 'lucide-react'
import styles from './SummaryCard.module.css'

const ICON_MAP = {
  TrendingUp,
  Package,
  HandCoins,
  Truck,
}

/**
 * Summary Metric Card
 * @param {{ title: string, value: string, subtext: string, trend: string, trendPositive?: boolean, icon: string, accentColor?: string, bgColor?: string }} props
 */
export default function SummaryCard({ title, value, subtext, trend, trendPositive = true, icon, accentColor, bgColor }) {
  const IconComponent = ICON_MAP[icon] || TrendingUp

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.cardTitle}>{title}</span>
        <div
          className={styles.iconWrap}
          style={{
            backgroundColor: bgColor || 'var(--color-green-pale)',
            color: accentColor || 'var(--color-green-deep)',
          }}
        >
          <IconComponent size={20} aria-hidden="true" />
        </div>
      </div>

      <div className={styles.cardBody}>
        <div className={styles.valueRow}>
          <span className={styles.value}>{value}</span>
          {trend && (
            <span
              className={`${styles.trendBadge} ${trendPositive ? styles.trendUp : styles.trendDown}`}
            >
              {trend}
            </span>
          )}
        </div>
        <p className={styles.subtext}>{subtext}</p>
      </div>
    </div>
  )
}
