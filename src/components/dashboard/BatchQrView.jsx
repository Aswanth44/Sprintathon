import { QRCodeSVG } from 'qrcode.react'
import { QrCode, ArrowLeft, Printer, Eye } from 'lucide-react'
import styles from './BatchQrView.module.css'

/**
 * QR Code Generator & Traceability Display View Component
 *
 * @param {{
 *   batch: any,
 *   onNavigateView: (view: string, extraData?: any) => void
 * }} props
 */
export default function BatchQrView({ batch, onNavigateView }) {
  const batchData = batch || {
    batchId: 'UZH-TOM-00129',
    crop: 'Tomato',
    quantity: '500 kg',
    quality: 'Grade A',
  }

  // Public batch URL encoded in QR
  const currentHost = window.location.origin || 'http://localhost:5174'
  const publicUrl = `${currentHost}/#/batch/${batchData.batchId}`

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.brandHeader}>
          <span className={styles.brandName}>UZHAVARSETU</span>
          <span className={styles.brandSubtitle}>Batch QR Code</span>
        </div>

        <div className={styles.qrFrame}>
          <QRCodeSVG
            value={publicUrl}
            size={180}
            bgColor="#ffffff"
            fgColor="#1a4a2e"
            level="H"
            marginSize={2}
          />
        </div>

        <div className={styles.batchInfoBox}>
          <p className={styles.batchCode}>{batchData.batchId}</p>
          <p className={styles.cropText}>
            {batchData.crop} • {batchData.quantity} {batchData.unit || ''} ({batchData.quality})
          </p>
        </div>

        <p className={styles.scanText}>
          <QrCode size={16} /> Scan to view verified produce journey
        </p>

        <div className={styles.actionsRow}>
          <button onClick={handlePrint} className={styles.printBtn}>
            <Printer size={16} /> Print QR Tag
          </button>
          <button
            onClick={() => onNavigateView && onNavigateView('batch-details', { batchId: batchData.batchId })}
            className={styles.detailsBtn}
          >
            <Eye size={16} /> Batch Details
          </button>
        </div>

        <button
          onClick={() => onNavigateView && onNavigateView('batches')}
          className={styles.backLink}
        >
          <ArrowLeft size={16} /> Back to My Batches
        </button>
      </div>
    </div>
  )
}
