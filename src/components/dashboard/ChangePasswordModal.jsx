import { useState, useEffect } from 'react'
import { X, Lock, CheckCircle2 } from 'lucide-react'
import { FormField, PasswordField, SubmitButton } from '../auth/LoginForm'
import PasswordStrength from '../auth/PasswordStrength'
import styles from './EditProfileModal.module.css'

/**
 * Change Password Modal Dialog Component (Demo Frontend Only)
 *
 * @param {{ isOpen: boolean, onClose: () => void }} props
 */
export default function ChangePasswordModal({ isOpen, onClose }) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword]         = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError]     = useState('')

  // Lock background page scroll while modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  // DEMO ONLY
  // Backend integration required here.
  // FUTURE ENDPOINT:
  // PUT /api/auth/change-password
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!currentPassword) {
      setError('Please enter your current password.')
      return
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.')
      return
    }

    setError('')
    setLoading(true)

    // Simulate backend response
    await new Promise((resolve) => setTimeout(resolve, 600))
    setLoading(false)
    setSuccess(true)
  }

  const handleClose = () => {
    setSuccess(false)
    setError('')
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    onClose()
  }

  return (
    <div className={styles.overlay} onClick={handleClose} aria-modal="true" role="dialog">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.headerTitleWrap}>
            <Lock size={20} className={styles.headerIcon} />
            <h2 className={styles.modalTitle}>Change Account Password</h2>
          </div>
          <button onClick={handleClose} className={styles.closeBtn} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {success ? (
          <div style={{ padding: 'var(--space-6)', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', alignItems: 'center' }}>
            <CheckCircle2 size={44} style={{ color: 'var(--color-green-mid)' }} />
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--color-green-deep)' }}>
              Password Changed Successfully!
            </h3>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
              Password change will be connected to the backend.
            </p>
            <button onClick={handleClose} className={styles.cancelBtn} style={{ width: '100%' }}>
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            <PasswordField
              id="pwd-current"
              label="Current Password *"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />

            <PasswordField
              id="pwd-new"
              label="New Password *"
              placeholder="Min 6 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            {newPassword && <PasswordStrength password={newPassword} />}

            <PasswordField
              id="pwd-confirm"
              label="Confirm New Password *"
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            {error && <p className={styles.errorText}>{error}</p>}

            <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', background: 'var(--color-cream)', padding: 'var(--space-2) var(--space-3)', borderRadius: 'var(--radius-md)' }}>
              ℹ️ Password change will be connected to the backend in production.
            </p>

            <div className={styles.btnRow}>
              <button type="button" onClick={handleClose} className={styles.cancelBtn}>
                Cancel
              </button>
              <div style={{ flex: 1 }}>
                <SubmitButton id="btn-submit-pwd" loading={loading}>
                  Update Password
                </SubmitButton>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
