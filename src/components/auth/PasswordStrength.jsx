import { useMemo } from 'react'
import styles from './PasswordStrength.module.css'

/**
 * Calculates strength of a password
 * Returns { score: 0..4, label: string, color: string }
 */
function getStrength(password) {
  if (!password) return { score: 0, label: '', color: 'transparent' }

  let score = 0
  if (password.length >= 6) score += 1
  if (password.length >= 10) score += 1
  if (/[A-Z]/.test(password) && /[0-9]/.test(password)) score += 1
  if (/[^A-Za-z0-9]/.test(password)) score += 1

  const levels = [
    { label: 'Too short', color: '#c53030' },
    { label: 'Weak',      color: '#e53e3e' },
    { label: 'Fair',      color: '#dd6b20' },
    { label: 'Good',      color: '#d4a017' },
    { label: 'Strong',    color: '#2d6a4f' },
  ]

  return { score, ...levels[score] }
}

export default function PasswordStrength({ password = '' }) {
  const strength = useMemo(() => getStrength(password), [password])

  if (!password) return null

  return (
    <div className={styles.container} aria-label={`Password strength: ${strength.label}`}>
      <div className={styles.barsRow}>
        {[1, 2, 3, 4].map((step) => {
          const isActive = step <= strength.score
          return (
            <div
              key={step}
              className={styles.bar}
              style={{
                backgroundColor: isActive ? strength.color : 'var(--color-border-light)',
              }}
            />
          )
        })}
      </div>
      <div className={styles.infoRow}>
        <span className={styles.strengthText} style={{ color: strength.color }}>
          Password strength: <strong>{strength.label}</strong>
        </span>
      </div>
    </div>
  )
}
