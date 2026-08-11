import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import styles from './LoginForm.module.css'

/**
 * Reusable labelled input field
 */
export function FormField({ id, label, type = 'text', placeholder, value, onChange, required, autoComplete, inputClassName, children }) {
  return (
    <div className={styles.fieldGroup}>
      <label htmlFor={id} className={styles.fieldLabel}>{label}</label>
      <div className={styles.fieldInputWrap}>
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          autoComplete={autoComplete}
          className={`${styles.fieldInput}${inputClassName ? ` ${inputClassName}` : ''}`}
          aria-label={label}
        />
        {children}
      </div>
    </div>
  )
}

/**
 * Password field with show/hide toggle
 */
export function PasswordField({ id, label, value, onChange, autoComplete = 'current-password' }) {
  const [show, setShow] = useState(false)

  return (
    <div className={styles.fieldGroup}>
      <label htmlFor={id} className={styles.fieldLabel}>{label}</label>
      <div className={styles.fieldInputWrap}>
        <input
          id={id}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          required
          autoComplete={autoComplete}
          className={`${styles.fieldInput} ${styles.fieldInputPadRight}`}
          placeholder="Enter password"
          aria-label={label}
        />
        <button
          type="button"
          className={styles.eyeToggle}
          onClick={() => setShow((s) => !s)}
          aria-label={show ? 'Hide password' : 'Show password'}
          tabIndex={0}
        >
          {show
            ? <EyeOff size={16} aria-hidden="true" />
            : <Eye size={16} aria-hidden="true" />
          }
        </button>
      </div>
    </div>
  )
}

/**
 * Remember Me + Forgot Password row
 */
export function RememberForgotRow({ rememberMe, onRememberChange, forgotHref = '#' }) {
  return (
    <div className={styles.rememberRow}>
      <label className={styles.checkboxLabel} htmlFor="remember-me">
        <input
          id="remember-me"
          type="checkbox"
          checked={rememberMe}
          onChange={(e) => onRememberChange(e.target.checked)}
          className={styles.checkbox}
        />
        <span className={styles.checkboxText}>Remember me</span>
      </label>
      <a href={forgotHref} className={styles.forgotLink}>Forgot password?</a>
    </div>
  )
}

/**
 * Primary submit button
 */
export function SubmitButton({ children, loading = false, id }) {
  return (
    <button
      id={id}
      type="submit"
      className={styles.submitBtn}
      disabled={loading}
      aria-busy={loading}
    >
      {loading ? (
        <span className={styles.spinnerWrap} aria-hidden="true">
          <span className={styles.spinner} />
        </span>
      ) : children}
    </button>
  )
}

/**
 * "Create account" secondary link-button
 */
export function CreateAccountLink({ href = '#', onClick, children }) {
  return (
    <p className={styles.createAccountRow}>
      <span className={styles.createAccountText}>Don&apos;t have an account?</span>{' '}
      <a
        href={href}
        onClick={(e) => {
          if (onClick) {
            e.preventDefault()
            onClick()
          }
        }}
        className={styles.createAccountLink}
      >
        {children}
      </a>
    </p>
  )
}
