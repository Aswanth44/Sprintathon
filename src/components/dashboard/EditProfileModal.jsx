import { useState } from 'react'
import { X, UserCheck, Loader2 } from 'lucide-react'
import FormSelect from '../auth/FormSelect'
import { FormField, SubmitButton } from '../auth/LoginForm'
import { updateProfile } from '../../api/farmerApi'
import styles from './EditProfileModal.module.css'

const TAMIL_NADU_DISTRICTS = [
  'Coimbatore', 'Erode', 'Salem', 'Tirupur', 'Thanjavur',
  'Madurai', 'Dharmapuri', 'Dindigul', 'Theni', 'Krishnagiri', 'Trichy',
]

/**
 * Edit Profile Modal Dialog Component
 * Uses farmerApi.updateProfile service function
 *
 * @param {{ isOpen: boolean, profile: any, onClose: () => void, onProfileUpdated: (profile: any) => void }} props
 */
export default function EditProfileModal({ isOpen, profile = {}, onClose, onProfileUpdated }) {
  const [fullName, setFullName] = useState(profile.name || 'Aswanth')
  const [village, setVillage]   = useState(profile.village || 'Coimbatore')
  const [district, setDistrict] = useState(profile.district || 'Coimbatore')
  const [state, setState]       = useState(profile.state || 'Tamil Nadu')

  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  if (!isOpen) return null

  // DEMO API:
  // FUTURE BACKEND ENDPOINT:
  // PUT /api/farmer/profile
  // Replace this mock call with Spring Boot API when ready.
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await updateProfile({
        name: fullName,
        village,
        district,
        state,
      })

      setLoading(false)
      if (onProfileUpdated) {
        onProfileUpdated(response.farmer)
      }
      onClose()
    } catch {
      setLoading(false)
      setError('Failed to update profile. Please try again.')
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose} aria-modal="true" role="dialog">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.headerTitleWrap}>
            <UserCheck size={20} className={styles.headerIcon} />
            <h2 className={styles.modalTitle}>Edit Profile Information</h2>
          </div>
          <button onClick={onClose} className={styles.closeBtn} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <FormField
            id="edit-fullname"
            label="Full Name *"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <FormField
            id="edit-village"
            label="Village / Town *"
            type="text"
            value={village}
            onChange={(e) => setVillage(e.target.value)}
            required
          />

          <FormSelect
            id="edit-district"
            label="District *"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            options={TAMIL_NADU_DISTRICTS}
          />

          <FormField
            id="edit-state"
            label="State"
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            readOnly
          />

          {error && <p className={styles.errorText}>{error}</p>}

          <div className={styles.btnRow}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>
              Cancel
            </button>
            <div style={{ flex: 1 }}>
              <SubmitButton id="btn-save-profile" loading={loading}>
                {loading ? <Loader2 size={16} className={styles.spinner} /> : 'Save Changes'}
              </SubmitButton>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
