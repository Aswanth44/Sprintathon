import { useEffect, useRef, useState } from 'react'
import styles from './CustomCursor.module.css'

/* ─── SVG cursor icons ──────────────────────────────────────────────────
   Small, clean vector shapes that match the brand.
   Farmer → leaf/sprout  |  Buyer → basket/cart
   ─────────────────────────────────────────────────────────────────────── */

function FarmerCursorIcon() {
  return (
    <svg
      viewBox="0 -960 960 960"
      width="22"
      height="22"
      fill="#e3e3e3"
      xmlns="http://www.w3.org/2000/svg"
      className={styles.cursorSvg}
      aria-hidden="true"
    >
      <path d="M216-176q-45-45-70.5-104T120-402q0-63 24-124.5T222-642q35-35 86.5-60t122-39.5Q501-756 591.5-759t202.5 7q8 106 5 195t-16.5 160.5q-13.5 71.5-38 125T684-182q-53 53-112.5 77.5T450-80q-65 0-127-25.5T216-176Zm112-16q29 17 59.5 24.5T450-160q46 0 91-18.5t86-59.5q18-18 36.5-50.5t32-85Q709-426 716-500.5t2-177.5q-49-2-110.5-1.5T485-670q-61 9-116 29t-90 55q-45 45-62 89t-17 85q0 59 22.5 103.5T262-246q42-80 111-153.5T534-520q-72 63-125.5 142.5T328-192Zm0 0Zm0 0Z" />
    </svg>
  )
}

function BuyerCursorIcon() {
  return (
    <svg
      viewBox="0 -960 960 960"
      width="22"
      height="22"
      fill="#e3e3e3"
      xmlns="http://www.w3.org/2000/svg"
      className={styles.cursorSvg}
      aria-hidden="true"
    >
      <path d="M200-80q-33 0-56.5-23.5T120-160v-480q0-33 23.5-56.5T200-720h80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720h80q33 0 56.5 23.5T840-640v480q0 33-23.5 56.5T760-80H200Zm0-80h560v-480H200v480Zm421.5-298.5Q680-517 680-600h-80q0 50-35 85t-85 35q-50 0-85-35t-35-85h-80q0 83 58.5 141.5T480-400q83 0 141.5-58.5ZM360-720h240q0-50-35-85t-85-35q-50 0-85 35t-35 85ZM200-160v-480 480Z" />
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
