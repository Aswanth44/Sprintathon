import { useState, useId } from 'react'
import { ArrowRight, CheckCircle2, Clock, ShoppingBag } from 'lucide-react'
import RegistrationProgress from './RegistrationProgress'
import FormSelect from './FormSelect'
import PasswordStrength from './PasswordStrength'
import {
  FormField,
  PasswordField,
  SubmitButton,
} from './LoginForm'
import styles from './BuyerLogin.module.css'

const BUYER_TYPES = [
  'Trader',
  'Wholesaler',
  'Retailer',
  'FPO',
  'Cooperative',
  'Processor',
  'Other',
]

/**
 * Buyer Registration Two-Step Flow
 * @param {{ onNavigate: (view: string) => void }} props
 */
export default function BuyerRegistration({ onNavigate }) {
  const [step, setStep] = useState(1)

  // Step 1 Form State
  const [businessName, setBusinessName]         = useState('')
  const [contactPerson, setContactPerson]       = useState('')
  const [buyerType, setBuyerType]               = useState('Trader')
  const [mobile, setMobile]                     = useState('')
  const [email, setEmail]                       = useState('')
  const [businessLocation, setBusinessLocation] = useState('')

  // Step 2 Form State
  const [password, setPassword]               = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agreeTerms, setAgreeTerms]           = useState(false)
  const [loading, setLoading]                 = useState(false)
  const [error, setError]                     = useState('')

  const termsCheckboxId = useId()

  // Step 1 Validation
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const isMobileValid = /^\d{10}$/.test(mobile)
  const isStep1Valid =
    businessName.trim().length >= 2 &&
    contactPerson.trim().length >= 2 &&
    buyerType &&
    isMobileValid &&
    isEmailValid &&
    businessLocation.trim().length >= 2

  // Step 2 Validation
  const isPasswordMatch = password && confirmPassword && password === confirmPassword
  const isPasswordValid = password.length >= 6
  const isStep2Valid    = isPasswordValid && isPasswordMatch && agreeTerms

  const handleStep1Submit = (e) => {
    e.preventDefault()
    if (!isStep1Valid) return
    setError('')
    setStep(2)
  }

  const handleStep2Submit = async (e) => {
    e.preventDefault()
    if (!isStep2Valid) return
    setError('')
    setLoading(true)

    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setStep('success')
    } catch {
      setError('Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ── SUCCESS STATE ────────────────────────────────────────────────────────
  if (step === 'success') {
    return (
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)', alignItems: 'center' }}>
        <div style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: 'var(--color-green-pale)',
          color: 'var(--color-green-deep)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-green)'
        }}>
          <CheckCircle2 size={36} />
        </div>

        <div>
          <h2 style={{ fontSize: 'var(--text-xl)', color: 'var(--color-green-deep)', marginBottom: 'var(--space-1)' }}>
            Buyer Account Created!
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-base)' }}>
            Welcome to UzhavarSetu, <strong>{contactPerson}</strong>!
          </p>
        </div>

        {/* Verification Pending Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          padding: 'var(--space-2) var(--space-4)',
          background: '#fff8e1',
          border: '1px solid #ffe082',
          borderRadius: 'var(--radius-full)',
          color: '#b78103',
          fontWeight: 'var(--font-semibold)',
          fontSize: 'var(--text-xs)'
        }}>
          <Clock size={15} /> Status: <span>Verification Pending</span>
        </div>

        <div style={{
          background: 'var(--color-cream)',
          border: '1px solid var(--color-border-mid)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-4)',
          width: '100%',
          textAlign: 'left',
          fontSize: 'var(--text-sm)'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)', color: 'var(--color-text-secondary)' }}>
            <div>Business: <strong>{businessName}</strong></div>
            <div>Type: <strong>{buyerType}</strong></div>
            <div>Location: <strong>{businessLocation}</strong></div>
            <div>Mobile: <strong>+91 {mobile}</strong></div>
            <div style={{ gridColumn: '1 / -1' }}>Email: <strong>{email}</strong></div>
          </div>
        </div>

        <SubmitButton id="go-buyer-dashboard" onClick={() => onNavigate('buyer-dashboard')}>
          <ShoppingBag size={18} aria-hidden="true" />
          Go to Buyer Dashboard
        </SubmitButton>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      {/* Progress Indicator */}
      <RegistrationProgress currentStep={step} />

      {step === 1 ? (
        /* ── STEP 1: BUYER DETAILS ───────────────────────────────────────── */
        <form onSubmit={handleStep1Submit} className={styles.form} noValidate>
          <FormField
            id="buyer-business-name"
            label="Business / Organization Name *"
            type="text"
            placeholder="e.g. FreshAgri Wholesale Ltd"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            required
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
            <FormField
              id="buyer-contact-person"
              label="Contact Person *"
              type="text"
              placeholder="Your full name"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              required
            />
            <FormSelect
              id="buyer-type"
              label="Buyer Type *"
              value={buyerType}
              onChange={(e) => setBuyerType(e.target.value)}
              options={BUYER_TYPES}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
            <FormField
              id="buyer-reg-mobile"
              label="Mobile Number (10 digits) *"
              type="tel"
              placeholder="Enter 10-digit number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
              required
            />
            <FormField
              id="buyer-reg-email"
              label="Email Address *"
              type="email"
              placeholder="buyer@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
              required
            />
          </div>

          <FormField
            id="buyer-location"
            label="Business Location / City *"
            type="text"
            placeholder="e.g. Koyambedu Market, Chennai"
            value={businessLocation}
            onChange={(e) => setBusinessLocation(e.target.value)}
            required
          />

          <SubmitButton id="buyer-step1-continue" disabled={!isStep1Valid}>
            Continue to Account Setup <ArrowRight size={18} aria-hidden="true" />
          </SubmitButton>
        </form>
      ) : (
        /* ── STEP 2: BUYER ACCOUNT ───────────────────────────────────────── */
        <form onSubmit={handleStep2Submit} className={styles.form} noValidate>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
            <PasswordField
              id="buyer-create-password"
              label="Create Password *"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
            <PasswordStrength password={password} />
          </div>

          <PasswordField
            id="buyer-confirm-password"
            label="Confirm Password *"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
          />

          {confirmPassword && !isPasswordMatch && (
            <p style={{ color: 'var(--color-error)', fontSize: 'var(--text-xs)' }}>
              Passwords do not match.
            </p>
          )}

          {/* Terms Checkbox */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
            <input
              id={termsCheckboxId}
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              style={{ width: 18, height: 18, accentColor: 'var(--color-green-mid)', cursor: 'pointer', marginTop: 2 }}
              required
            />
            <label htmlFor={termsCheckboxId} style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', cursor: 'pointer', lineHeight: 'var(--leading-normal)' }}>
              I agree to UzhavarSetu&apos;s{' '}
              <a href="#terms" style={{ color: 'var(--color-green-mid)', textDecoration: 'underline' }}>Terms of Service</a>
              {' '}and{' '}
              <a href="#privacy" style={{ color: 'var(--color-green-mid)', textDecoration: 'underline' }}>Privacy Policy</a>.
            </label>
          </div>

          {error && (
            <p className={styles.errorMsg} role="alert" aria-live="polite">
              {error}
            </p>
          )}

          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <button
              type="button"
              onClick={() => setStep(1)}
              style={{
                padding: '0 var(--space-4)',
                height: '52px',
                background: 'var(--color-white)',
                border: '1.5px solid var(--color-border-mid)',
                borderRadius: 'var(--radius-lg)',
                color: 'var(--color-text-secondary)',
                fontWeight: 'var(--font-semibold)',
                cursor: 'pointer'
              }}
            >
              Back
            </button>
            <div style={{ flex: 1 }}>
              <SubmitButton id="buyer-create-account-btn" loading={loading} disabled={!isStep2Valid}>
                Create Buyer Account
              </SubmitButton>
            </div>
          </div>
        </form>
      )}
    </div>
  )
}
