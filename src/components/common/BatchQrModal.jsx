import { useEffect, useRef } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { X, Download, ShieldCheck, QrCode } from 'lucide-react'
import Logo from '../branding/Logo'
import styles from './BatchQrModal.module.css'

export default function BatchQrModal({ isOpen, batch, onClose }) {
  const qrRef = useRef(null)

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

  if (!isOpen || !batch) return null

  const batchId = batch.batchId || 'UZH-TOM-00128'
  const crop = batch.crop || 'Tomato'
  const qty = typeof batch.quantity === 'number' ? `${batch.quantity} ${batch.unit || 'kg'}` : batch.quantity || '500 kg'
  const grade = batch.quality || batch.grade || 'Grade A'

  const currentHost = window.location.origin || 'http://localhost:5174'
  const publicVerifyUrl = `${currentHost}/#/verify-batch/${batchId}`

  const handleDownload = () => {
    try {
      const svg = qrRef.current?.querySelector('svg')
      if (!svg) return
      const svgData = new XMLSerializer().serializeToString(svg)
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()

      img.onload = () => {
        canvas.width = img.width + 40
        canvas.height = img.height + 40
        if (ctx) {
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(0, 0, canvas.width, canvas.height)
          ctx.drawImage(img, 20, 20)
          const pngFile = canvas.toDataURL('image/png')
          const downloadLink = document.createElement('a')
          downloadLink.download = `UzhavarSetu_QR_${batchId}.png`
          downloadLink.href = `${pngFile}`
          downloadLink.click()
        }
      }

      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
    } catch (err) {
      console.error('Failed to download QR code:', err)
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className={styles.modalHeader}>
          <div className={styles.logoWrap}>
            <Logo height={26} isLight={false} />
          </div>
          <button onClick={onClose} className={styles.closeBtn} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className={styles.modalBody}>
          <div className={styles.qrCard}>
            <div className={styles.badgePill}>
              <ShieldCheck size={14} /> Verified Farm-to-Market Batch
            </div>

            <div className={styles.qrFrame} ref={qrRef}>
              <QRCodeSVG
                value={publicVerifyUrl}
                size={200}
                bgColor="#ffffff"
                fgColor="#1b4332"
                level="H"
                marginSize={2}
              />
            </div>

            <div className={styles.batchInfoBox}>
              <h3 className={styles.batchIdText}>{batchId}</h3>
              <p className={styles.cropSubText}>
                {crop} • {qty} • <strong>{grade}</strong>
              </p>
              <span className={styles.urlSubText}>
                <QrCode size={12} /> Scan or visit: {publicVerifyUrl}
              </span>
            </div>
          </div>
        </div>

        {/* Sticky Footer */}
        <div className={styles.btnRow}>
          <button type="button" onClick={onClose} className={styles.cancelBtn}>
            Close
          </button>
          <button type="button" onClick={handleDownload} className={styles.downloadBtn}>
            <Download size={16} /> Download QR
          </button>
        </div>
      </div>
    </div>
  )
}
