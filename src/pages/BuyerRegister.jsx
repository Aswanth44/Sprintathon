import { useState, useEffect, useCallback } from 'react'
import Logo from '../components/branding/Logo'
import BuyerRegistration from '../components/auth/BuyerRegistration'
import CustomCursor from '../components/ui/CustomCursor'
import { VisualPanel, useIsMobile, useIsTouch, useReducedMotion } from './Login'
import styles from './Login.module.css'

export default function BuyerRegister({ onNavigate }) {
  const isMobile      = useIsMobile()
  const isTouch       = useIsTouch()
  const reducedMotion = useReducedMotion()

  const [logoParallax, setLogoParallax] = useState({ x: 0, y: 0 })

  const handleMouseMove = useCallback((e) => {
    if (isTouch || reducedMotion) return
    const nx = (e.clientX / window.innerWidth) * 2 - 1
    const ny = -((e.clientY / window.innerHeight) * 2 - 1)
    setLogoParallax({ x: nx * 6, y: ny * 4 })
  }, [isTouch, reducedMotion])

  useEffect(() => {
    if (isMobile || isTouch || reducedMotion) return
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [isMobile, isTouch, reducedMotion, handleMouseMove])

  return (
    <>
      {!isMobile && !isTouch && <CustomCursor role="buyer" />}

      <main className={styles.page}>
        <VisualPanel
          logoParallax={logoParallax}
          isMobile={isMobile}
          reducedMotion={reducedMotion}
        />

        <section className={styles.rightPanel} aria-label="Buyer Registration">
          <div className={styles.authCard}>

            <div className={styles.mobileLogoWrap}>
              <Logo size="lg" />
            </div>

            <header className={styles.authHeader}>
              <h1 className={styles.authTitle}>
                Buyer <span className={styles.titleAccent}>Registration</span>
              </h1>
              <p className={styles.authSubtitle}>
                Source fresh, high-quality farm produce directly from verified Indian farmers
              </p>
            </header>

            <BuyerRegistration onNavigate={onNavigate} />

            <footer className={styles.authFooter}>
              <p className={styles.authFooterText}>
                Already have an account?{' '}
                <a
                  href="#login"
                  onClick={(e) => {
                    e.preventDefault()
                    if (onNavigate) onNavigate('login')
                  }}
                  className={styles.authFooterLink}
                  style={{ fontWeight: 'var(--font-semibold)' }}
                >
                  Sign In
                </a>
              </p>
            </footer>

          </div>
        </section>
      </main>
    </>
  )
}
