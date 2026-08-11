import { Check } from 'lucide-react'
import styles from './RegistrationProgress.module.css'

/**
 * Step Progress Bar for Farmer & Buyer Registration
 * Step 1: ●────────────○ (Details | Account)
 * Step 2: ✓────────────● (Details | Account)
 *
 * @param {1|2} currentStep
 */
export default function RegistrationProgress({ currentStep = 1 }) {
  return (
    <div className={styles.progressContainer} aria-label={`Registration progress, Step ${currentStep} of 2`}>
      <div className={styles.stepsRow}>
        {/* Step 1 Node */}
        <div className={`${styles.stepNode} ${currentStep === 1 ? styles.active : styles.completed}`}>
          <div className={styles.nodeCircle}>
            {currentStep > 1 ? (
              <Check size={14} className={styles.checkIcon} aria-hidden="true" />
            ) : (
              <span className={styles.dot} />
            )}
          </div>
          <span className={styles.stepLabel}>1. Details</span>
        </div>

        {/* Connecting Line */}
        <div className={styles.lineTrack}>
          <div
            className={styles.lineProgress}
            style={{ width: currentStep > 1 ? '100%' : '0%' }}
          />
        </div>

        {/* Step 2 Node */}
        <div className={`${styles.stepNode} ${currentStep === 2 ? styles.active : styles.upcoming}`}>
          <div className={styles.nodeCircle}>
            <span className={styles.dot} />
          </div>
          <span className={styles.stepLabel}>2. Account</span>
        </div>
      </div>
    </div>
  )
}
