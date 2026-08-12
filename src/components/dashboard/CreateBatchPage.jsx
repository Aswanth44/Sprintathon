import { useState } from 'react'
import {
  Package,
  Sprout,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Edit3,
  QrCode,
  Eye,
  ListFilter,
} from 'lucide-react'
import FormSelect from '../auth/FormSelect'
import { FormField } from '../auth/LoginForm'
import { createBatch } from '../../api/batchApi'
import { formatDate } from '../../utils/formatters'
import styles from './CreateBatchPage.module.css'

const CROPS = ['Tomato', 'Onion', 'Potato', 'Rice', 'Coconut', 'Banana', 'Sugarcane', 'Vegetables', 'Fruits', 'Other']
const UNITS = ['kg', 'quintal', 'tonne', 'litre', 'pieces']
const GRADES = ['Grade A', 'Grade B', 'Grade C']
const TAMIL_NADU_DISTRICTS = [
  'Coimbatore', 'Erode', 'Salem', 'Tirupur', 'Thanjavur',
  'Madurai', 'Dharmapuri', 'Dindigul', 'Theni', 'Krishnagiri', 'Trichy',
]

/**
 * 3-Step Create New Produce Batch Wizard Component
 *
 * @param {{
 *   onBatchCreated: (batch: any) => void,
 *   onNavigateView: (view: string, extraData?: any) => void
 * }} props
 */
