import { useState } from 'react'

/**
 * Clean, interactive SVG Price Trend Chart (2D pure vector data presentation)
 * @param {{ history: Array<{day: string, price: number}>, currentPrice: number }} props
 */
export default function PriceChart({ history = [], currentPrice = 42 }) {
  const [hoveredIdx, setHoveredIdx] = useState(null)

  if (!history || history.length === 0) return null

  // Chart dimensions
  const width = 360
  const height = 150
  const paddingX = 30
  const paddingY = 32

  const prices = history.map((h) => h.price)
  const minP = Math.min(...prices) - 2
  const maxP = Math.max(...prices) + 2

  // Map data points to SVG coordinates
  const points = history.map((item, i) => {
    const x = paddingX + (i / (history.length - 1)) * (width - paddingX * 2)
    const y = height - paddingY - ((item.price - minP) / (maxP - minP || 1)) * (height - paddingY * 2)
    return { x, y, ...item }
  })

  // Construct SVG path command
  const pathD = points.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`
  }, '')

  // Area path for gradient fill
  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`

  return (
    <div style={{ width: '100%', position: 'relative' }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{ width: '100%', height: 'auto', overflow: 'visible', display: 'block' }}
        aria-label="Price history trend chart"
      >
        <defs>
          <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-gold)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--color-gold)" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines */}
        {[0.2, 0.5, 0.8].map((ratio, idx) => {
          const y = paddingY + ratio * (height - paddingY * 2)
          return (
            <line
              key={idx}
              x1={paddingX}
              y1={y}
              x2={width - paddingX}
              y2={y}
              stroke="var(--color-border-light)"
              strokeDasharray="4 4"
            />
          )
        })}

        {/* Gradient fill under curve */}
        <path d={areaD} fill="url(#priceGradient)" />

        {/* Main trend line */}
        <path
          d={pathD}
          fill="none"
          stroke="var(--color-gold)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points & hover triggers */}
        {points.map((pt, i) => {
          const isHovered = hoveredIdx === i
          const isLast = i === points.length - 1

          return (
            <g key={i} onMouseEnter={() => setHoveredIdx(i)} onMouseLeave={() => setHoveredIdx(null)}>
              {/* Invisible touch area */}
              <circle cx={pt.x} cy={pt.y} r="12" fill="transparent" style={{ cursor: 'pointer' }} />

              {/* Point circle */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={isHovered ? 6 : isLast ? 5 : 4}
                fill={isLast ? 'var(--color-green-deep)' : 'var(--color-gold-light)'}
                stroke="var(--color-white)"
                strokeWidth="2"
                style={{ transition: 'all 0.2s ease' }}
              />

              {/* Day label */}
              <text
                x={pt.x}
                y={height - 6}
                textAnchor="middle"
                fontSize="10"
                fontWeight={isHovered ? 'bold' : '600'}
                fill={isHovered ? 'var(--color-green-deep)' : 'var(--color-text-secondary)'}
              >
                {(() => {
                  const rawDay = pt.day ?? pt.date ?? ''
                  return typeof rawDay === 'string' ? rawDay.split(' ')[0] : ''
                })()}
              </text>

              {/* Price callout text above point */}
              <text
                x={pt.x}
                y={pt.y - 9}
                textAnchor="middle"
                fontSize="11"
                fontWeight="bold"
                fill="var(--color-green-deep)"
              >
                ₹{pt.price}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
