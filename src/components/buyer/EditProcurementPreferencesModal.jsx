import { useState, useEffect } from 'react'
import { X, Sliders, Loader2 } from 'lucide-react'
import { getPersistedBuyerSettings, savePersistedBuyerSettings } from '../../mock/mockBuyerProfileData'
import styles from './BuyerModal.module.css'

export default function EditProcurementPreferencesModal({ isOpen, onClose, onSaved }) {
  const [preferredCrops, setPreferredCrops]     = useState(['Tomato', 'Onion', 'Potato'])
  const [preferredGrade, setPreferredGrade]     = useState('Grade A')
  const [preferredLocation, setPreferredLocation] = useState('Coimbatore')
  const [minQty, setMinQty]                     = useState('100')
  const [maxQty, setMaxQty]                     = useState('5000')

  const [loading, setLoading]                   = useState(false)
  const [error, setError]                       = useState('')

  const AVAILABLE_CROPS = ['Tomato', 'Onion', 'Potato', 'Coconut', 'Banana', 'Other']
  const QUALITY_GRADES = ['Grade A', 'Grade B', 'Any Grade']
  const LOCATIONS = ['Coimbatore', 'Pollachi', 'Tiruppur', 'Erode', 'Tamil Nadu', 'Anywhere']

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      const settings = getPersistedBuyerSettings()
      if (settings.preferences) {
        setPreferredCrops(settings.preferences.preferredCrops || ['Tomato', 'Onion', 'Potato'])
        setPreferredGrade(settings.preferences.preferredGrade || 'Grade A')
        setPreferredLocation(settings.preferences.preferredLocation || 'Coimbatore')
        setMinQty(settings.preferences.minPurchaseQty || '100')
        setMaxQty(settings.preferences.maxPurchaseQty || '5000')
      }
      setError('')
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleCropToggle = (crop) => {
    if (preferredCrops.includes(crop)) {
      if (preferredCrops.length === 1) return // Keep at least one selected
      setPreferredCrops(preferredCrops.filter((c) => c !== crop))
    } else {
      setPreferredCrops([...preferredCrops, crop])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const currentSettings = getPersistedBuyerSettings()
      const updatedSettings = {
        ...currentSettings,
        preferences: {
          ...currentSettings.preferences,
          preferredCrops,
          preferredGrade,
          preferredLocation,
          minPurchaseQty: minQty,
          maxPurchaseQty: maxQty,
        },
      }

      savePersistedBuyerSettings(updatedSettings)
      if (onSaved) onSaved(updatedSettings)
      onClose()
    } catch {
      setError('Failed to save preferences.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.headerTitleWrap}>
            <Sliders className={styles.headerIcon} size={22} />
            <h2 className={styles.modalTitle}>Edit Procurement Preferences</h2>
          </div>
          <button onClick={onClose} className={styles.closeBtn} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.errorAlert}>{error}</div>}

          {/* Preferred Crops Checkboxes */}
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Preferred Crops (Select all that apply)*</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '4px' }}>
              {AVAILABLE_CROPS.map((crop) => (
                <label key={crop} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-xs)', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={preferredCrops.includes(crop)}
                    onChange={() => handleCropToggle(crop)}
                    style={{ accentColor: 'var(--color-green-deep)', width: 16, height: 16 }}
                  />
                  <span>{crop}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Preferred Quality Grade */}
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Preferred Quality Grade*</label>
            <select
              value={preferredGrade}
              onChange={(e) => setPreferredGrade(e.target.value)}
              className={styles.selectInput}
            >
              {QUALITY_GRADES.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          {/* Preferred Sourcing Location */}
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Preferred Sourcing Location*</label>
            <select
              value={preferredLocation}
              onChange={(e) => setPreferredLocation(e.target.value)}
              className={styles.selectInput}
            >
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {/* Min & Max Qty */}
          <div className={styles.grid2}>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Minimum Purchase Qty (kg)*</label>
              <input
                type="number"
                required
                min="1"
                value={minQty}
                onChange={(e) => setMinQty(e.target.value)}
                className={styles.textInput}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Maximum Purchase Qty (kg)*</label>
              <input
                type="number"
                required
                min="1"
                value={maxQty}
                onChange={(e) => setMaxQty(e.target.value)}
                className={styles.textInput}
              />
            </div>
          </div>

          <div className={styles.btnRow}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>
              Cancel
            </button>
            <button type="submit" disabled={loading} className={styles.submitBtn}>
              {loading ? <Loader2 size={16} className={styles.spinner} /> : 'Save Preferences'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