export default function CreateBatchPage({ onBatchCreated, onNavigateView }) {
  const [currentStep, setCurrentStep] = useState(1) // 1: Produce, 2: Farm, 3: Review, 4: Success

  // Today's YYYY-MM-DD for date validation
  const todayStr = new Date().toISOString().split('T')[0]

  // Form State
  const [crop, setCrop]                 = useState('Tomato')
  const [quantity, setQuantity]         = useState('500')
  const [unit, setUnit]                 = useState('kg')
  const [harvestDate, setHarvestDate]   = useState(todayStr)
  const [quality, setQuality]           = useState('Grade A')
  const [expectedPrice, setExpectedPrice] = useState('42')

  const [farmName, setFarmName]         = useState('Aswanth Organic Farm')
  const [village, setVillage]           = useState('Coimbatore')
  const [district, setDistrict]         = useState('Coimbatore')
  const [state, setState]               = useState('Tamil Nadu')
  const [location, setLocation]         = useState('Coimbatore, Tamil Nadu')

  // Validation & API States
  const [errors, setErrors]             = useState({})
  const [loading, setLoading]           = useState(false)
  const [submitError, setSubmitError]   = useState('')
  const [createdBatchResult, setCreatedBatchResult] = useState(null)

  // Step 1 Validation
  const validateStep1 = () => {
    const newErrors = {}
    const qtyNum = parseFloat(quantity)
    const priceNum = parseFloat(expectedPrice)

    if (!crop) newErrors.crop = 'Please select a crop.'
    if (isNaN(qtyNum) || qtyNum <= 0) newErrors.quantity = 'Quantity must be greater than 0.'
    if (!harvestDate) {
      newErrors.harvestDate = 'Harvest date is required.'
    } else if (harvestDate > todayStr) {
      newErrors.harvestDate = 'Harvest date cannot be a future date.'
    }
    if (isNaN(priceNum) || priceNum <= 0) newErrors.expectedPrice = 'Expected price must be greater than 0.'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Step 2 Validation
  const validateStep2 = () => {
    const newErrors = {}
    if (!village.trim()) newErrors.village = 'Village / Town is required.'
    if (!district.trim()) newErrors.district = 'District is required.'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextStep1 = () => {
    if (validateStep1()) {
      setCurrentStep(2)
    }
  }

  const handleNextStep2 = () => {
    if (validateStep2()) {
      setCurrentStep(3)
    }
  }

  // DEMO API & FUTURE BACKEND INTEGRATION POINT:
  // FUTURE BACKEND ENDPOINT:
  // POST /api/farmer/batches
  const handleFinalSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSubmitError('')

    const payload = {
      crop,
      quantity: parseFloat(quantity),
      unit,
      harvestDate,
      quality,
      expectedPrice: parseFloat(expectedPrice),
      farmName,
      village,
      district,
      state,
      location: location || `${village}, ${state}`,
    }

    try {
      const response = await createBatch(payload)
      setLoading(false)

      const created = response.batch || { batchId: response.batchId, ...payload }
      setCreatedBatchResult(created)
      setCurrentStep(4) // Success step

      if (onBatchCreated) {
        onBatchCreated(created)
      }
    } catch {
      setLoading(false)
      setSubmitError('Unable to create your batch. Please try again.')
    }
  }

  return (
    <div className={styles.container}>
      {/* Wizard Page Header */}
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.title}>Create New Produce Batch</h2>
          <p className={styles.subtitle}>
            Register your harvest and start tracking its journey
          </p>
        </div>

        {/* Step Progress Tracker Bar */}
        {currentStep <= 3 && (
          <div className={styles.progressBar} aria-label="Registration progress">
            <div className={`${styles.progressStep} ${currentStep >= 1 ? styles.stepActive : ''}`}>
              <div className={styles.stepCircle}>
                {currentStep > 1 ? <CheckCircle2 size={16} /> : 1}
              </div>
              <span className={styles.stepLabel}>Produce</span>
            </div>

            <div className={`${styles.progressLine} ${currentStep >= 2 ? styles.lineActive : ''}`} />

            <div className={`${styles.progressStep} ${currentStep >= 2 ? styles.stepActive : ''}`}>
              <div className={styles.stepCircle}>
                {currentStep > 2 ? <CheckCircle2 size={16} /> : 2}
              </div>
              <span className={styles.stepLabel}>Farm</span>
            </div>

            <div className={`${styles.progressLine} ${currentStep >= 3 ? styles.lineActive : ''}`} />

            <div className={`${styles.progressStep} ${currentStep >= 3 ? styles.stepActive : ''}`}>
              <div className={styles.stepCircle}>3</div>
              <span className={styles.stepLabel}>Review</span>
            </div>
          </div>
        )}
      </div>

      {/* ── STEP 1: PRODUCE DETAILS ─────────────────────────── */}
      {currentStep === 1 && (
        <form className={styles.formCard} onSubmit={(e) => { e.preventDefault(); handleNextStep1(); }}>
          <h3 className={styles.formSectionTitle}>Step 1 — Produce &amp; Harvest Details</h3>

          <div className={styles.formGrid}>
            <FormSelect
              id="batch-crop"
              label="Select Produce / Crop *"
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              options={CROPS}
            />

            <div className={styles.rowTwoCols}>
              <FormField
                id="batch-quantity"
                label="Quantity *"
                type="number"
                placeholder="e.g. 500"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />

              <FormSelect
                id="batch-unit"
                label="Measurement Unit *"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                options={UNITS}
              />
            </div>
            {errors.quantity && <p className={styles.errorText}>{errors.quantity}</p>}

            <FormField
              id="batch-harvestdate"
              label="Harvest Date * (Cannot be a future date)"
              type="date"
              max={todayStr}
              value={harvestDate}
              onChange={(e) => setHarvestDate(e.target.value)}
              required
            />
            {errors.harvestDate && <p className={styles.errorText}>{errors.harvestDate}</p>}

            <div className={styles.rowTwoCols}>
              <FormSelect
                id="batch-quality"
                label="Quality Grade *"
                value={quality}
                onChange={(e) => setQuality(e.target.value)}
                options={GRADES}
              />

              <FormField
                id="batch-price"
                label={`Expected Price (₹ / ${unit}) *`}
                type="number"
                placeholder="e.g. 42"
                value={expectedPrice}
                onChange={(e) => setExpectedPrice(e.target.value)}
                required
              />
            </div>
            {errors.expectedPrice && <p className={styles.errorText}>{errors.expectedPrice}</p>}
          </div>

          <div className={styles.btnRow}>
            <button
              type="submit"
              className={styles.nextBtn}
            >
              Continue to Farm Details <ArrowRight size={18} />
            </button>
          </div>
        </form>
      )}

      {/* ── STEP 2: FARM DETAILS ────────────────────────────── */}
      {currentStep === 2 && (
        <form className={styles.formCard} onSubmit={(e) => { e.preventDefault(); handleNextStep2(); }}>
          <h3 className={styles.formSectionTitle}>Step 2 — Farm &amp; Location Details</h3>

          <div className={styles.formGrid}>
            <FormField
              id="batch-farmname"
              label="Farm / Harvest Name"
              type="text"
              placeholder="e.g. Aswanth Organic Farm"
              value={farmName}
              onChange={(e) => setFarmName(e.target.value)}
            />

            <FormField
              id="batch-village"
              label="Village / Town *"
              type="text"
              placeholder="e.g. Coimbatore"
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              required
            />
            {errors.village && <p className={styles.errorText}>{errors.village}</p>}

            <div className={styles.rowTwoCols}>
              <FormSelect
                id="batch-district"
                label="District *"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                options={TAMIL_NADU_DISTRICTS}
              />

              <FormField
                id="batch-state"
                label="State"
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                readOnly
              />
            </div>

            <FormField
              id="batch-location"
              label="Full Farm Location Address *"
              type="text"
              placeholder="e.g. Coimbatore, Tamil Nadu"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          <div className={styles.btnRowBetween}>
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className={styles.backBtn}
            >
              <ArrowLeft size={18} /> Back
            </button>
            <button
              type="submit"
              className={styles.nextBtn}
            >
              Continue to Review <ArrowRight size={18} />
            </button>
          </div>
        </form>
      )}

      {/* ── STEP 3: REVIEW ──────────────────────────────────── */}
      {currentStep === 3 && (
        <div className={styles.formCard}>
          <h3 className={styles.formSectionTitle}>Step 3 — Review Batch Registration</h3>

          <div className={styles.reviewGrid}>
            {/* Produce Summary Card */}
            <div className={styles.reviewCard}>
              <div className={styles.reviewHead}>
                <div className={styles.reviewHeadLeft}>
                  <Package size={18} className={styles.reviewIcon} />
                  <h4 className={styles.reviewTitle}>Produce Details</h4>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className={styles.editLink}
                >
                  <Edit3 size={14} /> Edit
                </button>
              </div>

              <div className={styles.reviewBodyGrid}>
                <div>Crop: <strong>{crop}</strong></div>
                <div>Quantity: <strong>{quantity} {unit}</strong></div>
                <div>Quality: <strong>{quality}</strong></div>
                <div>Harvest Date: <strong>{formatDate(harvestDate)}</strong></div>
                <div>Expected Price: <strong>₹{expectedPrice} / {unit}</strong></div>
              </div>
            </div>

            {/* Farm Summary Card */}
            <div className={styles.reviewCard}>
              <div className={styles.reviewHead}>
                <div className={styles.reviewHeadLeft}>
                  <Sprout size={18} className={styles.reviewIcon} />
                  <h4 className={styles.reviewTitle}>Farm &amp; Location Details</h4>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className={styles.editLink}
                >
                  <Edit3 size={14} /> Edit
                </button>
              </div>

              <div className={styles.reviewBodyGrid}>
                <div>Farm Name: <strong>{farmName || 'N/A'}</strong></div>
                <div>Village: <strong>{village}</strong></div>
                <div>District: <strong>{district}</strong></div>
                <div>State: <strong>{state}</strong></div>
                <div style={{ gridColumn: 'span 2' }}>Location: <strong>{location}</strong></div>
              </div>
            </div>
          </div>

          {submitError && (
            <div className={styles.submitErrorBox}>
              <p>{submitError}</p>
            </div>
          )}

          <div className={styles.btnRowBetween}>
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className={styles.backBtn}
              disabled={loading}
            >
              <ArrowLeft size={18} /> Back
            </button>

            <button
              type="button"
              onClick={handleFinalSubmit}
              disabled={loading}
              className={styles.submitBtn}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className={styles.spinner} /> Creating your batch...
                </>
              ) : (
                'Register & Create Batch'
              )}
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 4: SUCCESS SCREEN ───────────────────────────── */}
      {currentStep === 4 && createdBatchResult && (
        <div className={styles.successCard}>
          <div className={styles.successIconWrap}>
            <CheckCircle2 size={48} />
          </div>

          <h3 className={styles.successTitle}>✓ Batch Created Successfully</h3>
          <p className={styles.successSubtitle}>
            Your produce batch has been registered and is ready for tracking.
          </p>

          <div className={styles.batchIdBadge}>
            Batch ID: <strong>{createdBatchResult.batchId}</strong>
          </div>

          <div className={styles.successDetailsChip}>
            <span>{createdBatchResult.crop}</span>
            <span>•</span>
            <span>{createdBatchResult.quantity} {createdBatchResult.unit}</span>
            <span>•</span>
            <span>{createdBatchResult.quality}</span>
          </div>

          <div className={styles.statusSummaryRow}>
            <div>Status: <strong style={{ color: 'var(--color-green-mid)' }}>● Created</strong></div>
            <div>Current Stage: <strong>🌾 Farm</strong></div>
          </div>

          {/* Navigation Options */}
          <div className={styles.successActionsGrid}>
            <button
              onClick={() => onNavigateView && onNavigateView('batch-qr', { batch: createdBatchResult })}
              className={styles.actionBtnPrimary}
            >
              <QrCode size={18} /> View QR Code
            </button>

            <button
              onClick={() => onNavigateView && onNavigateView('batch-details', { batchId: createdBatchResult.batchId })}
              className={styles.actionBtnSecondary}
            >
              <Eye size={18} /> View Batch Details
            </button>

            <button
              onClick={() => onNavigateView && onNavigateView('batches')}
              className={styles.actionBtnOutline}
            >
              <ListFilter size={18} /> Go to My Batches
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
