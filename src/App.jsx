import { useState, useEffect } from 'react'
import LoginPage from './pages/Login'
import FarmerRegister from './pages/FarmerRegister'
import BuyerRegister from './pages/BuyerRegister'
import FarmerDashboard from './pages/FarmerDashboard'
import BuyerDashboard from './pages/BuyerDashboard'
import VerifyBatchPage from './pages/VerifyBatchPage'

/**
 * App Root View Controller
 * Supports hash navigation (#login, #farmer-register, #buyer-register, #farmer-dashboard, #buyer-dashboard, #buyer-marketplace, #buyer-offers, #verify-batch)
 */
export default function App() {
  const getInitialView = () => {
    const hash = window.location.hash.replace('#', '')
    if (hash.includes('verify-batch') || hash.includes('/batch/')) {
      return 'verify-batch'
    }
    if (['farmer-register', 'buyer-register', 'farmer-dashboard', 'buyer-dashboard'].includes(hash)) {
      return hash
    }
    if (hash.startsWith('buyer-') || hash === 'marketplace') {
      return 'buyer-dashboard'
    }
    if (hash.startsWith('/') || hash.includes('market-prices') || hash.includes('farmer-dashboard')) {
      return 'farmer-dashboard'
    }
    return 'login'
  }

  const [currentView, setCurrentView] = useState(getInitialView)

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '')
      if (hash.includes('verify-batch') || hash.includes('/batch/')) {
        setCurrentView('verify-batch')
      } else if (['farmer-register', 'buyer-register', 'farmer-dashboard', 'buyer-dashboard', 'login'].includes(hash)) {
        setCurrentView(hash)
      } else if (hash.startsWith('buyer-') || hash === 'marketplace') {
        setCurrentView('buyer-dashboard')
      } else if (hash.startsWith('/') || hash.includes('market-prices') || hash.includes('batches')) {
        setCurrentView('farmer-dashboard')
      } else if (!hash) {
        setCurrentView('login')
      }
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const navigateTo = (viewName) => {
    setCurrentView(viewName)
    window.location.hash = viewName === 'login' ? '' : `#${viewName}`
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  switch (currentView) {
    case 'verify-batch':
      return <VerifyBatchPage onNavigate={navigateTo} />
    case 'farmer-register':
      return <FarmerRegister onNavigate={navigateTo} />
    case 'buyer-register':
      return <BuyerRegister onNavigate={navigateTo} />
    case 'farmer-dashboard':
      return <FarmerDashboard onNavigate={navigateTo} />
    case 'buyer-dashboard':
      return <BuyerDashboard onNavigate={navigateTo} />
    case 'login':
    default:
      return <LoginPage onNavigate={navigateTo} />
  }
}
