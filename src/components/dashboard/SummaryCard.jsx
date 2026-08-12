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
 * Displays Title (top), Large Primary Value (middle), and Supporting Text (bottom).
 *
 * @param {{
 *   title?: string,
 *   label?: string,
 *   value: string | number,
 *   subtext?: string,
 *   supportingText?: string,
 *   trend?: string,
 *   trendPositive?: boolean,
 *   icon?: string,
 *   accentColor?: string,
 *   bgColor?: string
 * }} props
 */
export default function SummaryCard({
  title,
  label,
  value,
  subtext,
  supportingText,
  trend,
  trendPositive = true,
  icon = 'TrendingUp',
  accentColor,
  bgColor,
}) {
  const displayTitle   = title || label || 'Summary'
  const displaySubtext = subtext || supportingText || ''
  const IconComponent  = ICON_MAP[icon] || TrendingUp

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.cardTitle}>{displayTitle}</span>
        <div
          className={styles.iconWrap}
          style={{
            backgroundColor: bgColor || 'var(--color-green-pale)',
            color: accentColor || 'var(--color-green-deep)',
          }}
        >
          <IconComponent size={18} aria-hidden="true" />
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
        {displaySubtext && <p className={styles.subtext}>{displaySubtext}</p>}
      </div>
    </div>
  )
}
