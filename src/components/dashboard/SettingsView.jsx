import { useState } from 'react'
import {
  Lock,
  Smartphone,
  Laptop,
  Bell,
  Globe,
  MapPin,
  Sprout,
  Scale,
  ShieldCheck,
  KeyRound,
  Eye,
  HelpCircle,
  AlertTriangle,
  FileText,
  Info,
  LogOut,
  CheckCircle2,
} from 'lucide-react'
import ChangePasswordModal from './ChangePasswordModal'
import styles from './SettingsView.module.css'

/**
 * FARMER SETTINGS VIEW COMPONENT
 * Manages account preferences, notification toggles, security controls, support & session actions.
 * "HOW THE FARMER USES THE APPLICATION"
 *
 * TODO: Replace demo persistence with backend API
 * Backend teammate will connect this to the Farmer Settings API.
 */
export default function SettingsView({ onLogout }) {
  // Notification Toggles
  const [buyerOfferAlerts, setBuyerOfferAlerts] = useState(true)
  const [marketPriceAlerts, setMarketPriceAlerts] = useState(true)
  const [pickupUpdates, setPickupUpdates] = useState(true)
  const [paymentNotifications, setPaymentNotifications] = useState(true)

  // Application Preferences
  const [language, setLanguage] = useState('English')
  const [location, setLocation] = useState('Coimbatore')
  const [defaultCrop, setDefaultCrop] = useState('Tomato')
  const [measurementUnit, setMeasurementUnit] = useState('kg')

  // Privacy & Security Controls
  const [twoFactorAuth, setTwoFactorAuth] = useState(true)
  const [dataSharing, setDataSharing] = useState(true)

  // Modals & Toasts
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 3000)
  }

  return (
    <div className={styles.container}>
      {/* Toast Banner */}
      {toastMessage && (
        <div className={styles.toastBanner}>
          <CheckCircle2 size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className={styles.pageHeader}>
        <h2 className={styles.title}>Application Settings</h2>
        <p className={styles.subtitle}>
          Configure your notifications, security credentials, support &amp; usage preferences
        </p>
      </div>

      {/* 2-Column Responsive Layout */}
      <div className={styles.gridTwoCol}>
        {/* 1. ACCOUNT CATEGORY */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.titleWrap}>
              <div className={`${styles.iconWrap} ${styles.iconAccount}`}>
                <Lock size={20} />
              </div>
              <div>
                <h3 className={styles.cardTitle}>Account Credentials</h3>
                <p className={styles.cardDesc}>Password &amp; authentication access</p>
              </div>
            </div>
          </div>

          <div className={styles.settingGroup}>
            {/* Change Password */}
            <div className={styles.settingRow}>
              <div className={styles.rowLeft}>
                <KeyRound size={18} className={styles.rowIcon} />
                <div>
                  <div className={styles.rowTitle}>Account Password</div>
                  <div className={styles.rowDesc}>Update your account password regularly</div>
                </div>
              </div>
              <button
                onClick={() => setIsPasswordModalOpen(true)}
                className={styles.actionBtn}
              >
                <Lock size={14} /> Change Password
              </button>
            </div>

            {/* Change Mobile Number */}
            <div className={styles.settingRow}>
              <div className={styles.rowLeft}>
                <Smartphone size={18} className={styles.rowIcon} />
                <div>
                  <div className={styles.rowTitle}>Registered Mobile Number</div>
                  <div className={styles.rowDesc}>+91 98765 43210 (OTP Verified)</div>
                </div>
              </div>
              <button
                onClick={() => showToast('Mobile number update request initiated via OTP')}
                className={styles.actionBtnSecondary}
              >
                Change Mobile
              </button>
            </div>

            {/* Manage Login Sessions */}
            <div className={styles.settingRow}>
              <div className={styles.rowLeft}>
                <Laptop size={18} className={styles.rowIcon} />
                <div>
                  <div className={styles.rowTitle}>Manage Login Sessions</div>
                  <div className={styles.rowDesc}>Current Device: Windows / Chrome — Active Now</div>
                </div>
              </div>
              <span className={styles.activeTag}>Current Session</span>
            </div>
          </div>
        </section>

        {/* 2. NOTIFICATIONS CATEGORY */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.titleWrap}>
              <div className={`${styles.iconWrap} ${styles.iconNotif}`}>
                <Bell size={20} />
              </div>
              <div>
                <h3 className={styles.cardTitle}>Notifications &amp; Alerts</h3>
                <p className={styles.cardDesc}>Manage real-time updates and push alerts</p>
              </div>
            </div>
          </div>

          <div className={styles.toggleList}>
            {/* Buyer Offer Alerts */}
            <div className={styles.toggleRow}>
              <div>
                <div className={styles.toggleTitle}>Buyer Offer Alerts</div>
                <div className={styles.toggleDesc}>Get notified immediately when buyers place new bids</div>
              </div>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={buyerOfferAlerts}
                  onChange={(e) => {
                    setBuyerOfferAlerts(e.target.checked)
                    showToast(`Buyer Offer Alerts ${e.target.checked ? 'Enabled' : 'Disabled'}`)
                  }}
                />
                <span className={styles.slider} />
              </label>
            </div>

            {/* Market Price Alerts */}
            <div className={styles.toggleRow}>
              <div>
                <div className={styles.toggleTitle}>Market Price Alerts</div>
                <div className={styles.toggleDesc}>Alert when mandi prices change by $\ge 5\%$</div>
              </div>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={marketPriceAlerts}
                  onChange={(e) => {
                    setMarketPriceAlerts(e.target.checked)
                    showToast(`Market Price Alerts ${e.target.checked ? 'Enabled' : 'Disabled'}`)
                  }}
                />
                <span className={styles.slider} />
              </label>
            </div>

            {/* Pickup & Transport Updates */}
            <div className={styles.toggleRow}>
              <div>
                <div className={styles.toggleTitle}>Pickup &amp; Transport Updates</div>
                <div className={styles.toggleDesc}>Logistics dispatch and produce pickup status notifications</div>
              </div>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={pickupUpdates}
                  onChange={(e) => {
                    setPickupUpdates(e.target.checked)
                    showToast(`Pickup & Transport Updates ${e.target.checked ? 'Enabled' : 'Disabled'}`)
                  }}
                />
                <span className={styles.slider} />
              </label>
            </div>

            {/* Payment Notifications */}
            <div className={styles.toggleRow}>
              <div>
                <div className={styles.toggleTitle}>Payment Notifications</div>
                <div className={styles.toggleDesc}>Direct bank transfer confirmation &amp; receipt alerts</div>
              </div>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={paymentNotifications}
                  onChange={(e) => {
                    setPaymentNotifications(e.target.checked)
                    showToast(`Payment Notifications ${e.target.checked ? 'Enabled' : 'Disabled'}`)
                  }}
                />
                <span className={styles.slider} />
              </label>
            </div>
          </div>
        </section>

        {/* 3. PREFERENCES CATEGORY */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.titleWrap}>
              <div className={`${styles.iconWrap} ${styles.iconPref}`}>
                <Globe size={20} />
              </div>
              <div>
                <h3 className={styles.cardTitle}>Application Preferences</h3>
                <p className={styles.cardDesc}>Language, location &amp; unit defaults</p>
              </div>
            </div>
          </div>

          <div className={styles.prefGrid}>
            {/* Language */}
            <div className={styles.prefItem}>
              <div className={styles.prefLabelWrap}>
                <Globe size={16} className={styles.prefIcon} />
                <span>Preferred Language</span>
              </div>
              <select
                value={language}
                onChange={(e) => {
                  setLanguage(e.target.value)
                  showToast(`Language set to ${e.target.value}`)
                }}
                className={styles.selectBox}
                aria-label="Select Language"
              >
                <option value="English">English</option>
                <option value="தமிழ்">தமிழ் (Tamil)</option>
              </select>
            </div>

            {/* Default Location */}
            <div className={styles.prefItem}>
              <div className={styles.prefLabelWrap}>
                <MapPin size={16} className={styles.prefIcon} />
                <span>Default Market Region</span>
              </div>
              <select
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value)
                  showToast(`Default location set to ${e.target.value}`)
                }}
                className={styles.selectBox}
                aria-label="Select Location"
              >
                <option value="Coimbatore">Coimbatore</option>
                <option value="Tiruppur">Tiruppur</option>
                <option value="Erode">Erode</option>
                <option value="Salem">Salem</option>
                <option value="Madurai">Madurai</option>
                <option value="Chennai">Chennai</option>
              </select>
            </div>

            {/* Default Crop */}
            <div className={styles.prefItem}>
              <div className={styles.prefLabelWrap}>
                <Sprout size={16} className={styles.prefIcon} />
                <span>Default Crop</span>
              </div>
              <select
                value={defaultCrop}
                onChange={(e) => {
                  setDefaultCrop(e.target.value)
                  showToast(`Default crop set to ${e.target.value}`)
                }}
                className={styles.selectBox}
                aria-label="Select Default Crop"
              >
                <option value="Tomato">Tomato</option>
                <option value="Onion">Onion</option>
                <option value="Potato">Potato</option>
                <option value="Rice">Rice</option>
                <option value="Banana">Banana</option>
                <option value="Coconut">Coconut</option>
              </select>
            </div>

            {/* Measurement Unit */}
            <div className={styles.prefItem}>
              <div className={styles.prefLabelWrap}>
                <Scale size={16} className={styles.prefIcon} />
                <span>Measurement Unit</span>
              </div>
              <select
                value={measurementUnit}
                onChange={(e) => {
                  setMeasurementUnit(e.target.value)
                  showToast(`Unit set to ${e.target.value}`)
                }}
                className={styles.selectBox}
                aria-label="Select Measurement Unit"
              >
                <option value="kg">Kilograms (kg)</option>
                <option value="quintal">Quintals (100 kg)</option>
                <option value="ton">Metric Tons (1000 kg)</option>
              </select>
            </div>
          </div>
        </section>

        {/* 4. PRIVACY & SECURITY CATEGORY */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.titleWrap}>
              <div className={`${styles.iconWrap} ${styles.iconSec}`}>
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3 className={styles.cardTitle}>Privacy &amp; Security</h3>
                <p className={styles.cardDesc}>Two-factor authentication &amp; data privacy</p>
              </div>
            </div>
          </div>

          <div className={styles.toggleList}>
            {/* Two-Factor Authentication */}
            <div className={styles.toggleRow}>
              <div>
                <div className={styles.toggleTitle}>Two-Factor Authentication (2FA)</div>
                <div className={styles.toggleDesc}>Require SMS OTP when logging in from new devices</div>
              </div>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={twoFactorAuth}
                  onChange={(e) => {
                    setTwoFactorAuth(e.target.checked)
                    showToast(`2FA ${e.target.checked ? 'Enabled' : 'Disabled'}`)
                  }}
                />
                <span className={styles.slider} />
              </label>
            </div>

            {/* Privacy Controls */}
            <div className={styles.toggleRow}>
              <div>
                <div className={styles.toggleTitle}>Verified Buyer Data Sharing</div>
                <div className={styles.toggleDesc}>Allow verified buyers to see batch location &amp; quantity</div>
              </div>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={dataSharing}
                  onChange={(e) => {
                    setDataSharing(e.target.checked)
                    showToast(`Data sharing preference updated`)
                  }}
                />
                <span className={styles.slider} />
              </label>
            </div>
          </div>
        </section>
      </div>

      {/* 5. SUPPORT CATEGORY */}
      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.titleWrap}>
            <div className={`${styles.iconWrap} ${styles.iconSupport}`}>
              <HelpCircle size={20} />
            </div>
            <div>
              <h3 className={styles.cardTitle}>Support &amp; Resources</h3>
              <p className={styles.cardDesc}>Help documentation, policy terms &amp; problem reporting</p>
            </div>
          </div>
        </div>

        <div className={styles.supportGrid}>
          <button
            onClick={() => showToast('Redirecting to Help & Support Center...')}
            className={styles.supportCard}
          >
            <HelpCircle size={18} className={styles.supportIcon} />
            <div>
              <div className={styles.supportTitle}>Help &amp; Support</div>
              <div className={styles.supportDesc}>FAQs and guidebooks</div>
            </div>
          </button>

          <button
            onClick={() => showToast('Opening Report a Problem dialog...')}
            className={styles.supportCard}
          >
            <AlertTriangle size={18} className={styles.supportIconWarn} />
            <div>
              <div className={styles.supportTitle}>Report a Problem</div>
              <div className={styles.supportDesc}>Contact technical team</div>
            </div>
          </button>

          <button
            onClick={() => showToast('Opening Terms of Service...')}
            className={styles.supportCard}
          >
            <FileText size={18} className={styles.supportIcon} />
            <div>
              <div className={styles.supportTitle}>Terms of Service</div>
              <div className={styles.supportDesc}>Usage rules &amp; contracts</div>
            </div>
          </button>

          <button
            onClick={() => showToast('Opening Privacy Policy...')}
            className={styles.supportCard}
          >
            <Eye size={18} className={styles.supportIcon} />
            <div>
              <div className={styles.supportTitle}>Privacy Policy</div>
              <div className={styles.supportDesc}>Data protection rules</div>
            </div>
          </button>

          <button
            onClick={() => showToast('UzhavarSetu v1.4.0 — Empowering Farmers Across Tamil Nadu')}
            className={styles.supportCard}
          >
            <Info size={18} className={styles.supportIconInfo} />
            <div>
              <div className={styles.supportTitle}>About UzhavarSetu</div>
              <div className={styles.supportDesc}>Version 1.4.0 (Build 2026)</div>
            </div>
          </button>
        </div>
      </section>

      {/* 6. ACCOUNT ACTIONS */}
      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.titleWrap}>
            <div className={`${styles.iconWrap} ${styles.iconDanger}`}>
              <LogOut size={20} />
            </div>
            <div>
              <h3 className={styles.cardTitle}>Account Actions</h3>
              <p className={styles.cardDesc}>Sign out or terminate current active session</p>
            </div>
          </div>
        </div>

        <div className={styles.actionBox}>
          <div>
            <div className={styles.signOutTitle}>Sign Out of UzhavarSetu</div>
            <div className={styles.signOutDesc}>Safely end your current session on this device.</div>
          </div>

          <button onClick={onLogout} className={styles.signOutBtn}>
            <LogOut size={16} /> Sign Out of UzhavarSetu
          </button>
        </div>
      </section>

      {/* Modals */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </div>
  )
}
