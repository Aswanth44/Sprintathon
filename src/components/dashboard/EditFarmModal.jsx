import { useState } from 'react'
import { X, Sprout, Loader2 } from 'lucide-react'
import FormSelect from '../auth/FormSelect'
import { FormField, SubmitButton } from '../auth/LoginForm'
import { updateFarmDetails } from '../../api/farmerApi'
import styles from './EditProfileModal.module.css' // Reuse modal layout styles

const TAMIL_NADU_DISTRICTS = [
  'Coimbatore', 'Erode', 'Salem', 'Tirupur', 'Thanjavur',
  'Madurai', 'Dharmapuri', 'Dindigul', 'Theni', 'Krishnagiri', 'Trichy',
]

/**
 * Edit Farm Details Modal Dialog Component
 * Uses farmerApi.updateFarmDetails service function
 *
 * @param {{ isOpen: boolean, farm: any, onClose: () => void, onFarmUpdated: (farm: any) => void }} props
 */
export default function EditFarmModal({ isOpen, farm = {}, onClose, onFarmUpdated }) {
  const initialAcres = parseFloat(farm.farmSize) || 5.5
  const [farmSize, setFarmSize]         = useState(initialAcres.toString())
  const [primaryCrops, setPrimaryCrops] = useState(farm.primaryCrop || 'Tomato, Onion, Coconut')
  const [village, setVillage]           = useState(farm.village || 'Coimbatore')
  const [district, setDistrict]         = useState(farm.district || 'Coimbatore')

  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  if (!isOpen) return null

  // DEMO API:
  // FUTURE BACKEND ENDPOINT:
  // PUT /api/farmer/farm-details
  // Replace this mock call with Spring Boot API when ready.
  const handleSubmit = async (e) => {
    e.preventDefault()
    const sizeNum = parseFloat(farmSize)
    if (isNaN(sizeNum) || sizeNum <= 0) {
      setError('Farm size must be a positive number of acres (greater than 0).')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await updateFarmDetails({
        farmSize: `${sizeNum} acres`,
        primaryCrops,
        village,
        district,
      })

      setLoading(false)
      if (onFarmUpdated) {
        onFarmUpdated(response.farm)
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
            label="Farm Size (Acres) *"
            type="number"
            step="0.1"
            min="0.1"
            value={farmSize}
            onChange={(e) => setFarmSize(e.target.value)}
            required
          />

          <FormField
            id="edit-crops"
            label="Primary Crops *"
            type="text"
            placeholder="e.g. Tomato, Onion, Coconut"
            value={primaryCrops}
            onChange={(e) => setPrimaryCrops(e.target.value)}
            required
          />

          <FormField
            id="edit-farm-village"
            label="Village / Town *"
            type="text"
            value={village}
            onChange={(e) => setVillage(e.target.value)}
            required
          />

          <FormSelect
            id="edit-farm-district"
            label="District *"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            options={TAMIL_NADU_DISTRICTS}
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
