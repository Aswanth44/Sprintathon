import { useState, useEffect } from 'react'
import { X, Lock, CheckCircle2, Loader2 } from 'lucide-react'
import styles from './BuyerModal.module.css'

export default function ChangeBuyerPasswordModal({ isOpen, onClose, onSuccess }) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword]         = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setError('')
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!currentPassword) {
      setError('Please enter your current password.')
      return
    }

    if (!newPassword || newPassword.length < 6) {
      setError('New password must be at least 6 characters long.')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match. Please verify.')
      return
    }

    setLoading(true)

    try {
      await new Promise((res) => setTimeout(res, 600))
      if (onSuccess) onSuccess('Password updated successfully!')
      onClose()
    } catch {
      setError('Failed to update password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.headerTitleWrap}>
            <Lock className={styles.headerIcon} size={22} />
            <h2 className={styles.modalTitle}>Change Password</h2>
          </div>
          <button onClick={onClose} className={styles.closeBtn} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.errorAlert}>{error}</div>}

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Current Password*</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={styles.textInput}
              placeholder="Enter current password"
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>New Password*</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={styles.textInput}
              placeholder="Minimum 6 characters"
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Confirm New Password*</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={styles.textInput}
              placeholder="Re-enter new password"
            />
          </div>

          <div className={styles.btnRow}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>
              Cancel
            </button>
            <button type="submit" disabled={loading} className={styles.submitBtn}>
              {loading ? <Loader2 size={16} className={styles.spinner} /> : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
