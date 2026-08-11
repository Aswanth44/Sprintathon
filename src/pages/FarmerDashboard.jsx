import { Tractor, LogOut, CheckCircle2, Package, TrendingUp, MapPin } from 'lucide-react'
import Logo from '../components/branding/Logo'
import styles from './Dashboard.module.css'

export default function FarmerDashboard({ onNavigate }) {
  return (
    <div className={styles.dashboardShell}>
      {/* Top Header Navigation */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Logo size="md" />
          <div className={styles.headerRight}>
            <span className={styles.userBadge}>
              <Tractor size={16} /> Verified Farmer
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
              <h1 className={styles.title}>Farmer Dashboard</h1>
              <p className={styles.subtitle}>Welcome to your UzhavarSetu portal — From Farm to Fair Market</p>
            </div>
            <div className={styles.statusPill}>
              <CheckCircle2 size={16} /> Profile Active
            </div>
          </div>

          <div className={styles.gridContainer}>
            <div className={styles.statCard}>
              <div className={styles.statIconWrap} style={{ background: 'rgba(45,106,79,0.1)', color: 'var(--color-green-mid)' }}>
                <Package size={24} />
              </div>
              <div>
                <div className={styles.statValue}>Active Crop Listings</div>
                <div className={styles.statDetail}>0 Crops Listed</div>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIconWrap} style={{ background: 'rgba(212,160,23,0.1)', color: 'var(--color-gold)' }}>
                <TrendingUp size={24} />
              </div>
              <div>
                <div className={styles.statValue}>Market Mandi Prices</div>
                <div className={styles.statDetail}>Live Updates Ready</div>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIconWrap} style={{ background: 'rgba(30,45,64,0.1)', color: 'var(--color-navy)' }}>
                <MapPin size={24} />
              </div>
              <div>
                <div className={styles.statValue}>Nearby Collection Hubs</div>
                <div className={styles.statDetail}>Tamil Nadu Hubs Available</div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.placeholderNotice}>
          <p>
            🚀 <strong>Farmer Dashboard Module</strong> is ready for Task 3 development! Registration and account setup flow verified successfully.
          </p>
        </div>
      </main>
    </div>
  )
}
