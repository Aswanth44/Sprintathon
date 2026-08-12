import { useState, useEffect } from 'react'
import { X, Building2, Loader2 } from 'lucide-react'
import { getPersistedBuyerProfile, savePersistedBuyerProfile, savePersistedBuyerSettings, getPersistedBuyerSettings } from '../../mock/mockBuyerProfileData'
import styles from './BuyerModal.module.css'

export default function EditBusinessInfoModal({ isOpen, onClose, onSaved }) {
  const [orgName, setOrgName]         = useState('')
  const [contactPerson, setContactPerson] = useState('')
  const [mobile, setMobile]           = useState('')
  const [email, setEmail]             = useState('')
  const [buyerType, setBuyerType]     = useState('')
  const [location, setLocation]       = useState('')
  const [gstNumber, setGstNumber]     = useState('')

  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState('')

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      const data = getPersistedBuyerProfile()
      setOrgName(data.organizationName || 'GreenFresh Retail Sourcing Pvt Ltd')
      setContactPerson(data.contactPerson || 'Ramesh Kumar')
      setMobile(data.mobile || '+91 98765 12345')
      setEmail(data.email || 'procurement@greenfresh.in')
      setBuyerType(data.buyerType || 'Retail Procurement Hub')
      setLocation(data.location || 'Coimbatore, Tamil Nadu')
      setGstNumber(data.gstNumber || '33AAAAA0000A1Z5')
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
    setLoading(true)

    try {
      const currentProfile = getPersistedBuyerProfile()
      const updatedProfile = {
        ...currentProfile,
        organizationName: orgName.trim(),
        buyerName: orgName.trim(),
        contactPerson: contactPerson.trim(),
        mobile: mobile.trim(),
        email: email.trim(),
        buyerType: buyerType.trim(),
        location: location.trim(),
        gstNumber: gstNumber.trim(),
      }

      savePersistedBuyerProfile(updatedProfile)

      const currentSettings = getPersistedBuyerSettings()
      savePersistedBuyerSettings({
        ...currentSettings,
        business: {
          organizationName: orgName.trim(),
          gstNumber: gstNumber.trim(),
          procurementCategory: buyerType.trim(),
        },
      })

      if (onSaved) onSaved(updatedProfile)
      onClose()
    } catch {
      setError('Failed to save business information.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.headerTitleWrap}>
            <Building2 className={styles.headerIcon} size={22} />
            <h2 className={styles.modalTitle}>Edit Business &amp; Profile Info</h2>
          </div>
          <button onClick={onClose} className={styles.closeBtn} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.errorAlert}>{error}</div>}

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Organization / Company Name*</label>
            <input
              type="text"
              required
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className={styles.textInput}
              placeholder="e.g. GreenFresh Traders"
            />
          </div>

          <div className={styles.grid2}>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Contact Person*</label>
              <input
                type="text"
                required
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className={styles.textInput}
                placeholder="e.g. Ramesh Kumar"
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Business Type / Category*</label>
              <input
                type="text"
                required
                value={buyerType}
                onChange={(e) => setBuyerType(e.target.value)}
                className={styles.textInput}
                placeholder="e.g. Retail Procurement Hub"
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
                placeholder="+91 98765 12345"
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
                placeholder="email@company.com"
              />
            </div>
          </div>

          <div className={styles.grid2}>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Business Location*</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className={styles.textInput}
                placeholder="Coimbatore, Tamil Nadu"
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>GST / Registration Number*</label>
              <input
                type="text"
                required
                value={gstNumber}
                onChange={(e) => setGstNumber(e.target.value)}
                className={styles.textInput}
                placeholder="33AAAAA0000A1Z5"
              />
            </div>
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
