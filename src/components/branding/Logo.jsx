import styles from './Logo.module.css'

/**
 * UzhavarSetu Official Logo
 * Uses the PNG uploaded by the user — never regenerated or redrawn.
 *
 * @param {'sm'|'md'|'lg'|'xl'|'2xl'} size
 * @param {object} style  - extra inline styles (used for parallax transforms)
 * @param {string} className
 */
export default function Logo({ size = 'md', style = {}, className = '' }) {
  const widthMap = { sm: 120, md: 160, lg: 210, xl: 270, '2xl': 340 }
  const width = widthMap[size] || 160

  return (
    <div
      className={`${styles.logoWrap} ${styles[`size--${size}`]} ${className}`}
      style={style}
    >
      <img
        src="/logo.png"
        alt="UzhavarSetu — From Farm to Fair Market"
        width={width}
        height="auto"
        className={styles.logoImg}
        draggable={false}
      />
    </div>
  )
}
