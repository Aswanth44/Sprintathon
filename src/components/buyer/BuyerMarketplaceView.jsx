import { useState, useEffect, useMemo } from 'react'
import {
  Search,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  MapPin,
  Tag,
  Eye,
  HandCoins,
  Sprout,
  ShieldCheck,
  Truck,
  RotateCcw,
} from 'lucide-react'
import { getBatches } from '../../api/batchApi'
import ViewBatchModal from './ViewBatchModal'
import MakeOfferModal from './MakeOfferModal'
import styles from './BuyerMarketplaceView.module.css'

/**
 * Buyer Marketplace Overview & Sourcing Page
 * Displays verified produce batches with search, multi-filter, sorting, batch view, and offer modal.
 */
export default function BuyerMarketplaceView({ onNavigateTab }) {
  const [batches, setBatches]           = useState([])
  const [loading, setLoading]           = useState(true)

  // Search & Filter state
  const [searchTerm, setSearchTerm]     = useState('')
  const [selectedCrop, setSelectedCrop] = useState('ALL')
  const [selectedGrade, setSelectedGrade] = useState('ALL')
  const [selectedLoc, setSelectedLoc]   = useState('ALL')
  const [selectedPrice, setSelectedPrice] = useState('ALL')
  const [selectedQty, setSelectedQty]     = useState('ALL')
  const [sortBy, setSortBy]             = useState('NEWEST')

  // Modals State
  const [viewBatch, setViewBatch]       = useState(null)
  const [offerBatch, setOfferBatch]     = useState(null)
  const [toastMsg, setToastMsg]         = useState('')

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const batchList = await getBatches()

        const enriched = (Array.isArray(batchList) ? batchList : []).map((b) => ({
          ...b,
          expectedPrice: b.expectedPrice || b.price || (b.crop === 'Tomato' ? 42 : b.crop === 'Onion' ? 35 : 28),
          location: b.location || b.farmLocation || (b.crop === 'Tomato' ? 'Pollachi, Coimbatore' : b.crop === 'Onion' ? 'Erode, TN' : 'Nilgiris, Ooty'),
          farmerName: b.farmerName || 'Aswanth Kumar',
          farmerId: b.farmerId || 'UZH-FMR-000128',
          verified: true,
        }))

        setBatches(enriched)
      } catch (err) {
        console.error('Failed to load marketplace batches:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleClearFilters = () => {
    setSearchTerm('')
    setSelectedCrop('ALL')
    setSelectedGrade('ALL')
    setSelectedLoc('ALL')
    setSelectedPrice('ALL')
    setSelectedQty('ALL')
    setSortBy('NEWEST')
  }

  // Filter & Search Logic
  const filteredBatches = useMemo(() => {
    return batches.filter((b) => {
      // Search term
      const query = searchTerm.toLowerCase().trim()
      if (query) {
        const matchCrop = b.crop?.toLowerCase().includes(query)
        const matchId = b.batchId?.toLowerCase().includes(query)
        const matchLoc = b.location?.toLowerCase().includes(query)
        if (!matchCrop && !matchId && !matchLoc) return false
      }

      // Crop filter
      if (selectedCrop !== 'ALL' && b.crop?.toLowerCase() !== selectedCrop.toLowerCase()) {
        return false
      }

      // Grade filter
      if (selectedGrade !== 'ALL' && !b.quality?.toLowerCase().includes(selectedGrade.toLowerCase())) {
        return false
      }

      // Location filter
      if (selectedLoc !== 'ALL' && !b.location?.toLowerCase().includes(selectedLoc.toLowerCase())) {
        return false
      }

      // Price filter
      if (selectedPrice === 'UNDER_30' && b.expectedPrice >= 30) return false
      if (selectedPrice === '30_40' && (b.expectedPrice < 30 || b.expectedPrice > 40)) return false
      if (selectedPrice === 'ABOVE_40' && b.expectedPrice <= 40) return false

      // Quantity filter
      const qty = Number(b.quantity) || 0
      if (selectedQty === 'UNDER_500' && qty >= 500) return false
      if (selectedQty === '500_1000' && (qty < 500 || qty > 1000)) return false
      if (selectedQty === 'ABOVE_1000' && qty <= 1000) return false

      return true
    }).sort((a, b) => {
      if (sortBy === 'PRICE_LOW') return a.expectedPrice - b.expectedPrice
      if (sortBy === 'PRICE_HIGH') return b.expectedPrice - a.expectedPrice
      if (sortBy === 'QUALITY') return a.quality.localeCompare(b.quality)
      // Default: NEWEST
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    })
  }, [batches, searchTerm, selectedCrop, selectedGrade, selectedLoc, selectedPrice, selectedQty, sortBy])

  const handleOfferSubmitted = () => {
    setToastMsg('Offer submitted! View updates in My Offers tab.')
    setTimeout(() => setToastMsg(''), 4000)
  }

  const isAnyFilterActive = Boolean(
    searchTerm ||
    selectedCrop !== 'ALL' ||
    selectedGrade !== 'ALL' ||
    selectedLoc !== 'ALL' ||
    selectedPrice !== 'ALL' ||
    selectedQty !== 'ALL'
  )

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
          <h1 className={styles.title}>Marketplace</h1>
          <p className={styles.subtitle}>Buy verified produce directly from farmers with transparent pricing</p>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className={styles.toolbarCard}>
        {/* Search Input */}
        <div className={styles.searchBarWrap}>
          <Search className={styles.searchIcon} size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search crops, batches or locations..."
            className={styles.searchInput}
            aria-label="Search crops, batches or locations"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className={styles.clearSearchBtn}>Clear</button>
          )}
        </div>

        {/* Filter Dropdowns Row */}
        <div className={styles.filterRow}>
          <div className={styles.filterGroup}>
            <Filter size={14} className={styles.filterIcon} />
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className={styles.selectFilter}
              aria-label="Filter by Crop"
            >
              <option value="ALL">All Crops</option>
              <option value="Tomato">Tomato</option>
              <option value="Onion">Onion</option>
              <option value="Potato">Potato</option>
              <option value="Rice">Rice</option>
              <option value="Coconut">Coconut</option>
              <option value="Banana">Banana</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className={styles.selectFilter}
              aria-label="Filter by Grade"
            >
              <option value="ALL">All Grades</option>
              <option value="Grade A">Grade A</option>
              <option value="Grade B">Grade B</option>
              <option value="Grade C">Grade C</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <select
              value={selectedLoc}
              onChange={(e) => setSelectedLoc(e.target.value)}
              className={styles.selectFilter}
              aria-label="Filter by Location"
            >
              <option value="ALL">All Locations</option>
              <option value="Pollachi">Pollachi</option>
              <option value="Coimbatore">Coimbatore</option>
              <option value="Erode">Erode</option>
              <option value="Nilgiris">Nilgiris / Ooty</option>
              <option value="Salem">Salem</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <select
              value={selectedPrice}
              onChange={(e) => setSelectedPrice(e.target.value)}
              className={styles.selectFilter}
              aria-label="Filter by Price"
            >
              <option value="ALL">All Prices</option>
              <option value="UNDER_30">Under ₹30/kg</option>
              <option value="30_40">₹30 - ₹40/kg</option>
              <option value="ABOVE_40">Above ₹40/kg</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <select
              value={selectedQty}
              onChange={(e) => setSelectedQty(e.target.value)}
              className={styles.selectFilter}
              aria-label="Filter by Quantity"
            >
              <option value="ALL">All Quantities</option>
              <option value="UNDER_500">Under 500 kg</option>
              <option value="500_1000">500 - 1000 kg</option>
              <option value="ABOVE_1000">Above 1000 kg</option>
            </select>
          </div>

          {isAnyFilterActive && (
            <button type="button" onClick={handleClearFilters} className={styles.clearFiltersBtn}>
              <RotateCcw size={12} /> Clear Filters
            </button>
          )}

          <div className={styles.filterGroup} style={{ marginLeft: 'auto' }}>
            <ArrowUpDown size={14} className={styles.filterIcon} />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={styles.selectFilter}
              aria-label="Sort produce batches"
            >
              <option value="NEWEST">Newest Batch</option>
              <option value="PRICE_LOW">Best Price (Low → High)</option>
              <option value="PRICE_HIGH">Highest Price</option>
              <option value="QUALITY">Highest Quality</option>
            </select>
          </div>
        </div>
      </div>

      {/* Produce Batches Grid */}
      {loading ? (
        <div className={styles.loadingState}>
          <Sprout size={32} className={styles.spinner} />
          <p>Loading verified marketplace listings...</p>
        </div>
      ) : filteredBatches.length === 0 ? (
        <div className={styles.emptyState}>
          <Sprout size={40} className={styles.emptyIcon} />
          <h3>No Produce Batches Found</h3>
          <p>Try clearing search filters or keywords.</p>
          <button onClick={handleClearFilters} className={styles.resetBtn}>
            Clear Filters
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredBatches.map((batch) => (
            <div key={batch.batchId} className={styles.card}>
              {/* Card Header */}
              <div className={styles.cardHeader}>
                <div>
                  <div className={styles.cropTitleWrap}>
                    <h3 className={styles.cropName}>{batch.crop}</h3>
                    <span className={styles.batchIdTag}>({batch.batchId})</span>
                  </div>
                  <div className={styles.locationSub}>
                    <MapPin size={13} /> {batch.location}
                  </div>
                </div>

                <div className={styles.verifiedBadge}>
                  <ShieldCheck size={14} /> Verified Batch
                </div>
              </div>

              {/* Supply Chain Stage Tag */}
              <div className={styles.stageTagRow}>
                <span className={styles.stageTag}>
                  <Truck size={12} /> Stage: <strong>{batch.currentStage || 'TRANSPORT'}</strong>
                </span>
              </div>

              {/* Specs Box */}
              <div className={styles.specsBox}>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Available Qty</span>
                  <span className={styles.specVal}>{batch.quantity} {batch.unit || 'kg'}</span>
                </div>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Quality Grade</span>
                  <span className={styles.specVal}>{batch.quality}</span>
                </div>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Harvest Date</span>
                  <span className={styles.specVal}>{batch.harvestDate || '10 Aug 2026'}</span>
                </div>
                <div className={styles.specItem}>
                  <span className={styles.specLabel}>Expected Price</span>
                  <span className={`${styles.specVal} ${styles.priceHighlight}`}>₹{batch.expectedPrice}/kg</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className={styles.cardActions}>
                <button
                  type="button"
                  onClick={() => setViewBatch(batch)}
                  className={styles.viewBtn}
                >
                  <Eye size={16} /> View Details
                </button>
                <button
                  type="button"
                  onClick={() => setOfferBatch(batch)}
                  className={styles.offerBtn}
                >
                  <HandCoins size={16} /> Make Offer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <ViewBatchModal
        isOpen={Boolean(viewBatch)}
        batch={viewBatch}
        onClose={() => setViewBatch(null)}
        onMakeOfferClick={(b) => setOfferBatch(b)}
      />

      <MakeOfferModal
        isOpen={Boolean(offerBatch)}
        batch={offerBatch}
        onClose={() => setOfferBatch(null)}
        onOfferSubmitted={handleOfferSubmitted}
      />
    </div>
  )
}
