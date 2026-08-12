import { useState } from 'react'
import styles from './TrendChart.module.css'

/**
 * Clean, 0-dependency SVG 7-Day Price Trend Chart component
 * Renders SVG line path, data points, grid lines, and interactive tooltips.
 */
export default function TrendChart({ data = [] }) {
  const [hoveredPoint, setHoveredPoint] = useState(null)

  if (!data || data.length === 0) {
    return <div className={styles.emptyChart}>No trend data available</div>
  }

  // Dimensions
  const width = 500
  const height = 180
  const padding = { top: 25, right: 30, bottom: 35, left: 35 }

  const prices = data.map((d) => d.price)
  const minPrice = Math.min(...prices) - 2
  const maxPrice = Math.max(...prices) + 2

  const chartWidth = width - padding.left - padding.right
  const chartHeight = height - padding.top - padding.bottom

  // Map data points to SVG coordinates
  const points = data.map((item, index) => {
    const x = padding.left + (index / (data.length - 1)) * chartWidth
    const y =
      padding.top +
      chartHeight -
      ((item.price - minPrice) / (maxPrice - minPrice || 1)) * chartHeight
    return { ...item, x, y, index }
  })

  // Create SVG polyline points string
  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(' ')

  // Area fill under line
  const areaPoints = `${padding.left},${height - padding.bottom} ${polylinePoints} ${
    padding.left + chartWidth
  },${height - padding.bottom}`

  return (
    <div className={styles.chartWrapper}>
      <svg
        className={styles.svgChart}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        aria-label="7-Day Market Price Trend Chart"
      >
        <defs>
          <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1b4332" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#1b4332" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Horizontal Grid lines & Y-Axis labels */}
        {[0, 0.5, 1].map((ratio, idx) => {
          const yVal = padding.top + chartHeight * ratio
          const priceVal = Math.round(maxPrice - ratio * (maxPrice - minPrice))
          return (
            <g key={idx}>
              <line
                x1={padding.left}
                y1={yVal}
                x2={width - padding.right}
                y2={yVal}
                className={styles.gridLine}
              />
              <text
                x={padding.left - 6}
                y={yVal + 4}
                className={styles.yLabel}
                textAnchor="end"
              >
                ₹{priceVal}
              </text>
            </g>
          )
        })}

        {/* Area fill */}
        <polygon points={areaPoints} fill="url(#trendGradient)" />

        {/* Trend Line */}
        <polyline
          fill="none"
          stroke="#1b4332"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={polylinePoints}
        />

        {/* Data points & X-Axis date labels */}
        {points.map((p) => {
          const isHovered = hoveredPoint?.index === p.index
          return (
            <g key={p.index}>
              {/* X-Axis Date label */}
              <text
                x={p.x}
                y={height - 10}
                className={styles.xLabel}
                textAnchor="middle"
              >
                {p.date}
              </text>

              {/* Touch/Hover target area */}
              <circle
                cx={p.x}
                cy={p.y}
                r="14"
                fill="transparent"
                onMouseEnter={() => setHoveredPoint(p)}
                onMouseLeave={() => setHoveredPoint(null)}
                className={styles.hoverTarget}
              />

              {/* Point Circle */}
              <circle
                cx={p.x}
                cy={p.y}
                r={isHovered ? 6 : 4}
                fill={isHovered ? '#d4a373' : '#1b4332'}
                stroke="#ffffff"
                strokeWidth="2"
                className={styles.pointCircle}
              />

              {/* Price text label above data point */}
              <text
                x={p.x}
                y={p.y - 9}
                textAnchor="middle"
                fontSize="11"
                fontWeight="bold"
                fill="#1b4332"
              >
                ₹{p.price}
              </text>
            </g>
          )
        })}
      </svg>

      {/* Interactive Tooltip popup */}
      {hoveredPoint && (
        <div
          className={styles.tooltip}
          style={{
            left: `${(hoveredPoint.x / width) * 100}%`,
            top: `${(hoveredPoint.y / height) * 100}%`,
          }}
        >
          <div className={styles.tooltipDate}>{hoveredPoint.date}</div>
          <div className={styles.tooltipPrice}>₹{hoveredPoint.price} / kg</div>
        </div>
      )}
    </div>
  )
}
