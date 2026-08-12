import { useState, useEffect } from 'react'
import {
  TrendingUp,
  MapPin,
  RefreshCw,
  Info,
  Building2,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Calculator,
  HandCoins,
  Truck,
  Package,
} from 'lucide-react'
import marketPriceApi from '../../api/marketPriceApi'
import { CROPS, LOCATIONS } from '../../mock/mockMarketData'
import { calculateNetPayout, evaluateOffer } from '../../utils/fairPrice'
import TrendChart from './TrendChart'
import styles from './MarketPricesView.module.css'

export default function MarketPricesView() {
  const [selectedCrop, setSelectedCrop] = useState('Tomato')
  const [selectedLocation, setSelectedLocation] = useState('Coimbatore')
  
  const [marketData, setMarketData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState(null)

  // Interactive Fair Price Engine State
  const [calcMarketPrice, setCalcMarketPrice] = useState('42')
  const [calcBuyerOffer, setCalcBuyerOffer] = useState('44')
  const [calcTransportCost, setCalcTransportCost] = useState('2')

  const handleNumberInput = (rawVal, setter) => {
    if (rawVal === '') {
      setter('')
      return
    }
    // Remove leading zeros e.g. 032 -> 32
    let cleaned = rawVal.replace(/^0+(?=\d)/, '')
    const num = parseFloat(cleaned)
    if (isNaN(num) || num < 0) return
    setter(cleaned)
  }

  // Fetch market data when crop or location changes
  useEffect(() => {
    let isMounted = true

    async function loadData() {
      if (marketData) {
        setUpdating(true)
      } else {
        setLoading(true)
      }
      setError(null)

      try {
        const data = await marketPriceApi.getMarketPrices(selectedCrop, selectedLocation)
        if (isMounted) {
          setMarketData(data)
          setCalcMarketPrice(String(data.currentPrice))
          setCalcBuyerOffer(String(data.currentPrice + 2))
          setCalcTransportCost('2')
        }
      } catch (err) {
        if (isMounted) {
          setError('Unable to load market prices.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
          setUpdating(false)
        }
      }
    }

    loadData()
    return () => { isMounted = false }
  }, [selectedCrop, selectedLocation])

  const handleRetry = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await marketPriceApi.getMarketPrices(selectedCrop, selectedLocation)
      setMarketData(data)
      setCalcMarketPrice(String(data.currentPrice))
      setCalcBuyerOffer(String(data.currentPrice + 2))
    } catch (err) {
      setError('Unable to load market prices.')
    } finally {
      setLoading(false)
    }
  }

  // Fair Price Check Calculations
  const marketPriceNum = parseFloat(calcMarketPrice) || 0
  const buyerOfferNum = parseFloat(calcBuyerOffer) || 0
  const transportCostNum = parseFloat(calcTransportCost) || 0

  const calculatedNetPayout = calculateNetPayout(buyerOfferNum, transportCostNum)
  const offerAssessment = evaluateOffer(calculatedNetPayout, marketPriceNum)

  return (
    <div className={styles.container}>
      {/* 1. Page Header */}
      <header className={styles.header}>
        <div className={styles.headerTitleWrap}>
          <h1 className={styles.title}>Market Prices</h1>
          <p className={styles.subtitle}>Know the market before you sell</p>
        </div>

        {/* Status Indicator Banner */}
        <div className={styles.demoBanner}>
          <span className={styles.demoDot} aria-hidden="true" />
          <span className={styles.demoBadgeText}>● Demo Market Data</span>
          <span className={styles.demoNote}>Reference prices for evaluation</span>
        </div>
      </header>

      {/* 2. Crop & Location Selectors */}
      <section className={styles.selectorBar} aria-label="Crop and Location Selectors">
        <div className={styles.selectorGroup}>
          <label htmlFor="cropSelect" className={styles.selectLabel}>
            <Package size={16} className={styles.labelIcon} /> Select Crop:
          </label>
          <select
            id="cropSelect"
            className={styles.selectInput}
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
          >
            {CROPS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className={styles.selectorGroup}>
          <label htmlFor="locationSelect" className={styles.selectLabel}>
            <MapPin size={16} className={styles.labelIcon} /> Mandi / Location:
          </label>
          <select
            id="locationSelect"
            className={styles.selectInput}
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            {LOCATIONS.map((loc) => (
              <option key={loc.id} value={loc.name}>
                {loc.full}
              </option>
            ))}
          </select>
        </div>

        {updating && (
          <div className={styles.updatingBadge} role="status">
            <RefreshCw size={14} className={styles.spinner} />
            <span>Updating market data...</span>
          </div>
        )}
      </section>

      {/* ERROR STATE */}
      {error ? (
        <div className={styles.errorCard} role="alert">
          <AlertCircle size={32} className={styles.errorIcon} />
          <h3 className={styles.errorTitle}>{error}</h3>
          <p className={styles.errorText}>Please check your connection and try again.</p>
          <button onClick={handleRetry} className={styles.retryBtn}>
            <RefreshCw size={16} /> Try Again
          </button>
        </div>
      ) : loading ? (
        <div className={styles.loadingContainer} role="status">
          <RefreshCw size={36} className={styles.mainSpinner} />
          <p className={styles.loadingText}>Fetching market intelligence...</p>
        </div>
      ) : marketData && (
        <div className={styles.dashboardContent}>
          {/* CURRENT MARKET SNAPSHOT BANNER */}
          <div className={styles.snapshotBanner}>
            <div className={styles.snapshotItem}>
              <span className={styles.snapshotLabel}>Selected Produce</span>
              <span className={styles.snapshotVal}>{marketData.crop}</span>
            </div>
            <div className={styles.snapshotDivider} />
            <div className={styles.snapshotItem}>
              <span className={styles.snapshotLabel}>Market Location</span>
              <span className={styles.snapshotVal}>{marketData.location}</span>
            </div>
            <div className={styles.snapshotDivider} />
            <div className={styles.snapshotItem}>
              <span className={styles.snapshotLabel}>Current Price</span>
              <span className={styles.snapshotValHighlight}>₹{marketData.currentPrice}/{marketData.unit}</span>
            </div>
            <div className={styles.snapshotDivider} />
            <div className={styles.snapshotItem}>
              <span className={styles.snapshotLabel}>Last Updated</span>
              <span className={styles.snapshotVal}>Today ({marketData.updatedAt})</span>
            </div>
          </div>

          {/* 3 & 4. CURRENT PRICE & PRICE RANGE (Top Grid) */}
          <div className={styles.topCardsGrid}>
            {/* Current Price Card */}
            <div className={styles.card}>
              <div className={styles.cardHeaderRow}>
                <span className={styles.cardCategory}>CURRENT MARKET PRICE</span>
                <span className={styles.updateTag}>Updated Today</span>
              </div>
              <div className={styles.priceHeroWrap}>
                <div className={styles.priceDisplay}>
                  <span className={styles.currencySymbol}>₹</span>
                  <span className={styles.priceNum}>{marketData.currentPrice}</span>
                  <span className={styles.unitText}>/{marketData.unit}</span>
                </div>
                <div className={`${styles.changeBadge} ${marketData.changePercent >= 0 ? styles.changePos : styles.changeNeg}`}>
                  {marketData.changePercent >= 0 ? (
                    <ArrowUpRight size={16} />
                  ) : (
                    <ArrowDownRight size={16} />
                  )}
                  <span>{marketData.changePercent >= 0 ? `+${marketData.changePercent}%` : `${marketData.changePercent}%`} vs yesterday</span>
                </div>
              </div>
              <p className={styles.metaSubtext}>
                <MapPin size={13} /> {marketData.crop} • {marketData.location}
              </p>
            </div>

            {/* Price Range Card */}
            <div className={styles.card}>
              <div className={styles.cardHeaderRow}>
                <span className={styles.cardCategory}>MARKET PRICE RANGE</span>
                <span className={styles.rangeSub}>Today's Spread</span>
              </div>

              <div className={styles.rangeValuesGrid}>
                <div className={styles.rangeBox}>
                  <span className={styles.rangeBoxLabel}>Minimum</span>
                  <span className={styles.rangeBoxPrice}>₹{marketData.minimumPrice}/{marketData.unit}</span>
                </div>
                <div className={`${styles.rangeBox} ${styles.rangeBoxAvg}`}>
                  <span className={styles.rangeBoxLabel}>Average</span>
                  <span className={styles.rangeBoxPriceAvg}>₹{marketData.averagePrice}/{marketData.unit}</span>
                </div>
                <div className={styles.rangeBox}>
                  <span className={styles.rangeBoxLabel}>Maximum</span>
                  <span className={styles.rangeBoxPrice}>₹{marketData.maximumPrice}/{marketData.unit}</span>
                </div>
              </div>

              {/* Range Visual Bar */}
              <div className={styles.rangeBarTrack}>
                <div className={styles.rangeBarFill} />
                <div className={styles.rangeBarMarker} style={{ left: '50%' }} title="Average Price" />
              </div>
            </div>
          </div>

          {/* 5. 7-DAY PRICE TREND CHART */}
          <div className={styles.card}>
            <div className={styles.cardHeaderRow}>
              <div>
                <h3 className={styles.sectionHeading}>
                  <TrendingUp size={20} className={styles.headingIcon} /> 7-Day Market Price Trend
                </h3>
                <p className={styles.sectionSub}>Historical daily price movement in {marketData.locationName}</p>
              </div>
              <span className={styles.unitBadge}>₹/kg</span>
            </div>

            <div className={styles.chartContainer}>
              <TrendChart data={marketData.history} />
            </div>
          </div>

          {/* 6. MARKET BENCHMARK */}
          <div className={styles.card}>
            <div className={styles.cardHeaderRow}>
              <div>
                <h3 className={styles.sectionHeading}>
                  <Building2 size={20} className={styles.headingIcon} /> Market Benchmark
                </h3>
                <p className={styles.sectionSub}>Reference mandi vs local market benchmark comparison</p>
              </div>
              <span className={styles.demoTag}>Demo Reference</span>
            </div>

            <div className={styles.benchmarkGrid}>
              <div className={styles.benchmarkItem}>
                <span className={styles.bmLabel}>Government / Mandi Benchmark</span>
                <span className={styles.bmVal}>₹{marketData.benchmarks.mandiBenchmark}/kg</span>
                <span className={styles.bmSub}>District Mandi Benchmark</span>
              </div>
              <div className={styles.benchmarkItem}>
                <span className={styles.bmLabel}>Average Local Market Price</span>
                <span className={styles.bmVal}>₹{marketData.benchmarks.localMarketAvg}/kg</span>
                <span className={styles.bmSub}>Local Wholesale Average</span>
              </div>
              <div className={styles.benchmarkItem}>
                <span className={styles.bmLabel}>Current Buyer Average</span>
                <span className={styles.bmVal}>₹{marketData.benchmarks.buyerAvg}/kg</span>
                <span className={styles.bmSub}>Active Buyer Bids Avg</span>
              </div>
            </div>
          </div>

          {/* 7. FAIR PRICE ENGINE (CALCULATOR) */}
          <div className={`${styles.card} ${styles.engineCard}`}>
            <div className={styles.cardHeaderRow}>
              <div>
                <h3 className={styles.sectionHeading}>
                  <Calculator size={20} className={styles.headingIcon} /> Fair Price Check
                </h3>
                <p className={styles.sectionSub}>See whether a buyer offer gives you a reasonable payout after transport.</p>
              </div>
              <span className={styles.engineBadge}>Interactive Calculator</span>
            </div>

            <div className={styles.engineGrid}>
              {/* Left Column: Interactive Inputs */}
              <div className={styles.engineInputsCol}>
                <div className={styles.inputFieldGroup}>
                  <label htmlFor="calcMarketPrice" className={styles.inputFieldLabel}>
                    Market Price (₹/kg)
                  </label>
                  <div className={styles.inputWrapper}>
                    <span className={styles.inputPre}>₹</span>
                    <input
                      id="calcMarketPrice"
                      type="text"
                      inputMode="decimal"
                      className={styles.numInput}
                      value={calcMarketPrice}
                      onChange={(e) => handleNumberInput(e.target.value, setCalcMarketPrice)}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className={styles.inputFieldGroup}>
                  <label htmlFor="calcBuyerOffer" className={styles.inputFieldLabel}>
                    Buyer Offer (₹/kg)
                  </label>
                  <div className={styles.inputWrapper}>
                    <span className={styles.inputPre}>₹</span>
                    <input
                      id="calcBuyerOffer"
                      type="text"
                      inputMode="decimal"
                      className={styles.numInput}
                      value={calcBuyerOffer}
                      onChange={(e) => handleNumberInput(e.target.value, setCalcBuyerOffer)}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className={styles.inputFieldGroup}>
                  <label htmlFor="calcTransportCost" className={styles.inputFieldLabel}>
                    Transport Cost (₹/kg)
                  </label>
                  <div className={styles.inputWrapper}>
                    <span className={styles.inputPre}>₹</span>
                    <input
                      id="calcTransportCost"
                      type="text"
                      inputMode="decimal"
                      className={styles.numInput}
                      value={calcTransportCost}
                      onChange={(e) => handleNumberInput(e.target.value, setCalcTransportCost)}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Calculated Result & Assessment */}
              <div className={styles.engineResultCol}>
                <span className={styles.resultHeader}>CALCULATED NET PAYOUT</span>
                
                <div className={styles.formulaRow}>
                  <span>₹{calcBuyerOffer || '0'}</span>
                  <span className={styles.formulaOp}>-</span>
                  <span>₹{calcTransportCost || '0'}</span>
                  <span className={styles.formulaOp}>=</span>
                </div>

                <div className={styles.netPayoutDisplay}>
                  <span className={styles.netCurrency}>₹</span>
                  <span className={styles.netNum}>{calculatedNetPayout}</span>
                  <span className={styles.netUnit}>/kg</span>
                </div>

                <div className={styles.assessmentBox}>
                  <span className={styles.assessmentTitle}>Offer Assessment:</span>
                  <span className={`${styles.statusPill} ${
                    offerAssessment.code === 'GOOD' ? styles.badgeGood :
                    offerAssessment.code === 'FAIR' ? styles.badgeFair : styles.badgeBelow
                  }`}>
                    {offerAssessment.code === 'GOOD' && <CheckCircle2 size={14} />}
                    {offerAssessment.code === 'FAIR' && <CheckCircle2 size={14} />}
                    {offerAssessment.code === 'BELOW' && <AlertCircle size={14} />}
                    {offerAssessment.status}
                  </span>
                </div>
                <p className={styles.assessmentDesc}>{offerAssessment.description}</p>
              </div>
            </div>
          </div>

          {/* 8. BEST CURRENT OFFER HIGHLIGHT */}
          {marketData.bestOffer && (
            <div className={`${styles.card} ${styles.bestOfferCard}`}>
              <div className={styles.cardHeaderRow}>
                <span className={styles.bestOfferTag}>BEST CURRENT OFFER</span>
                <span className={styles.verifiedBuyerTag}>
                  <CheckCircle2 size={13} /> Verified Buyer
                </span>
              </div>

              <div className={styles.bestOfferContent}>
                <div className={styles.buyerMainInfo}>
                  <h4 className={styles.buyerName}>{marketData.bestOffer.buyerName}</h4>
                  <p className={styles.pickupLoc}>
                    <MapPin size={13} /> {marketData.bestOffer.pickupLocation} • {marketData.bestOffer.distance}
                  </p>
                </div>

                <div className={styles.bestOfferMetricsGrid}>
                  <div className={styles.metricBox}>
                    <span className={styles.metricLabel}>Buyer Offer</span>
                    <span className={styles.metricVal}>₹{marketData.bestOffer.offerPrice}/kg</span>
                  </div>
                  <div className={styles.metricBox}>
                    <span className={styles.metricLabel}>Transport Cost</span>
                    <span className={styles.metricValNeg}>- ₹{marketData.bestOffer.transportCost}/kg</span>
                  </div>
                  <div className={styles.metricBox}>
                    <span className={styles.metricLabel}>Net Farmer Payout</span>
                    <span className={styles.metricValHighlight}>₹{marketData.bestOffer.netPayout}/kg</span>
                  </div>
                </div>

                <div className={styles.bestOfferStatusCol}>
                  <span className={`${styles.statusPill} ${styles.badgeFair}`}>
                    <CheckCircle2 size={14} /> FAIR OFFER
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 9. BUYER OFFER COMPARISON */}
          <div className={styles.card}>
            <div className={styles.cardHeaderRow}>
              <div>
                <h3 className={styles.sectionHeading}>
                  <HandCoins size={20} className={styles.headingIcon} /> Buyer Offer Comparison
                </h3>
                <p className={styles.sectionSub}>Compare active buyer bids against current market prices</p>
              </div>
              <span className={styles.offerCountBadge}>{marketData.buyerOffers.length} Active Bids</span>
            </div>

            {/* Desktop Table View */}
            <div className={styles.tableResponsiveWrap}>
              <table className={styles.comparisonTable}>
                <thead>
                  <tr>
                    <th>Buyer Name</th>
                    <th>Offer Price</th>
                    <th>Transport Cost</th>
                    <th>Net Farmer Payout</th>
                    <th>Assessment</th>
                  </tr>
                </thead>
                <tbody>
                  {marketData.buyerOffers.map((offer) => {
                    const evalResult = evaluateOffer(offer.netPayout, marketData.currentPrice)
                    return (
                      <tr key={offer.id}>
                        <td>
                          <div className={styles.tableBuyerCell}>
                            <span className={styles.buyerCellName}>{offer.buyerName}</span>
                            <span className={styles.buyerCellSub}>{offer.pickupLocation}</span>
                          </div>
                        </td>
                        <td className={styles.tablePriceCell}>₹{offer.offerPrice}/kg</td>
                        <td className={styles.tableTransCell}>- ₹{offer.transportCost}/kg</td>
                        <td className={styles.tableNetCell}>
                          <strong>₹{offer.netPayout}/kg</strong>
                        </td>
                        <td>
                          <span className={`${styles.statusPill} ${
                            evalResult.code === 'GOOD' ? styles.badgeGood :
                            evalResult.code === 'FAIR' ? styles.badgeFair : styles.badgeBelow
                          }`}>
                            {evalResult.status}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Stacked Cards View */}
            <div className={styles.mobileOffersList}>
              {marketData.buyerOffers.map((offer) => {
                const evalResult = evaluateOffer(offer.netPayout, marketData.currentPrice)
                return (
                  <div key={offer.id} className={styles.mobileOfferCard}>
                    <div className={styles.mobileCardHeader}>
                      <span className={styles.mobileBuyerName}>{offer.buyerName}</span>
                      <span className={`${styles.statusPill} ${
                        evalResult.code === 'GOOD' ? styles.badgeGood :
                        evalResult.code === 'FAIR' ? styles.badgeFair : styles.badgeBelow
                      }`}>
                        {evalResult.status}
                      </span>
                    </div>

                    <div className={styles.mobileCardGrid}>
                      <div className={styles.mobileCardItem}>
                        <span className={styles.mobileLabel}>Offer</span>
                        <span className={styles.mobileVal}>₹{offer.offerPrice}/kg</span>
                      </div>
                      <div className={styles.mobileCardItem}>
                        <span className={styles.mobileLabel}>Transport</span>
                        <span className={styles.mobileValNeg}>- ₹{offer.transportCost}/kg</span>
                      </div>
                      <div className={styles.mobileCardItem}>
                        <span className={styles.mobileLabel}>Net Payout</span>
                        <span className={styles.mobileValHighlight}>₹{offer.netPayout}/kg</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
