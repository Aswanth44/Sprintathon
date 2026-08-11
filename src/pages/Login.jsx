import { useState, lazy, Suspense, useRef, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Logo from '../components/branding/Logo'
import RoleSelector from '../components/auth/RoleSelector'
import FarmerLogin from '../components/auth/FarmerLogin'
import BuyerLogin from '../components/auth/BuyerLogin'
import CustomCursor from '../components/ui/CustomCursor'
import styles from './Login.module.css'

// Lazy-load the heavy Three.js scene so auth renders instantly
const FarmScene = lazy(() => import('../components/three/FarmScene'))

/* ─── Hooks ─────────────────────────────────────────────────────────────── */

/** Detects touch-only devices */
export function useIsTouch() {
  return typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
}

/** Detects prefers-reduced-motion */
export function useReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Detects mobile viewport (≤ 768px) */
export function useIsMobile() {
  const [mobile, setMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth <= 768 : false
  )
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    const handler = (e) => setMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return mobile
}

/* ─── Scene fallback (shown while Three.js loads) ────────────────────── */
function SceneFallback() {
  return (
    <div className={styles.sceneFallback} aria-hidden="true">
      <div className={styles.sceneFallbackPulse} />
    </div>
  )
}

/* ─── Left Visual Panel ──────────────────────────────────────────────── */
export function VisualPanel({ logoParallax, isMobile, reducedMotion }) {
  return (
    <section className={styles.leftPanel} aria-label="Farm to market visual">
      <Suspense fallback={<SceneFallback />}>
        <FarmScene
          logoParallax={logoParallax}
          isMobile={isMobile}
          reducedMotion={reducedMotion}
        />
      </Suspense>
    </section>
  )
}

/* ─── Right Auth Panel ───────────────────────────────────────────────── */
const FORM_VARIANTS = {
  initial: (dir) => ({ opacity: 0, x: dir > 0 ? 28 : -28 }),
  animate: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 420, damping: 34 },
  },
  exit: (dir) => ({
    opacity: 0,
    x: dir > 0 ? -28 : 28,
    transition: { duration: 0.14 },
  }),
}

function AuthPanel({ role, onRoleChange, onNavigate }) {
  const [direction, setDirection] = useState(0)

  const handleRoleChange = (newRole) => {
    setDirection(newRole === 'buyer' ? 1 : -1)
    onRoleChange(newRole)
  }

  return (
    <section className={styles.rightPanel} aria-label="Sign in to UzhavarSetu">
      <div className={styles.authCard}>

        {/* Mobile logo — only visible on small screens (left panel logo is hidden) */}
        <div className={styles.mobileLogoWrap} aria-hidden="false">
          <Logo size="lg" />
        </div>

        {/* Header */}
        <header className={styles.authHeader}>
          <h1 className={styles.authTitle}>
            Welcome to <span className={styles.titleAccent}>UzhavarSetu</span>
          </h1>
          <p className={styles.authSubtitle}>Connecting Farmers to Fair Markets</p>
        </header>

        {/* Role selector */}
        <RoleSelector selected={role} onChange={handleRoleChange} />

        {/* Animated form area */}
        <div className={styles.formArea} id="auth-form-region" aria-live="polite">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={role}
              custom={direction}
              variants={FORM_VARIANTS}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {role === 'farmer' ? (
                <FarmerLogin onNavigate={onNavigate} />
              ) : (
                <BuyerLogin onNavigate={onNavigate} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <footer className={styles.authFooter}>
          <p className={styles.authFooterText}>
            By signing in you agree to our{' '}
            <a href="#terms" className={styles.authFooterLink}>Terms of Service</a>
            {' '}and{' '}
            <a href="#privacy" className={styles.authFooterLink}>Privacy Policy</a>
          </p>
        </footer>
      </div>
    </section>
  )
}

/* ─── Main Login Page ─────────────────────────────────────────────────── */
export default function LoginPage({ onNavigate }) {
  const [role, setRole] = useState('farmer')
  const isMobile      = useIsMobile()
  const isTouch       = useIsTouch()
  const reducedMotion = useReducedMotion()

  // Subtle logo parallax state (in pixels, very small)
  const [logoParallax, setLogoParallax] = useState({ x: 0, y: 0 })

  const handleMouseMove = useCallback((e) => {
    if (isTouch || reducedMotion) return

    const nx = (e.clientX / window.innerWidth) * 2 - 1   // -1 to 1
    const ny = -((e.clientY / window.innerHeight) * 2 - 1) // -1 to 1

    // Logo parallax: max ±6px X, ±4px Y
    setLogoParallax({ x: nx * 6, y: ny * 4 })
  }, [isTouch, reducedMotion])

  useEffect(() => {
    if (isMobile || isTouch || reducedMotion) return
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [isMobile, isTouch, reducedMotion, handleMouseMove])

  return (
    <>
      {/* Role-aware custom cursor (hidden on touch/mobile) */}
      {!isMobile && !isTouch && (
        <CustomCursor role={role} />
      )}

      <main className={styles.page}>
        {/* Left: 3D agricultural visual (hidden on mobile) */}
        {!isMobile && (
          <VisualPanel
            logoParallax={logoParallax}
            isMobile={isMobile}
            reducedMotion={reducedMotion}
          />
        )}

        {/* Right: Auth card */}
        <AuthPanel role={role} onRoleChange={setRole} onNavigate={onNavigate} />
      </main>
    </>
  )
}
