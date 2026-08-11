import { motion } from 'framer-motion'
import { Tractor, ShoppingBag } from 'lucide-react'
import styles from './RoleSelector.module.css'

const ROLES = [
  {
    id: 'farmer',
    label: 'Farmer',
    icon: Tractor,
    description: 'Sell your produce directly',
  },
  {
    id: 'buyer',
    label: 'Buyer',
    icon: ShoppingBag,
    description: 'Source fresh farm produce',
  },
]

/**
 * Role selector tabs — Farmer / Buyer
 * @param {'farmer'|'buyer'} selected
 * @param {(role: string) => void} onChange
 */
export default function RoleSelector({ selected, onChange }) {
  return (
    <div className={styles.roleSelector} role="tablist" aria-label="Select your role">
      {ROLES.map((role) => {
        const Icon = role.icon
        const isActive = selected === role.id

        return (
          <button
            key={role.id}
            id={`role-tab-${role.id}`}
            role="tab"
            aria-selected={isActive}
            aria-controls={`role-panel-${role.id}`}
            className={`${styles.roleBtn} ${isActive ? styles.roleBtnActive : ''}`}
            onClick={() => onChange(role.id)}
          >
            {/* Active pill indicator */}
            {isActive && (
              <motion.div
                className={styles.activePill}
                layoutId="role-active-pill"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}

            <span className={styles.roleBtnContent}>
              <Icon
                size={18}
                className={styles.roleIcon}
                aria-hidden="true"
                strokeWidth={isActive ? 2.5 : 1.8}
              />
              <span className={styles.roleLabel}>{role.label}</span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
