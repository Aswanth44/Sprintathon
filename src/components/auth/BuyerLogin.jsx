import { useState } from 'react'
import { LogIn } from 'lucide-react'
import {
  FormField,
  PasswordField,
  RememberForgotRow,
  SubmitButton,
  CreateAccountLink,
} from './LoginForm'
import styles from './BuyerLogin.module.css'

/** Mock submit — replace with real API call later */
async function mockBuyerSignIn(identifier, password) {
  return new Promise((resolve) => setTimeout(resolve, 1200))
}

/**
 * Buyer-specific login form
 * Email or Mobile + Password
 */
export default function BuyerLogin({ onNavigate }) {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword]     = useState('')
  const [remember, setRemember]     = useState(false)
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState('')

  const isEmail    = identifier.includes('@')
  const isMobile   = /^\d{10}$/.test(identifier)

  const validate = () => {
    if (!identifier) return 'Please enter your email or mobile number.'
    if (!isEmail && !isMobile) return 'Enter a valid email or 10-digit mobile number.'
    if (password.length < 6) return 'Password must be at least 6 characters.'
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const validationError = validate()
    if (validationError) { setError(validationError); return }

    setLoading(true)
    try {
      await mockBuyerSignIn(identifier, password)
      if (onNavigate) onNavigate('buyer-dashboard')
      console.log('Buyer sign-in success', { identifier, remember })
    } catch {
      setError('Sign-in failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      id="role-panel-buyer"
      role="tabpanel"
      aria-labelledby="role-tab-buyer"
      className={styles.form}
      onSubmit={handleSubmit}
      noValidate
    >
      {/* Email / Mobile */}
      <FormField
        id="buyer-identifier"
        label="Email / Mobile Number"
        type="text"
        placeholder="email@example.com or 10-digit number"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value.trim())}
        required
        autoComplete="username"
      />

      {/* Password */}
      <PasswordField
        id="buyer-password"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
      />

      {/* Remember + Forgot */}
      <RememberForgotRow
        rememberMe={remember}
        onRememberChange={setRemember}
        forgotHref="#forgot-password"
      />

      {/* Error message */}
      {error && (
        <p className={styles.errorMsg} role="alert" aria-live="polite">
          {error}
        </p>
      )}

      {/* Submit */}
      <SubmitButton id="buyer-signin-btn" loading={loading}>
        <LogIn size={18} aria-hidden="true" />
        Sign In as Buyer
      </SubmitButton>

      {/* Create account */}
      <CreateAccountLink
        href="#buyer-register"
        onClick={() => onNavigate && onNavigate('buyer-register')}
      >
        Create Buyer Account
      </CreateAccountLink>
    </form>
  )
}
