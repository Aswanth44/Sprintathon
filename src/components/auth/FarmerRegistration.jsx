import { useState, useId } from 'react'
import { ArrowRight, CheckCircle2, ShieldCheck, Tractor } from 'lucide-react'
import RegistrationProgress from './RegistrationProgress'
import FormSelect from './FormSelect'
import PasswordStrength from './PasswordStrength'
import {
  FormField,
  PasswordField,
  SubmitButton,
} from './LoginForm'
import styles from './FarmerLogin.module.css'

const CROP_OPTIONS = [
  'Tomato',
  'Onion',
  'Potato',
  'Rice',
  'Coconut',
  'Banana',
  'Sugarcane',
  'Vegetables',
  'Fruits',
  'Other',
]

const TAMIL_NADU_DISTRICTS = [
  'Coimbatore',
  'Erode',
  'Salem',
  'Madurai',
  'Tiruchirappalli',
  'Tirunelveli',
  'Thanjavur',
  'Dindigul',
  'Vellore',
  'Dharmapuri',
  'Other District',
]

/**
 * Farmer Registration Two-Step Flow
 * @param {{ onNavigate: (view: string) => void }} props
 */
export default function FarmerRegistration({ onNavigate }) {
  const [step, setStep] = useState(1)

  // Step 1 Form State
  const [fullName, setFullName]       = useState('')
  const [mobile, setMobile]           = useState('')
  const [email, setEmail]             = useState('')
  const [village, setVillage]         = useState('')
  const [district, setDistrict]       = useState('Coimbatore')
  const [state, setState]             = useState('Tamil Nadu')
  const [primaryCrop, setPrimaryCrop] = useState('Tomato')
  const [farmSize, setFarmSize]       = useState('')

  // Step 2 Form State
  const [password, setPassword]               = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agreeTerms, setAgreeTerms]           = useState(false)
  const [loading, setLoading]                 = useState(false)
  const [error, setError]                     = useState('')

  const termsCheckboxId = useId()

  // Step 1 Validations
  const isEmailValid = !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const isFarmSizeValid = farmSize !== '' && !isNaN(Number(farmSize)) && Number(farmSize) > 0
  const isFarmSizeInvalid = farmSize !== '' && (isNaN(Number(farmSize)) || Number(farmSize) <= 0)

  const isStep1Valid =
    fullName.trim().length >= 2 &&
    /^\d{10}$/.test(mobile) &&
    isEmailValid &&
    village.trim().length >= 2 &&
    district.trim().length >= 2 &&
    state.trim().length >= 2 &&
    primaryCrop &&
    isFarmSizeValid

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
      // Mock account creation API call
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
            Farmer Account Created!
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-base)' }}>
            Welcome to UzhavarSetu, <strong>{fullName}</strong>!
          </p>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-green-deep)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-2)' }}>
            <ShieldCheck size={18} /> Verified Farmer Profile
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)', color: 'var(--color-text-secondary)' }}>
            <div>Crop: <strong>{primaryCrop}</strong></div>
            <div>Farm Size: <strong>{farmSize} Acres</strong></div>
            <div>Location: <strong>{district}, {state}</strong></div>
            <div>Mobile: <strong>+91 {mobile}</strong></div>
            {email && <div style={{ gridColumn: '1 / -1' }}>Email: <strong>{email}</strong></div>}
          </div>
        </div>

        <SubmitButton id="go-farmer-dashboard" onClick={() => onNavigate('farmer-dashboard')}>
          <Tractor size={18} aria-hidden="true" />
          Go to Farmer Dashboard
        </SubmitButton>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      {/* Progress Indicator */}
      <RegistrationProgress currentStep={step} />

      {step === 1 ? (
        /* ── STEP 1: FARMER DETAILS ─────────────────────────────────────── */
        <form onSubmit={handleStep1Submit} className={styles.form} noValidate>
          <FormField
            id="farmer-name"
            label="Full Name *"
            type="text"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            autoComplete="name"
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
            <FormField
              id="farmer-reg-mobile"
              label="Mobile Number (10 digits) *"
              type="tel"
              placeholder="Enter 10-digit number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
              required
              autoComplete="tel"
            />
            <FormField
              id="farmer-reg-email"
              label="Email Address (Optional)"
              type="email"
              placeholder="farmer@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
              required={false}
              autoComplete="email"
            />
          </div>
          {email && !isEmailValid && (
            <p style={{ color: 'var(--color-error)', fontSize: 'var(--text-xs)', marginTop: '-8px' }}>
              Please enter a valid email address format (e.g. name@example.com).
            </p>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
            <FormField
              id="farmer-village"
              label="Village / Town *"
              type="text"
              placeholder="Village name"
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              required
            />
            <FormSelect
              id="farmer-district"
              label="District *"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              options={TAMIL_NADU_DISTRICTS}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
            <FormField
              id="farmer-state"
              label="State *"
              type="text"
              placeholder="State name"
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
            />
            <div>
              <FormField
                id="farmer-size"
                label="Farm Size (Acres) *"
                type="number"
                placeholder="e.g. 5"
                value={farmSize}
                onChange={(e) => setFarmSize(e.target.value)}
                required
              />
              {isFarmSizeInvalid && (
                <p style={{ color: 'var(--color-error)', fontSize: 'var(--text-xs)', marginTop: '4px' }}>
                  Farm size must be greater than 0 acres.
                </p>
              )}
            </div>
          </div>

          <FormSelect
            id="farmer-crop"
            label="Primary Crop *"
            value={primaryCrop}
            onChange={(e) => setPrimaryCrop(e.target.value)}
            options={CROP_OPTIONS}
          />

          <SubmitButton id="farmer-step1-continue" disabled={!isStep1Valid}>
            Continue to Account Setup <ArrowRight size={18} aria-hidden="true" />
          </SubmitButton>
        </form>
      ) : (
        /* ── STEP 2: FARMER ACCOUNT ─────────────────────────────────────── */
        <form onSubmit={handleStep2Submit} className={styles.form} noValidate>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
            <PasswordField
              id="farmer-create-password"
              label="Create Password *"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
            <PasswordStrength password={password} />
          </div>

          <PasswordField
            id="farmer-confirm-password"
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

          {/* Terms & Privacy Checkbox */}
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
              <SubmitButton id="farmer-create-account-btn" loading={loading} disabled={!isStep2Valid}>
                Create Farmer Account
              </SubmitButton>
            </div>
          </div>
        </form>
      )}
    </div>
  )
}
