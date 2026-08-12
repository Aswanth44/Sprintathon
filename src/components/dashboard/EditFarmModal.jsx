import { useState, useEffect } from 'react'
import { X, Sprout, Loader2 } from 'lucide-react'
import { FormField, SubmitButton } from '../auth/LoginForm'
import { updateFarmDetails } from '../../api/farmerApi'
import styles from './EditProfileModal.module.css' // Reuse modal layout styles

/**
 * Edit Farm Details Modal Dialog Component
 * Allows editing Farm Size, Primary Crops, Other Crops, Farming Type, Farm Location.
 *
 * // TODO: Replace demo persistence with backend API
 * // Backend teammate will connect this to the Farmer Farm Details API.
 *
 * @param {{ isOpen: boolean, farm: any, onClose: () => void, onFarmUpdated: (farm: any) => void }} props
 */
export default function EditFarmModal({ isOpen, farm = {}, onClose, onFarmUpdated }) {
  const [farmSize, setFarmSize]         = useState(farm.farmSize || '5.5 acres')
  const [primaryCrops, setPrimaryCrops] = useState(farm.primaryCrops || 'Tomato, Onion, Coconut')
  const [otherCrops, setOtherCrops]     = useState(farm.otherCrops || 'Banana, Turmeric')
  const [farmingType, setFarmingType]   = useState(farm.farmingType || 'Organic & Drip Irrigated')
  const [farmLocation, setFarmLocation] = useState(farm.farmLocation || 'Pollachi North, Coimbatore - 642001')

  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  useEffect(() => {
    if (farm) {
      if (farm.farmSize) setFarmSize(farm.farmSize)
      if (farm.primaryCrops) {
        setPrimaryCrops(Array.isArray(farm.primaryCrops) ? farm.primaryCrops.join(', ') : farm.primaryCrops)
      }
      if (farm.otherCrops) {
        setOtherCrops(Array.isArray(farm.otherCrops) ? farm.otherCrops.join(', ') : farm.otherCrops)
      }
      if (farm.farmingType) setFarmingType(farm.farmingType)
      if (farm.farmLocation) setFarmLocation(farm.farmLocation)
    }
  }, [farm])

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

  // TODO: Replace demo persistence with backend API
  // Backend teammate will connect this to the Farmer Farm Details API.
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await updateFarmDetails({
        farmSize,
        primaryCrops,
        otherCrops,
        farmingType,
        farmLocation,
      })

      setLoading(false)
      if (onFarmUpdated) {
        onFarmUpdated({
          farmSize,
          primaryCrops: primaryCrops.split(',').map((c) => c.trim()),
          otherCrops: otherCrops.split(',').map((c) => c.trim()),
          farmingType,
          farmLocation,
          ...(response?.farm || {}),
        })
      }
      onClose()
    } catch {
      setLoading(false)
      setError('Failed to update farm details. Please try again.')
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose} aria-modal="true" role="dialog">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.headerTitleWrap}>
            <Sprout size={20} className={styles.headerIcon} />
            <h2 className={styles.modalTitle}>Edit Farm Information</h2>
          </div>
          <button onClick={onClose} className={styles.closeBtn} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <FormField
            id="edit-farmsize"
            label="Farm Size *"
            type="text"
            placeholder="e.g. 5.5 acres"
            value={farmSize}
            onChange={(e) => setFarmSize(e.target.value)}
            required
          />

          <FormField
            id="edit-primary-crops"
            label="Primary Crops *"
            type="text"
            placeholder="e.g. Tomato, Onion, Coconut"
            value={primaryCrops}
            onChange={(e) => setPrimaryCrops(e.target.value)}
            required
          />

          <FormField
            id="edit-other-crops"
            label="Other Crops"
            type="text"
            placeholder="e.g. Banana, Turmeric"
            value={otherCrops}
            onChange={(e) => setOtherCrops(e.target.value)}
          />

          <FormField
            id="edit-farming-type"
            label="Farming Type *"
            type="text"
            placeholder="e.g. Organic & Drip Irrigated"
            value={farmingType}
            onChange={(e) => setFarmingType(e.target.value)}
            required
          />

          <FormField
            id="edit-farm-location"
            label="Farm Location *"
            type="text"
            value={farmLocation}
            onChange={(e) => setFarmLocation(e.target.value)}
            required
          />

          {error && <p className={styles.errorText}>{error}</p>}

          <div className={styles.btnRow}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>
              Cancel
            </button>
            <div style={{ flex: 1 }}>
              <SubmitButton id="btn-save-farm" loading={loading}>
                {loading ? <Loader2 size={16} className={styles.spinner} /> : 'Save Farm Details'}
              </SubmitButton>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
