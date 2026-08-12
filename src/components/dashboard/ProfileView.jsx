import { useState } from 'react'
import {
  UserCheck,
  MapPin,
  Sprout,
  ShieldCheck,
  Activity,
  Edit3,
  Calendar,
  Phone,
  Mail,
  Award,
  CheckCircle2,
  Package,
  TrendingUp,
  Clock,
  Layers,
} from 'lucide-react'
import {
  INITIAL_FARMER_PROFILE,
  INITIAL_FARM_DETAILS,
  INITIAL_FARMER_VERIFICATION,
  INITIAL_FARMER_STATS,
  getPersistedProfile,
  savePersistedProfile,
  getPersistedFarmDetails,
  savePersistedFarmDetails,
} from '../../mock/mockFarmerData'
import EditProfileModal from './EditProfileModal'
import EditFarmModal from './EditFarmModal'
import styles from './ProfileView.module.css'

/**
 * FARMER PROFILE VIEW COMPONENT
 * Displays the farmer's identity, verified credentials, location, farm specs, and activity stats.
 * "WHO THE FARMER IS"
 *
 * TODO: Replace localStorage/demo persistence with backend API
 * Backend teammate will connect this to the Farmer Profile API.
 */
export default function ProfileView({ onProfileUpdated }) {
  const [profile, setProfile] = useState(() => getPersistedProfile())
  const [farmDetails, setFarmDetails] = useState(() => getPersistedFarmDetails())
  const [verification] = useState(INITIAL_FARMER_VERIFICATION)
  const [stats] = useState(INITIAL_FARMER_STATS)

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isFarmModalOpen, setIsFarmModalOpen] = useState(false)
  const [toastMsg, setToastMsg] = useState('')

  const safeProfile = profile || {}
  const safeFarm = farmDetails || {}
  const safeVerify = verification || {}
  const safeStats = stats || {}

  const primaryCropsList = Array.isArray(safeFarm.primaryCrops)
    ? safeFarm.primaryCrops
    : typeof safeFarm.primaryCrops === 'string'
    ? safeFarm.primaryCrops.split(',')
    : ['Tomato', 'Onion', 'Coconut']

  const otherCropsList = Array.isArray(safeFarm.otherCrops)
    ? safeFarm.otherCrops
    : typeof safeFarm.otherCrops === 'string'
    ? safeFarm.otherCrops.split(',')
    : ['Banana', 'Turmeric']

  const showToast = (msg) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 3000)
  }

  // Handle Edit Profile Save
  const handleProfileSave = (updated) => {
    const newProfile = { ...safeProfile, ...updated }
    setProfile(newProfile)
    savePersistedProfile(newProfile)
    if (onProfileUpdated) onProfileUpdated(newProfile)
    showToast('Profile information updated successfully')
  }

  // Handle Edit Farm Details Save
  const handleFarmSave = (updated) => {
    const newFarm = { ...safeFarm, ...updated }
    setFarmDetails(newFarm)
    savePersistedFarmDetails(newFarm)
    showToast('Farm details updated successfully')
  }

  const fullName = safeProfile.fullName || safeProfile.name || 'Aswanth Kumar'

  return (
    <div className={styles.container}>
      {/* Toast Notification */}
      {toastMsg && (
        <div className={styles.toastBanner}>
          <CheckCircle2 size={18} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Hero Profile Banner Header */}
      <div className={styles.heroCard}>
        <div className={styles.heroHeader}>
          <div className={styles.avatarWrap}>
            <div className={styles.avatarCircle}>
              {fullName ? fullName.charAt(0) : 'A'}
            </div>
            <span className={styles.heroStatusBadge}>
              <CheckCircle2 size={13} /> {safeProfile.status || 'Verified Farmer'}
            </span>
          </div>

          <div className={styles.heroInfo}>
            <div className={styles.heroTitleRow}>
              <h2 className={styles.heroName}>{fullName}</h2>
              <span className={styles.idTag}>
                <Award size={13} /> ID: {safeProfile.farmerId || 'UZH-FMR-000128'}
              </span>
            </div>

            <div className={styles.heroMetaRow}>
              <span className={styles.heroMetaItem}>
                <MapPin size={14} /> {safeProfile.village || 'Pollachi'}, {safeProfile.district || 'Coimbatore'}, {safeProfile.state || 'Tamil Nadu'}
              </span>
              <span className={styles.heroMetaItem}>
                <Calendar size={14} /> Registered: {safeProfile.registrationDate || '15 Jan 2025'}
              </span>
            </div>

            <div className={styles.heroContactRow}>
              <span className={styles.contactPill}>
                <Phone size={13} /> {safeProfile.mobile || '+91 98765 43210'}
              </span>
              <span className={styles.contactPill}>
                <Mail size={13} /> {safeProfile.email || 'aswanth.farmer@uzhavarsetu.in'}
              </span>
            </div>
          </div>

          <div className={styles.heroActionWrap}>
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className={styles.primaryEditBtn}
            >
              <Edit3 size={15} /> Edit Profile
            </button>
            <button
              onClick={() => setIsFarmModalOpen(true)}
              className={styles.secondaryEditBtn}
            >
              <Sprout size={15} /> Edit Farm Details
            </button>
          </div>
        </div>
      </div>

      {/* 2-Column Grid */}
      <div className={styles.gridTwoCol}>
        {/* SECTION 1: FARMER IDENTITY */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.headerTitleWrap}>
              <div className={`${styles.iconBox} ${styles.iconIdentity}`}>
                <UserCheck size={20} />
              </div>
              <div>
                <h3 className={styles.cardTitle}>Farmer Identity</h3>
                <p className={styles.cardSubtitle}>Official credentials and verified details</p>
              </div>
            </div>
          </div>

          <div className={styles.infoList}>
            <div className={styles.infoRow}>
              <span className={styles.label}>Full Name</span>
              <span className={styles.valBold}>{fullName}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Farmer ID</span>
              <span className={styles.valTag}>{safeProfile.farmerId || 'UZH-FMR-000128'}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Verification Status</span>
              <span className={styles.valVerified}>
                <CheckCircle2 size={14} /> Verified Member
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Mobile Number</span>
              <span className={styles.val}>{safeProfile.mobile || '+91 98765 43210'}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Email Address</span>
              <span className={styles.val}>{safeProfile.email || 'aswanth.farmer@uzhavarsetu.in'}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Registration Date</span>
              <span className={styles.val}>{safeProfile.registrationDate || '15 Jan 2025'}</span>
            </div>
          </div>
        </section>

        {/* SECTION 2: LOCATION */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.headerTitleWrap}>
              <div className={`${styles.iconBox} ${styles.iconLocation}`}>
                <MapPin size={20} />
              </div>
              <div>
                <h3 className={styles.cardTitle}>Location &amp; Region</h3>
                <p className={styles.cardSubtitle}>Registered farming district and town</p>
              </div>
            </div>
          </div>

          <div className={styles.infoList}>
            <div className={styles.infoRow}>
              <span className={styles.label}>Village / Town</span>
              <span className={styles.valBold}>{safeProfile.village || 'Pollachi'}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>District</span>
              <span className={styles.valBold}>{safeProfile.district || 'Coimbatore'}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>State</span>
              <span className={styles.val}>{safeProfile.state || 'Tamil Nadu'}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Farm Location</span>
              <span className={styles.val}>{safeFarm.farmLocation || `${safeProfile.village || 'Pollachi'}, ${safeProfile.district || 'Coimbatore'}`}</span>
            </div>
          </div>
        </section>

        {/* SECTION 3: FARM DETAILS */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.headerTitleWrap}>
              <div className={`${styles.iconBox} ${styles.iconFarm}`}>
                <Sprout size={20} />
              </div>
              <div>
                <h3 className={styles.cardTitle}>Farm Details</h3>
                <p className={styles.cardSubtitle}>Land acreage, crop portfolio &amp; experience</p>
              </div>
            </div>
            <button
              onClick={() => setIsFarmModalOpen(true)}
              className={styles.smallEditBtn}
            >
              <Edit3 size={14} /> Edit
            </button>
          </div>

          <div className={styles.infoList}>
            <div className={styles.infoRow}>
              <span className={styles.label}>Farm Size</span>
              <span className={styles.valHighlight}>{safeFarm.farmSize || '5.5 acres'}</span>
            </div>

            <div className={styles.infoRowColumn}>
              <span className={styles.label}>Primary Crops</span>
              <div className={styles.tagWrap}>
                {primaryCropsList.map((c, i) => (
                  <span key={i} className={styles.cropBadge}>
                    🌱 {typeof c === 'string' ? c.trim() : String(c)}
                  </span>
                ))}
              </div>
            </div>

            <div className={styles.infoRowColumn}>
              <span className={styles.label}>Other Crops</span>
              <div className={styles.tagWrap}>
                {otherCropsList.map((c, i) => (
                  <span key={i} className={styles.otherCropBadge}>
                    🌾 {typeof c === 'string' ? c.trim() : String(c)}
                  </span>
                ))}
              </div>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.label}>Farming Type</span>
              <span className={styles.val}>{safeFarm.farmingType || 'Organic & Drip Irrigated'}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Experience</span>
              <span className={styles.val}>{safeFarm.experienceYears || '12 Years'}</span>
            </div>
          </div>
        </section>

        {/* SECTION 4: VERIFICATION STATUS */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.headerTitleWrap}>
              <div className={`${styles.iconBox} ${styles.iconVerify}`}>
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3 className={styles.cardTitle}>Verification Status</h3>
                <p className={styles.cardSubtitle}>Government &amp; bank compliance checks</p>
              </div>
            </div>
          </div>

          <div className={styles.verifyGrid}>
            <div className={styles.verifyBox}>
              <div className={styles.verifyLeft}>
                <CheckCircle2 size={18} className={styles.verifyCheck} />
                <div>
                  <div className={styles.verifyTitle}>Identity Verification</div>
                  <div className={styles.verifyDesc}>Govt. ID Document Check</div>
                </div>
              </div>
              <span className={styles.verifiedPill}>✓ {safeVerify.identityVerification || 'Verified'}</span>
            </div>

            <div className={styles.verifyBox}>
              <div className={styles.verifyLeft}>
                <CheckCircle2 size={18} className={styles.verifyCheck} />
                <div>
                  <div className={styles.verifyTitle}>Mobile Verification</div>
                  <div className={styles.verifyDesc}>OTP &amp; SIM Authenticated</div>
                </div>
              </div>
              <span className={styles.verifiedPill}>✓ {safeVerify.mobileVerification || 'Verified'}</span>
            </div>

            <div className={styles.verifyBox}>
              <div className={styles.verifyLeft}>
                <CheckCircle2 size={18} className={styles.verifyCheck} />
                <div>
                  <div className={styles.verifyTitle}>Bank Account</div>
                  <div className={styles.verifyDesc}>Direct Payout Linkage</div>
                </div>
              </div>
              <span className={styles.verifiedPill}>✓ {safeVerify.bankAccount || 'Verified'}</span>
            </div>

            <div className={styles.verifyBox}>
              <div className={styles.verifyLeft}>
                <CheckCircle2 size={18} className={styles.verifyCheck} />
                <div>
                  <div className={styles.verifyTitle}>Farmer Registration</div>
                  <div className={styles.verifyDesc}>Agronomy Board Verified</div>
                </div>
              </div>
              <span className={styles.verifiedPill}>✓ {safeVerify.farmerRegistration || 'Verified'}</span>
            </div>
          </div>
        </section>
      </div>

      {/* SECTION 5: FARMER ACTIVITY */}
      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.headerTitleWrap}>
            <div className={`${styles.iconBox} ${styles.iconActivity}`}>
              <Activity size={20} />
            </div>
            <div>
              <h3 className={styles.cardTitle}>Farmer Activity &amp; Statistics</h3>
              <p className={styles.cardSubtitle}>Lifetime transaction performance on UzhavarSetu</p>
            </div>
          </div>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIconWrap}>
              <Layers size={20} />
            </div>
            <div>
              <div className={styles.statValue}>{stats.totalBatches}</div>
              <div className={styles.statLabel}>Total Batches Created</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={`${styles.statIconWrap} ${styles.statGreen}`}>
              <TrendingUp size={20} />
            </div>
            <div>
              <div className={styles.statValue}>{stats.produceSold}</div>
              <div className={styles.statLabel}>Produce Sold</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={`${styles.statIconWrap} ${styles.statGold}`}>
              <Package size={20} />
            </div>
            <div>
              <div className={styles.statValue}>{stats.activeBatches}</div>
              <div className={styles.statLabel}>Active Batches</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={`${styles.statIconWrap} ${styles.statBlue}`}>
              <Clock size={20} />
            </div>
            <div>
              <div className={styles.statValue}>{stats.completedTransactions}</div>
              <div className={styles.statLabel}>Completed Transactions</div>
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      <EditProfileModal
        isOpen={isProfileModalOpen}
        profile={{
          name: profile.fullName,
          mobile: profile.mobile,
          email: profile.email,
          village: profile.village,
          district: profile.district,
          state: profile.state,
        }}
        onClose={() => setIsProfileModalOpen(false)}
        onProfileUpdated={handleProfileSave}
      />

      <EditFarmModal
        isOpen={isFarmModalOpen}
        farm={{
          farmSize: farmDetails.farmSize,
          primaryCrops: Array.isArray(farmDetails.primaryCrops)
            ? farmDetails.primaryCrops.join(', ')
            : farmDetails.primaryCrops,
          otherCrops: Array.isArray(farmDetails.otherCrops)
            ? farmDetails.otherCrops.join(', ')
            : farmDetails.otherCrops,
          farmingType: farmDetails.farmingType,
          farmLocation: farmDetails.farmLocation,
          village: profile.village,
          district: profile.district,
        }}
        onClose={() => setIsFarmModalOpen(false)}
        onFarmUpdated={handleFarmSave}
      />
    </div>
  )
}
