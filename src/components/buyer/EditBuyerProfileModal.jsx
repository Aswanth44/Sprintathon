import { useState, useEffect } from 'react'
import { X, UserCheck, Loader2 } from 'lucide-react'
import { getPersistedBuyerProfile, savePersistedBuyerProfile } from '../../mock/mockBuyerProfileData'
import styles from './EditBuyerProfileModal.module.css'

export default function EditBuyerProfileModal({ isOpen, profile, onClose, onProfileUpdated }) {
  const [buyerName, setBuyerName]           = useState('')
  const [orgName, setOrgName]               = useState('')
  const [buyerType, setBuyerType]           = useState('')
  const [contactPerson, setContactPerson]   = useState('')
  const [mobile, setMobile]                 = useState('')
  const [email, setEmail]                   = useState('')
  const [location, setLocation]             = useState('')

  const [loading, setLoading]               = useState(false)
  const [error, setError]                   = useState('')

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      const data = profile || getPersistedBuyerProfile()
      setBuyerName(data.buyerName || 'GreenFresh Traders')
      setOrgName(data.organizationName || 'GreenFresh Retail Sourcing Pvt Ltd')
      setBuyerType(data.buyerType || 'Retail Procurement Hub')
      setContactPerson(data.contactPerson || 'Ramesh Kumar')
      setMobile(data.mobile || '+91 98765 12345')
      setEmail(data.email || 'procurement@greenfresh.in')
      setLocation(data.location || 'Coimbatore, Tamil Nadu')
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen, profile])

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const updated = {
        ...(profile || getPersistedBuyerProfile()),
        buyerName: buyerName.trim(),
        organizationName: orgName.trim(),
        buyerType: buyerType.trim(),
        contactPerson: contactPerson.trim(),
        mobile: mobile.trim(),
        email: email.trim(),
        location: location.trim(),
      }

      savePersistedBuyerProfile(updated)
      if (onProfileUpdated) onProfileUpdated(updated)
      onClose()
    } catch {
      setError('Failed to update profile.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.headerTitleWrap}>
            <UserCheck className={styles.headerIcon} size={22} />
            <h2 className={styles.modalTitle}>Edit Buyer Profile</h2>
          </div>
          <button onClick={onClose} className={styles.closeBtn} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.errorText}>{error}</div>}

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Organization / Company Name*</label>
            <input
              type="text"
              required
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className={styles.textInput}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Trade / Display Name*</label>
            <input
              type="text"
              required
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
              className={styles.textInput}
            />
          </div>

          <div className={styles.grid2}>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Procurement Category / Type*</label>
              <input
                type="text"
                required
                value={buyerType}
                onChange={(e) => setBuyerType(e.target.value)}
                className={styles.textInput}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Contact Person Name*</label>
              <input
                type="text"
                required
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className={styles.textInput}
              />
            </div>
          </div>

          <div className={styles.grid2}>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Mobile Number*</label>
              <input
                type="text"
                required
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className={styles.textInput}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Email Address*</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.textInput}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Business Location*</label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={styles.textInput}
            />
          </div>

          <div className={styles.btnRow}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>
              Cancel
            </button>
            <button type="submit" disabled={loading} className={styles.submitBtn}>
              {loading ? <Loader2 size={16} className={styles.spinner} /> : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
