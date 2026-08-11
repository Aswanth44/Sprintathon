import { useState } from 'react'
import { X, CheckCircle2, Package } from 'lucide-react'
import FormSelect from '../auth/FormSelect'
import { FormField, SubmitButton } from '../auth/LoginForm'
import { createBatch } from '../../api/batchApi'
import styles from './CreateBatchModal.module.css'

const CROPS = ['Tomato', 'Onion', 'Potato', 'Rice', 'Coconut', 'Banana', 'Sugarcane', 'Vegetables']
const GRADES = ['Grade A (Export/Fair Market)', 'Grade B (Standard Market)', 'Grade C (Processing/Industrial)']

/**
 * Interactive Create New Batch Modal Dialog
 * Uses batchApi service for creating new produce batches
 *
 * @param {{ isOpen: boolean, onClose: () => void, onBatchCreated: (batch: any) => void }} props
 */
export default function CreateBatchModal({ isOpen, onClose, onBatchCreated }) {
  const [crop, setCrop]         = useState('Tomato')
  const [quantity, setQuantity] = useState('500')
  const [grade, setGrade]       = useState('Grade A (Export/Fair Market)')
  const [loading, setLoading]   = useState(false)
  const [createdBatch, setCreatedBatch] = useState(null)
  const [error, setError]       = useState('')

  if (!isOpen) return null

  // DEMO API & FUTURE BACKEND INTEGRATION POINT:
  // FUTURE BACKEND ENDPOINT:
  // POST /api/farmer/batches
  // Replace this call with Spring Boot API when available.
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await createBatch({
        crop,
        quantity: Number(quantity),
        unit: 'kg',
        quality: grade.split(' ')[0],
        harvestDate: new Date().toISOString().split('T')[0],
      })

      setLoading(false)
      setCreatedBatch(response.batch || { batchId: response.batchId })

      if (onBatchCreated) {
        onBatchCreated(response.batch)
      }
    } catch {
      setLoading(false)
      setError('Failed to create batch. Please try again.')
    }
  }

  const handleResetAndClose = () => {
    setCreatedBatch(null)
    setError('')
    onClose()
  }

  return (
    <div className={styles.overlay} onClick={handleResetAndClose} aria-modal="true" role="dialog">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.headerTitleWrap}>
            <Package size={20} className={styles.headerIcon} />
            <h2 className={styles.modalTitle}>Create New Produce Batch</h2>
          </div>
          <button onClick={handleResetAndClose} className={styles.closeBtn} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {createdBatch ? (
          <div className={styles.successView}>
            <div className={styles.successIconWrap}>
              <CheckCircle2 size={40} />
            </div>
            <h3 className={styles.successTitle}>Batch Registered Successfully!</h3>
            <p className={styles.successDesc}>
              Batch ID: <strong>{createdBatch.batchId}</strong>
            </p>
            <p className={styles.successSub}>
              Your {quantity} kg of {crop} ({grade.split(' ')[0]}) is now listed for verified buyer bids &amp; pickup.
            </p>
            <SubmitButton onClick={handleResetAndClose}>Back to Dashboard</SubmitButton>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            <FormSelect
              id="modal-crop"
              label="Select Produce / Crop *"
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              options={CROPS}
            />

            <FormField
              id="modal-quantity"
              label="Quantity in Kilograms (kg) *"
              type="number"
              placeholder="e.g. 500"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />

            <FormSelect
              id="modal-grade"
              label="Quality Grade *"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              options={GRADES}
            />

            {error && (
              <p style={{ color: 'var(--color-error)', fontSize: 'var(--text-xs)' }}>
                {error}
              </p>
            )}

            <div className={styles.btnRow}>
              <button type="button" onClick={handleResetAndClose} className={styles.cancelBtn}>
                Cancel
              </button>
              <div style={{ flex: 1 }}>
                <SubmitButton id="btn-submit-create-batch" loading={loading}>
                  + Register Batch
                </SubmitButton>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
