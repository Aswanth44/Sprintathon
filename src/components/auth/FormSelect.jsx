import { ChevronDown } from 'lucide-react'
import styles from './LoginForm.module.css'

/**
 * Custom styled dropdown select element matching FormField design tokens
 */
export default function FormSelect({ id, label, value, onChange, options = [], required = true, disabled = false }) {
  return (
    <div className={styles.fieldGroup}>
      <label htmlFor={id} className={styles.fieldLabel}>
        {label} {required && <span style={{ color: 'var(--color-error)' }}>*</span>}
      </label>
      <div className={styles.fieldInputWrap}>
        <select
          id={id}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={`${styles.fieldInput} ${styles.selectInput}`}
          aria-label={label}
        >
          {options.map((opt) => {
            const val = typeof opt === 'string' ? opt : opt.value
            const lbl = typeof opt === 'string' ? opt : opt.label
            return (
              <option key={val} value={val}>
                {lbl}
              </option>
            )
          })}
        </select>
        <ChevronDown size={18} className={styles.selectChevron} aria-hidden="true" />
      </div>
    </div>
  )
}
