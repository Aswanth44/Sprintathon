import { useState } from 'react'
import {
  User,
  Sprout,
  Sliders,
  ShieldCheck,
  Lock,
  LogOut,
  Edit3,
  CheckCircle2,
  Globe,
  Bell,
  Laptop,
} from 'lucide-react'
import EditProfileModal from './EditProfileModal'
import EditFarmModal from './EditFarmModal'
import ChangePasswordModal from './ChangePasswordModal'
import styles from './SettingsView.module.css'

/**
 * Settings View Page Component
 * Renders full settings sections: Profile, Farm Details, Preferences, Security, and Account.
 *
 * @param {{ farmerProfile: any, onProfileUpdated: (p: any) => void, onLogout: () => void }} props
 */
export default function SettingsView({ farmerProfile, onProfileUpdated, onLogout }) {
  // Local Settings State
  const [profileData, setProfileData] = useState(farmerProfile || {
    name: 'Aswanth',
    phone: '+91 98765 43210',
    village: 'Coimbatore',
    district: 'Coimbatore',
    state: 'Tamil Nadu',
    status: 'Verified Farmer',
    farmSize: '5.5 acres',
    primaryCrop: 'Tomato, Onion, Coconut',
    location: 'Coimbatore, Tamil Nadu',
  })

  // Frontend Preferences (persisted in local state)
  const [language, setLanguage]               = useState('English')
  const [priceAlerts, setPriceAlerts]         = useState(true)
  const [offerNotifs, setOfferNotifs]         = useState(true)
  const [toastMessage, setToastMessage]       = useState('')

  // Modal Dialog States
  const [isProfileModalOpen, setIsProfileModalOpen]   = useState(false)
  const [isFarmModalOpen, setIsFarmModalOpen]         = useState(false)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 3000)
  }

  const handleProfileSave = (updated) => {
    setProfileData((prev) => ({ ...prev, ...updated }))
    if (onProfileUpdated) onProfileUpdated(updated)
    showToast('Profile updated successfully')
  }

  const handleFarmSave = (updated) => {
    setProfileData((prev) => ({ ...prev, ...updated }))
    if (onProfileUpdated) onProfileUpdated(updated)
    showToast('Farm details updated successfully')
  }

  return (
    <div className={styles.container}>
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className={styles.toastBanner}>
          <CheckCircle2 size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className={styles.pageHeader}>
        <h2 className={styles.title}>Settings</h2>
        <p className={styles.subtitle}>
          Manage your account, farm information and preferences
        </p>
      </div>

      {/* 2-Column Grid for Desktop / 1-Column on Mobile */}
      <div className={styles.twoColGrid}>
        {/* 1. Profile Information Card */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.titleWrap}>
              <div className={styles.iconWrap}>
                <User size={20} />
              </div>
              <div>
                <h3 className={styles.cardTitle}>Profile Information</h3>
                <p className={styles.cardDesc}>Personal details and contact info</p>
              </div>
            </div>
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className={styles.editBtn}
            >
              <Edit3 size={15} /> Edit Profile
            </button>
          </div>

          <div className={styles.profileBody}>
            <div className={styles.avatarRow}>
              <div className={styles.avatarCircle}>
                {profileData.name ? profileData.name[0] : 'A'}
              </div>
              <div>
                <h4 className={styles.nameText}>{profileData.name}</h4>
                <span className={styles.verifiedBadge}>
                  <CheckCircle2 size={13} /> {profileData.status || 'Verified Farmer'}
                </span>
              </div>
            </div>

            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Full Name</span>
                <span className={styles.infoValue}>{profileData.name}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Mobile Number</span>
                <span className={styles.infoValue}>{profileData.phone || '+91 98765 43210'}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Village / Town</span>
                <span className={styles.infoValue}>{profileData.village || 'Coimbatore'}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>District</span>
                <span className={styles.infoValue}>{profileData.district || 'Coimbatore'}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>State</span>
                <span className={styles.infoValue}>{profileData.state || 'Tamil Nadu'}</span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Farm Information Card */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.titleWrap}>
              <div className={`${styles.iconWrap} ${styles.iconFarm}`}>
                <Sprout size={20} />
              </div>
              <div>
                <h3 className={styles.cardTitle}>Farm Information</h3>
                <p className={styles.cardDesc}>Acreage, crops and location</p>
              </div>
            </div>
            <button
              onClick={() => setIsFarmModalOpen(true)}
              className={styles.editBtn}
            >
              <Edit3 size={15} /> Edit Farm Details
            </button>
          </div>

          <div className={styles.infoGrid} style={{ marginTop: 'var(--space-4)' }}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Farm Size</span>
              <span className={styles.infoValue}>{profileData.farmSize || '5.5 acres'}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Primary Crops</span>
              <span className={styles.infoValue}>{profileData.primaryCrop || 'Tomato, Onion, Coconut'}</span>
            </div>
            <div className={styles.infoItem} style={{ gridColumn: 'span 2' }}>
              <span className={styles.infoLabel}>Farm Location</span>
              <span className={styles.infoValue}>{profileData.location || 'Coimbatore, Tamil Nadu'}</span>
            </div>
          </div>
        </section>
      </div>

      {/* 3. Preferences Section (Frontend Only) */}
      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.titleWrap}>
            <div className={`${styles.iconWrap} ${styles.iconPref}`}>
              <Sliders size={20} />
            </div>
            <div>
              <h3 className={styles.cardTitle}>Preferences</h3>
              <p className={styles.cardDesc}>Language &amp; notification settings</p>
            </div>
          </div>
        </div>

        <div className={styles.prefList}>
          {/* Language Selector */}
          <div className={styles.prefRow}>
            <div className={styles.prefLeft}>
              <Globe size={18} className={styles.prefIcon} />
              <div>
                <span className={styles.prefTitle}>Language</span>
                <p className={styles.prefDesc}>Choose your preferred application language</p>
              </div>
            </div>
            <select
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value)
                showToast(`Language set to ${e.target.value}`)
              }}
              className={styles.langSelect}
              aria-label="Select Language"
            >
              <option value="English">English</option>
              <option value="தமிழ்">தமிழ் (Tamil)</option>
            </select>
          </div>

          {/* Price Alerts Toggle */}
          <div className={styles.prefRow}>
            <div className={styles.prefLeft}>
              <Bell size={18} className={styles.prefIcon} />
              <div>
                <span className={styles.prefTitle}>Price Alerts</span>
                <p className={styles.prefDesc}>Notify me when market prices change significantly.</p>
              </div>
            </div>
            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={priceAlerts}
                onChange={(e) => setPriceAlerts(e.target.checked)}
              />
              <span className={styles.slider} />
            </label>
          </div>

          {/* Buyer Offer Notifications Toggle */}
          <div className={styles.prefRow}>
            <div className={styles.prefLeft}>
              <Bell size={18} className={styles.prefIcon} />
              <div>
                <span className={styles.prefTitle}>Buyer Offer Notifications</span>
                <p className={styles.prefDesc}>Notify me when buyers make new offers.</p>
              </div>
            </div>
            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={offerNotifs}
                onChange={(e) => setOfferNotifs(e.target.checked)}
              />
              <span className={styles.slider} />
            </label>
          </div>
        </div>
      </section>

      {/* 4. Security Section */}
      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.titleWrap}>
            <div className={`${styles.iconWrap} ${styles.iconSec}`}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 className={styles.cardTitle}>Security</h3>
              <p className={styles.cardDesc}>Password &amp; active login sessions</p>
            </div>
          </div>
        </div>

        <div className={styles.securityGrid}>
          <div className={styles.securityItem}>
            <div>
              <span className={styles.secItemTitle}>Change Account Password</span>
              <p className={styles.secItemDesc}>Update your password regularly for security</p>
            </div>
            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className={styles.secBtn}
            >
              <Lock size={14} /> Change Password
            </button>
          </div>

          <div className={styles.securityItem}>
            <div className={styles.deviceWrap}>
              <Laptop size={18} className={styles.deviceIcon} />
              <div>
                <span className={styles.secItemTitle}>Active Login Sessions</span>
                <p className={styles.secItemDesc}>Current Device: Windows / Chrome — Active Now</p>
              </div>
            </div>
            <span className={styles.activeTag}>Current Device</span>
          </div>
        </div>
      </section>

      {/* 5. Account Section */}
      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.titleWrap}>
            <div className={`${styles.iconWrap} ${styles.iconAccount}`}>
              <User size={20} />
            </div>
            <div>
              <h3 className={styles.cardTitle}>Account</h3>
              <p className={styles.cardDesc}>Membership status &amp; session controls</p>
            </div>
          </div>
        </div>

        <div className={styles.accountRow}>
          <div className={styles.accountStatus}>
            <span className={styles.statusDotGreen} />
            <span>Verified Farmer Member (Since 2026)</span>
          </div>

          <button onClick={onLogout} className={styles.logoutBtn}>
            <LogOut size={16} /> Sign Out of UzhavarSetu
          </button>
        </div>
      </section>

      {/* Modals */}
      <EditProfileModal
        isOpen={isProfileModalOpen}
        profile={profileData}
        onClose={() => setIsProfileModalOpen(false)}
        onProfileUpdated={handleProfileSave}
      />

      <EditFarmModal
        isOpen={isFarmModalOpen}
        farm={profileData}
        onClose={() => setIsFarmModalOpen(false)}
        onFarmUpdated={handleFarmSave}
      />

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </div>
  )
}
