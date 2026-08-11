import { ShoppingBag, LogOut, Clock, Store, ShieldAlert, Truck } from 'lucide-react'
import Logo from '../components/branding/Logo'
import styles from './Dashboard.module.css'

export default function BuyerDashboard({ onNavigate }) {
  return (
    <div className={styles.dashboardShell}>
      {/* Top Header Navigation */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Logo size="md" />
          <div className={styles.headerRight}>
            <span className={styles.pendingBadge}>
              <Clock size={15} /> Verification Pending
            </span>
            <button
              onClick={() => onNavigate('login')}
              className={styles.logoutBtn}
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Body */}
      <main className={styles.mainContent}>
        <div className={styles.welcomeCard}>
          <div className={styles.welcomeHeader}>
            <div>
              <h1 className={styles.title}>Buyer Dashboard</h1>
              <p className={styles.subtitle}>Direct Produce Sourcing Portal — Connecting Buyers & Farmers</p>
            </div>
            <div className={styles.pendingPill}>
              <ShieldAlert size={16} /> KYC Verification Underway
            </div>
          </div>

          <div className={styles.gridContainer}>
            <div className={styles.statCard}>
              <div className={styles.statIconWrap} style={{ background: 'rgba(212,160,23,0.1)', color: 'var(--color-gold)' }}>
                <Store size={24} />
              </div>
              <div>
                <div className={styles.statValue}>Verified Farmer Listings</div>
                <div className={styles.statDetail}>Browse Produce Catalogue</div>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIconWrap} style={{ background: 'rgba(45,106,79,0.1)', color: 'var(--color-green-mid)' }}>
                <Truck size={24} />
              </div>
              <div>
                <div className={styles.statValue}>Direct Procurement</div>
                <div className={styles.statDetail}>Logistics & Transport Ready</div>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIconWrap} style={{ background: 'rgba(30,45,64,0.1)', color: 'var(--color-navy)' }}>
                <ShoppingBag size={24} />
              </div>
              <div>
                <div className={styles.statValue}>Purchase Orders</div>
                <div className={styles.statDetail}>0 Active Orders</div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.placeholderNotice}>
          <p>
            🚀 <strong>Buyer Dashboard Module</strong> is ready for Task 3 development! Buyer account setup &amp; pending status indicator verified.
          </p>
        </div>
      </main>
    </div>
  )
}
