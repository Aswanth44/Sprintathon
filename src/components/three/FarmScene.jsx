import Logo from '../branding/Logo'
import styles from './FarmScene.module.css'

// ── Journey Labels Overlay Flowchart ───────────────────────────────────────
const STAGES = [
  { icon: '🌾', label: 'Farm'       },
  { icon: '📦', label: 'Collection' },
  { icon: '🏭', label: 'Warehouse'  },
  { icon: '🚛', label: 'Transport'  },
  { icon: '🏪', label: 'Market'     },
]

function JourneyBar() {
  return (
    <div className={styles.journeyBar} role="list" aria-label="Farm to market journey">
      {STAGES.map((s, i) => (
        <div key={s.label} className={styles.journeyItem} role="listitem">
          <div className={styles.journeyDot}>
            <span className={styles.journeyIcon} aria-hidden="true">{s.icon}</span>
          </div>
          <span className={styles.journeyLabel}>{s.label}</span>
          {i < STAGES.length - 1 && (
            <div className={styles.journeyArrow} aria-hidden="true">
              <div className={styles.arrowLine} />
              <span className={styles.arrowHead}>›</span>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

/**
 * Visual Panel Component
 * Displays the high-resolution farm-to-market background image,
 * centered official logo with subtle opacity & interactive mouse parallax,
 * and the bottom journey flowchart.
 *
 * @param {{ logoParallax: {x:number, y:number}, reducedMotion: boolean }} props
 */
export default function FarmScene({ logoParallax, reducedMotion }) {
  const logoStyle = reducedMotion ? { opacity: 0.85 } : {
    opacity: 0.85,
    transform: `translate(${logoParallax?.x ?? 0}px, ${logoParallax?.y ?? 0}px)`,
    transition: 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.3s ease',
  }

  const bgStyle = reducedMotion ? {} : {
    transform: `scale(1.03) translate(${(logoParallax?.x ?? 0) * -0.3}px, ${(logoParallax?.y ?? 0) * -0.3}px)`,
    transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  }

  return (
    <div className={styles.sceneWrapper}>
      {/* Background Image Container */}
      <div className={styles.bgContainer} style={bgStyle}>
        <img
          src="/uzhavarsetu-farm-bg.png"
          alt="UzhavarSetu Farm to Market Journey Landscape"
          className={styles.bgImage}
        />
      </div>

      {/* Atmospheric Overlays for readability */}
      <div className={styles.overlay} aria-hidden="true" />

      {/* Centered Logo with lower opacity */}
      <div className={styles.centerLogo}>
        <div className={styles.logoBadge}>
          <Logo size="2xl" style={logoStyle} />
        </div>
      </div>

      {/* Bottom Flowchart */}
      <JourneyBar />
    </div>
  )
}
