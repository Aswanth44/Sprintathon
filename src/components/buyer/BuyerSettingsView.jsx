import { useState, useEffect } from 'react'
import {
  Settings,
  Bell,
  Building2,
  Lock,
  Globe,
  LogOut,
  CheckCircle2,
  Sliders,
  Edit3,
  AlertTriangle,
  RotateCcw,
  UserCheck,
  Phone,
  Mail,
  MapPin,
  FileText,
  X,
} from 'lucide-react'
import {
  getPersistedBuyerProfile,
  getPersistedBuyerSettings,
  savePersistedBuyerSettings,
  INITIAL_BUYER_SETTINGS,
} from '../../mock/mockBuyerProfileData'
import EditBusinessInfoModal from './EditBusinessInfoModal'
import EditProcurementPreferencesModal from './EditProcurementPreferencesModal'
import ChangeBuyerPasswordModal from './ChangeBuyerPasswordModal'
import styles from './BuyerSettingsView.module.css'

export default function BuyerSettingsView({ onLogout }) {
  const [profile, setProfile]   = useState(null)
  const [settings, setSettings] = useState(null)
  const [toastMsg, setToastMsg] = useState('')

  // Modals state
  const [isEditBusinessOpen, setIsEditBusinessOpen]   = useState(false)
  const [isEditPrefsOpen, setIsEditPrefsOpen]         = useState(false)
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)
  const [isResetConfirmOpen, setIsResetConfirmOpen]   = useState(false)

  const reloadData = () => {
    setProfile(getPersistedBuyerProfile())
    setSettings(getPersistedBuyerSettings())
  }

  useEffect(() => {
    reloadData()
  }, [])

  const buyerProfile = profile || getPersistedBuyerProfile()
  const buyerSettings = settings || getPersistedBuyerSettings()

  const preferences = buyerSettings.preferences || {
    preferredCrops: ['Tomato', 'Onion', 'Potato'],
    preferredGrade: 'Grade A',
    preferredLocation: 'Coimbatore',
    minPurchaseQty: '100',
    maxPurchaseQty: '5000',
  }

  const notifications = buyerSettings.notifications || {
    newFarmerOffers: true,
    offerStatusUpdates: true,
    counterOffers: true,
    purchaseUpdates: true,
    orderUpdates: true,
    deliveryUpdates: true,
    priceAlerts: true,
  }

  const handleNotificationToggle = (key) => {
    const updatedNotifications = {
      ...notifications,
      [key]: !notifications[key],
    }

    const updatedSettings = {
      ...buyerSettings,
      notifications: updatedNotifications,
    }

    savePersistedBuyerSettings(updatedSettings)
    setSettings(updatedSettings)
    showToast('Notification settings updated')
  }

  const handleLanguageChange = (newLang) => {
    const updatedSettings = {
      ...buyerSettings,
      account: {
        ...(buyerSettings.account || {}),
        language: newLang,
      },
    }

    savePersistedBuyerSettings(updatedSettings)
    setSettings(updatedSettings)
    showToast(`Platform language set to ${newLang}`)
  }

  const handleResetPreferences = () => {
    const defaultSettings = {
      ...INITIAL_BUYER_SETTINGS,
    }
    savePersistedBuyerSettings(defaultSettings)
    setSettings(defaultSettings)
    setIsResetConfirmOpen(false)
    showToast('All preferences reset to default values')
  }

  const showToast = (msg) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 3500)
  }

  return (
    <div className={styles.container}>
      {/* Toast Notification */}
      {toastMsg && (
        <div className={styles.toastPopup}>
          <CheckCircle2 size={18} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Buyer Settings</h1>
          <p className={styles.subtitle}>Manage procurement preferences and account settings</p>
        </div>
      </div>

      <div className={styles.settingsGrid}>
        {/* 1. PROFILE / BUSINESS INFORMATION */}
        <div className={styles.sectionCard}>
          <div className={styles.cardHeaderRow}>
            <div className={styles.cardTitleWrap}>
              <Building2 className={styles.headerIcon} size={20} />
              <h3 className={styles.sectionTitle}>Business &amp; Profile Information</h3>
            </div>
            <button
              type="button"
              onClick={() => setIsEditBusinessOpen(true)}
              className={styles.editBtn}
            >
              <Edit3 size={14} /> Edit Business Info
            </button>
          </div>

          <div className={styles.infoDisplayGrid}>
            <div className={styles.infoBox}>
              <span className={styles.infoLabel}>Organization / Company</span>
              <strong className={styles.infoVal}>{buyerProfile.organizationName}</strong>
            </div>
            <div className={styles.infoBox}>
              <span className={styles.infoLabel}>Contact Person</span>
              <strong className={styles.infoVal}>{buyerProfile.contactPerson}</strong>
            </div>
            <div className={styles.infoBox}>
              <span className={styles.infoLabel}>Mobile Number</span>
              <strong className={styles.infoVal}>{buyerProfile.mobile}</strong>
            </div>
            <div className={styles.infoBox}>
              <span className={styles.infoLabel}>Email Address</span>
              <strong className={styles.infoVal}>{buyerProfile.email}</strong>
            </div>
            <div className={styles.infoBox}>
              <span className={styles.infoLabel}>Business Category / Type</span>
              <strong className={styles.infoVal}>{buyerProfile.buyerType}</strong>
            </div>
            <div className={styles.infoBox}>
              <span className={styles.infoLabel}>Location</span>
              <strong className={styles.infoVal}>{buyerProfile.location}</strong>
            </div>
            <div className={styles.infoBox}>
              <span className={styles.infoLabel}>GST / Registration Number</span>
              <strong className={styles.infoVal}>{buyerProfile.gstNumber}</strong>
            </div>
          </div>
        </div>

        {/* 2. PROCUREMENT PREFERENCES */}
        <div className={styles.sectionCard}>
          <div className={styles.cardHeaderRow}>
            <div className={styles.cardTitleWrap}>
              <Sliders className={styles.headerIcon} size={20} />
              <h3 className={styles.sectionTitle}>Procurement Preferences</h3>
            </div>
            <button
              type="button"
              onClick={() => setIsEditPrefsOpen(true)}
              className={styles.editBtn}
            >
              <Edit3 size={14} /> Edit Preferences
            </button>
          </div>

          <div className={styles.prefsDisplayBox}>
            <div className={styles.prefRow}>
              <span className={styles.prefLabel}>Preferred Crops:</span>
              <div className={styles.chipsRow}>
                {(preferences.preferredCrops || ['Tomato', 'Onion', 'Potato']).map((crop) => (
                  <span key={crop} className={styles.chipTag}>{crop}</span>
                ))}
              </div>
            </div>

            <div className={styles.prefGrid}>
              <div>
                <span className={styles.prefLabel}>Preferred Quality Grade:</span>
                <strong className={styles.prefVal}>{preferences.preferredGrade || 'Grade A'}</strong>
              </div>
              <div>
                <span className={styles.prefLabel}>Preferred Sourcing Location:</span>
                <strong className={styles.prefVal}>{preferences.preferredLocation || 'Coimbatore'}</strong>
              </div>
              <div>
                <span className={styles.prefLabel}>Min Purchase Quantity:</span>
                <strong className={styles.prefVal}>{preferences.minPurchaseQty || '100'} kg</strong>
              </div>
              <div>
                <span className={styles.prefLabel}>Max Purchase Quantity:</span>
                <strong className={styles.prefVal}>{preferences.maxPurchaseQty || '5000'} kg</strong>
              </div>
            </div>
          </div>
        </div>

        {/* 3. NOTIFICATION SETTINGS */}
        <div className={styles.sectionCard}>
          <div className={styles.cardHeaderRow}>
            <div className={styles.cardTitleWrap}>
              <Bell className={styles.headerIcon} size={20} />
              <h3 className={styles.sectionTitle}>Notification Settings</h3>
            </div>
          </div>

          <div className={styles.toggleList}>
            <div className={styles.toggleRow}>
              <div>
                <strong className={styles.toggleTitle}>New Farmer Offers</strong>
                <p className={styles.toggleDesc}>Alerts when new farmer produce batches match your preferences</p>
              </div>
              <input
                type="checkbox"
                checked={Boolean(notifications.newFarmerOffers)}
                onChange={() => handleNotificationToggle('newFarmerOffers')}
                className={styles.toggleInput}
              />
            </div>

            <div className={styles.toggleRow}>
              <div>
                <strong className={styles.toggleTitle}>Offer Accepted / Rejected</strong>
                <p className={styles.toggleDesc}>Instant notification when a farmer accepts or rejects your purchase offer</p>
              </div>
              <input
                type="checkbox"
                checked={Boolean(notifications.offerStatusUpdates)}
                onChange={() => handleNotificationToggle('offerStatusUpdates')}
                className={styles.toggleInput}
              />
            </div>

            <div className={styles.toggleRow}>
              <div>
                <strong className={styles.toggleTitle}>Counter Offers</strong>
                <p className={styles.toggleDesc}>Notification when a farmer issues a counter price offer</p>
              </div>
              <input
                type="checkbox"
                checked={Boolean(notifications.counterOffers)}
                onChange={() => handleNotificationToggle('counterOffers')}
                className={styles.toggleInput}
              />
            </div>

            <div className={styles.toggleRow}>
              <div>
                <strong className={styles.toggleTitle}>Purchase Updates</strong>
                <p className={styles.toggleDesc}>Order confirmation and payment invoice alerts</p>
              </div>
              <input
                type="checkbox"
                checked={Boolean(notifications.purchaseUpdates)}
                onChange={() => handleNotificationToggle('purchaseUpdates')}
                className={styles.toggleInput}
              />
            </div>

            <div className={styles.toggleRow}>
              <div>
                <strong className={styles.toggleTitle}>Order Tracking Updates</strong>
                <p className={styles.toggleDesc}>Logistics milestone tracking updates (Pickup → Warehouse)</p>
              </div>
              <input
                type="checkbox"
                checked={Boolean(notifications.orderUpdates)}
                onChange={() => handleNotificationToggle('orderUpdates')}
                className={styles.toggleInput}
              />
            </div>

            <div className={styles.toggleRow}>
              <div>
                <strong className={styles.toggleTitle}>Delivery Updates</strong>
                <p className={styles.toggleDesc}>Alert when produce shipment arrives at retail hub</p>
              </div>
              <input
                type="checkbox"
                checked={Boolean(notifications.deliveryUpdates)}
                onChange={() => handleNotificationToggle('deliveryUpdates')}
                className={styles.toggleInput}
              />
            </div>

            <div className={styles.toggleRow}>
              <div>
                <strong className={styles.toggleTitle}>Market Price Alerts</strong>
                <p className={styles.toggleDesc}>Daily benchmark mandi price movement notifications</p>
              </div>
              <input
                type="checkbox"
                checked={Boolean(notifications.priceAlerts)}
                onChange={() => handleNotificationToggle('priceAlerts')}
                className={styles.toggleInput}
              />
            </div>
          </div>
        </div>

        {/* 4. ACCOUNT SETTINGS */}
        <div className={styles.sectionCard}>
          <div className={styles.cardHeaderRow}>
            <div className={styles.cardTitleWrap}>
              <Settings className={styles.headerIcon} size={20} />
              <h3 className={styles.sectionTitle}>Account &amp; Language</h3>
            </div>
          </div>

          <div className={styles.grid2}>
            <div className={styles.accountBox}>
              <label className={styles.infoLabel}>Platform Language</label>
              <div className={styles.selectWrap}>
                <Globe size={16} className={styles.selectIcon} />
                <select
                  value={buyerSettings.account?.language || 'English'}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className={styles.selectInput}
                  aria-label="Platform Language"
                >
                  <option value="English">English</option>
                  <option value="தமிழ்">தமிழ் (Tamil)</option>
                </select>
              </div>
            </div>

            <div className={styles.accountBox}>
              <label className={styles.infoLabel}>Password &amp; Security</label>
              <button
                type="button"
                onClick={() => setIsChangePasswordOpen(true)}
                className={styles.changePasswordBtn}
              >
                <Lock size={15} /> Change Password
              </button>
            </div>
          </div>
        </div>

        {/* 5. DANGER ZONE */}
        <div className={styles.dangerZoneCard}>
          <div className={styles.cardTitleWrap}>
            <AlertTriangle size={20} className={styles.dangerIcon} />
            <h3 className={styles.dangerTitle}>Danger Zone</h3>
          </div>

          <p className={styles.dangerDesc}>
            Actions here affect your account session and sourcing preferences.
          </p>

          <div className={styles.dangerActionsRow}>
            <button
              type="button"
              onClick={() => setIsResetConfirmOpen(true)}
              className={styles.resetBtn}
            >
              <RotateCcw size={15} /> Reset Preferences
            </button>

            <button
              type="button"
              onClick={onLogout}
              className={styles.signOutBtn}
            >
              <LogOut size={15} /> Sign Out of Account
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <EditBusinessInfoModal
        isOpen={isEditBusinessOpen}
        onClose={() => setIsEditBusinessOpen(false)}
        onSaved={() => {
          reloadData()
          showToast('Changes saved successfully!')
        }}
      />

      <EditProcurementPreferencesModal
        isOpen={isEditPrefsOpen}
        onClose={() => setIsEditPrefsOpen(false)}
        onSaved={() => {
          reloadData()
          showToast('Procurement preferences saved!')
        }}
      />

      <ChangeBuyerPasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
        onSuccess={(msg) => showToast(msg)}
      />

      {/* Reset Confirmation Modal */}
      {isResetConfirmOpen && (
        <div className={styles.overlay} onClick={() => setIsResetConfirmOpen(false)}>
          <div className={styles.resetModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.resetHeader}>
              <AlertTriangle size={22} className={styles.dangerIcon} />
              <h3>Reset Preferences?</h3>
              <button onClick={() => setIsResetConfirmOpen(false)} className={styles.closeBtn}><X size={18} /></button>
            </div>
            <div className={styles.resetBody}>
              <p>Are you sure you want to reset all procurement preferences and notification settings back to default values?</p>
            </div>
            <div className={styles.resetFooter}>
              <button onClick={() => setIsResetConfirmOpen(false)} className={styles.cancelBtn}>Cancel</button>
              <button onClick={handleResetPreferences} className={styles.resetConfirmBtn}>Reset All</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
