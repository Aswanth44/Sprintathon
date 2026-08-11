import { useEffect, useRef, useState } from 'react'
import styles from './CustomCursor.module.css'

/* ─── SVG cursor icons ──────────────────────────────────────────────────
   Small, clean vector shapes that match the brand.
   Farmer → leaf/sprout  |  Buyer → basket/cart
   ─────────────────────────────────────────────────────────────────────── */

function FarmerCursorIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={styles.cursorSvg}
      aria-hidden="true"
    >
      {/* Stem */}
      <path
        d="M12 22 L12 10"
        stroke="#1a4a2e"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Left leaf */}
      <path
        d="M12 16 C9 14.5 7 11 8.5 7.5 C8.5 7.5 11 9.5 12 13"
        fill="#2d6a4f"
        opacity="0.9"
      />
      {/* Right leaf */}
      <path
        d="M12 13 C15 11.5 17 8 15.5 4.5 C15.5 4.5 13 6.5 12 10"
        fill="#52b788"
        opacity="0.95"
      />
      {/* Sprout tip */}
      <circle cx="12" cy="9.5" r="1.5" fill="#d4a017" />
    </svg>
  )
}

function BuyerCursorIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={styles.cursorSvg}
      aria-hidden="true"
    >
      {/* Basket body */}
      <path
        d="M5 10 L6.5 18 H17.5 L19 10 Z"
        fill="#2d6a4f"
        stroke="#1a4a2e"
        strokeWidth="0.8"
      />
      {/* Basket handle */}
      <path
        d="M8 10 C8 6.5 16 6.5 16 10"
        stroke="#1a4a2e"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
      {/* Basket weave lines */}
      <line x1="5" y1="13.5" x2="19" y2="13.5" stroke="#52b788" strokeWidth="0.7" opacity="0.6" />
      <line x1="12" y1="10" x2="12" y2="18" stroke="#52b788" strokeWidth="0.7" opacity="0.5" />
      {/* Gold accent dot */}
      <circle cx="12" cy="7.5" r="1.2" fill="#d4a017" />
    </svg>
  )
}

/* ─── Main CustomCursor Component ─────────────────────────────────────── */
/**
 * @param {'farmer'|'buyer'} role - drives which cursor icon to show
 */
export default function CustomCursor({ role }) {
  const cursorRef = useRef(null)
  const dotRef    = useRef(null)
  const pos       = useRef({ x: -100, y: -100 })
  const actual    = useRef({ x: -100, y: -100 })
  const rafRef    = useRef(null)
  const [visible, setVisible] = useState(false)
  const [clicking, setClicking] = useState(false)

  // Check for touch/reduced-motion — hide custom cursor on those devices
  const [shouldShow] = useState(() => {
    if (typeof window === 'undefined') return false
    const isTouch = window.matchMedia('(pointer: coarse)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    return !isTouch && !reduced
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const body = document.body
    const root = document.documentElement

    if (!shouldShow) {
      body.classList.remove('custom-cursor-active')
      root.classList.remove('custom-cursor-active')
      body.style.cursor = ''
      root.style.cursor = ''
      return
    }

    body.classList.add('custom-cursor-active')
    root.classList.add('custom-cursor-active')
    body.style.cursor = 'none'
    root.style.cursor = 'none'

    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY }
      if (!visible) setVisible(true)
    }

    const onDown  = () => setClicking(true)
    const onUp    = () => setClicking(false)
    const onLeave = () => setVisible(false)
    const onEnter = () => setVisible(true)

    document.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mousedown', onDown)
    document.addEventListener('mouseup', onUp)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)

    // Smooth cursor follow loop
    const loop = () => {
      actual.current.x += (pos.current.x - actual.current.x) * 0.12
      actual.current.y += (pos.current.y - actual.current.y) * 0.12

      if (cursorRef.current) {
        cursorRef.current.style.transform =
          `translate(${actual.current.x - 11}px, ${actual.current.y - 11}px)`
      }
      // Inner dot follows more tightly
      if (dotRef.current) {
        dotRef.current.style.transform =
          `translate(${pos.current.x - 3}px, ${pos.current.y - 3}px)`
      }
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('mouseup', onUp)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      body.classList.remove('custom-cursor-active')
      root.classList.remove('custom-cursor-active')
      body.style.cursor = ''
      root.style.cursor = ''
    }
  }, [shouldShow, visible])

  if (!shouldShow) return null

  return (
    <>
      {/* Main cursor icon */}
      <div
        ref={cursorRef}
        className={`${styles.cursor} ${clicking ? styles.clicking : ''} ${visible ? styles.visible : ''}`}
        aria-hidden="true"
        data-role={role}
      >
        <div className={`${styles.cursorInner} ${styles[`cursor--${role}`]}`}>
          {role === 'farmer' ? <FarmerCursorIcon /> : <BuyerCursorIcon />}
        </div>
      </div>

      {/* Precision dot */}
      <div
        ref={dotRef}
        className={`${styles.dot} ${visible ? styles.visible : ''}`}
        aria-hidden="true"
      />
    </>
  )
}
