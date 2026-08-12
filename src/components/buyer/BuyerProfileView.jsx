import { useState, useEffect } from 'react'
import {
  UserCheck,
  Building2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CheckCircle2,
  Edit3,
  FileText,
  Tag,
} from 'lucide-react'
import { getPersistedBuyerProfile } from '../../mock/mockBuyerProfileData'
import EditBuyerProfileModal from './EditBuyerProfileModal'
import styles from './BuyerProfileView.module.css'

/**
 * Functional Buyer Profile View Component
 */
export default function BuyerProfileView() {
  const [profile, setProfile]               = useState(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  useEffect(() => {
    setProfile(getPersistedBuyerProfile())
  }, [])

  const buyerData = profile || getPersistedBuyerProfile()

  return (
    <div className={styles.container}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Buyer Profile</h1>
          <p className={styles.subtitle}>Manage your procurement identity and organization details</p>
        </div>
        <button
          type="button"
          onClick={() => setIsEditModalOpen(true)}
          className={styles.editProfileBtn}
        >
          <Edit3 size={16} /> Edit Profile
        </button>
      </div>

      {/* Main Identity Card */}
      <div className={styles.profileCard}>
        {/* Top Header Row */}
        <div className={styles.cardHeader}>
          <div className={styles.avatarCircle}>
            {buyerData.buyerName ? buyerData.buyerName.charAt(0) : 'B'}
          </div>
          <div className={styles.identityInfo}>
            <div className={styles.nameRow}>
              <h2 className={styles.buyerName}>{buyerData.buyerName}</h2>
              <span className={styles.verifiedBadge}>
                <CheckCircle2 size={12} /> {buyerData.verificationStatus || 'Verified Buyer'}
              </span>
            </div>
            <span className={styles.buyerIdTag}>Buyer ID: {buyerData.buyerId}</span>
          </div>
        </div>

        {/* Specs Grid */}
        <div className={styles.specsGrid}>
          <div className={styles.specCard}>
            <Building2 size={18} className={styles.icon} />
            <div>
              <span className={styles.label}>Organization</span>
              <strong className={styles.val}>{buyerData.organizationName}</strong>
            </div>
          </div>

          <div className={styles.specCard}>
            <Tag size={18} className={styles.icon} />
            <div>
              <span className={styles.label}>Buyer Type</span>
              <strong className={styles.val}>{buyerData.buyerType}</strong>
            </div>
          </div>

          <div className={styles.specCard}>
            <UserCheck size={18} className={styles.icon} />
            <div>
              <span className={styles.label}>Contact Person</span>
              <strong className={styles.val}>{buyerData.contactPerson}</strong>
            </div>
          </div>

          <div className={styles.specCard}>
            <Phone size={18} className={styles.icon} />
            <div>
              <span className={styles.label}>Mobile Number</span>
              <strong className={styles.val}>{buyerData.mobile}</strong>
            </div>
          </div>

          <div className={styles.specCard}>
            <Mail size={18} className={styles.icon} />
            <div>
              <span className={styles.label}>Email Address</span>
              <strong className={styles.val}>{buyerData.email}</strong>
            </div>
          </div>

          <div className={styles.specCard}>
            <MapPin size={18} className={styles.icon} />
            <div>
              <span className={styles.label}>Business Location</span>
              <strong className={styles.val}>{buyerData.location}</strong>
            </div>
          </div>

          <div className={styles.specCard}>
            <Calendar size={18} className={styles.icon} />
            <div>
              <span className={styles.label}>Registration Date</span>
              <strong className={styles.val}>{buyerData.registrationDate}</strong>
            </div>
          </div>

          <div className={styles.specCard}>
            <FileText size={18} className={styles.icon} />
            <div>
              <span className={styles.label}>GST / Tax Number</span>
              <strong className={styles.val}>{buyerData.gstNumber}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditBuyerProfileModal
        isOpen={isEditModalOpen}
        profile={buyerData}
        onClose={() => setIsEditModalOpen(false)}
        onProfileUpdated={(updated) => setProfile(updated)}
      />
    </div>
  )
}
