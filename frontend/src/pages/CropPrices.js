import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { 
  Search, 
  MapPin, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Sprout, 
  Activity, 
  RefreshCw, 
  PlusCircle, 
  Edit3, 
  Trash2, 
  X, 
  Save, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useLanguage } from "../LanguageContext";
import { useAuth } from "../AuthContext";

function CropPrices() {
  const { t, isKannada } = useLanguage();
  const { user } = useAuth();
  const isAdmin = user && user.role === 'admin';
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationSearchTerm, setLocationSearchTerm] = useState("");
  const [selectedCrop, setSelectedCrop] = useState(null);

  // Sync & Action states
  const [syncing, setSyncing] = useState(false);
  const [actionMsg, setActionMsg] = useState({ type: '', text: '' });

  // Modal states: 'add' | 'edit' | null
  const [modalMode, setModalMode] = useState(null);
  const [cropForm, setCropForm] = useState({
    name: "",
    current_price: 2500,
    location: "Mandya",
    trend: "stable",
    category: "Cash Crop",
    minPrice: 2000,
    maxPrice: 3000
  });
  const [savingCrop, setSavingCrop] = useState(false);

  const uniqueDistricts = useMemo(() => {
    const karnatakaDistricts = [
      "Bagalkot", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru Urban", 
      "Bidar", "Chamarajanagar", "Chikkaballapur", "Chikkamagaluru", "Chitradurga", 
      "Dakshina Kannada", "Davanagere", "Dharwad", "Gadag", "Hassan", "Haveri", 
      "Kalaburagi", "Kodagu", "Kolar", "Koppal", "Mandya", "Mysuru", "Raichur", 
      "Ramanagara", "Shivamogga", "Tumakuru", "Udupi", "Uttara Kannada", 
      "Vijayapura", "Yadgir"
    ];
    return karnatakaDistricts.sort();
  }, []);

  const fetchCrops = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/crops/");
      setCrops(response.data);
      if (response.data.length > 0) {
        if (!selectedCrop) {
          setSelectedCrop(response.data[0]);
        } else {
          const fresh = response.data.find(c => (c.id || c._id) === (selectedCrop.id || selectedCrop._id));
          if (fresh) setSelectedCrop(fresh);
        }
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching crop prices:", err);
      setError("Failed to load crop data. Please make sure the backend is running.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrops();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch single crop by ID when clicked (exercising GET /api/crops/:id)
  const handleSelectCrop = async (crop) => {
    const cropId = crop.id || crop._id;
    try {
      const res = await axios.get(`http://localhost:5000/api/crops/${cropId}`);
      setSelectedCrop(res.data);
    } catch (err) {
      console.warn("Could not fetch individual crop, using cached:", err);
      setSelectedCrop(crop);
    }
  };

  // Sync Mandi Prices (POST /api/crops/sync)
  const handleSyncPrices = async () => {
    setSyncing(true);
    setActionMsg({ type: '', text: '' });
    try {
      const res = await axios.post("http://localhost:5000/api/crops/sync");
      setActionMsg({
        type: 'success',
        text: isKannada
          ? `ಮಂಡಿ ದರಗಳು ಯಶಸ್ವಿಯಾಗಿ ನವೀಕರಣಗೊಂಡಿವೆ! (${res.data?.count || res.data?.message || 'Updated'})`
          : `Live APMC Mandi prices synced successfully! (${res.data?.count || res.data?.message || 'Updated'})`
      });
      fetchCrops();
    } catch (err) {
      setActionMsg({
        type: 'error',
        text: err.response?.data?.error || err.message || "Failed to sync Mandi prices."
      });
    } finally {
      setSyncing(false);
    }
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    setCropForm({
      name: "",
      current_price: 2500,
      location: "Mandya",
      trend: "stable",
      category: "Cash Crop",
      minPrice: 2000,
      maxPrice: 3000
    });
    setModalMode('add');
  };

  // Open Edit Modal
  const handleOpenEditModal = (crop) => {
    setCropForm({
      name: crop.name,
      current_price: crop.current_price,
      location: crop.location,
      trend: crop.trend || "stable",
      category: crop.category || "Cash Crop",
      minPrice: crop.price_range?.min || 1500,
      maxPrice: crop.price_range?.max || 4500
    });
    setModalMode('edit');
  };

  // Submit Add or Edit (POST /api/crops or PUT /api/crops/:id)
  const handleSaveCrop = async (e) => {
    e.preventDefault();
    setSavingCrop(true);
    setActionMsg({ type: '', text: '' });

    const payload = {
      name: cropForm.name.trim(),
      current_price: Number(cropForm.current_price),
      location: cropForm.location.trim(),
      trend: cropForm.trend,
      category: cropForm.category,
      price_range: {
        min: Number(cropForm.minPrice),
        max: Number(cropForm.maxPrice)
      }
    };

    try {
      if (modalMode === 'add') {
        const res = await axios.post("http://localhost:5000/api/crops", payload);
        setActionMsg({
          type: 'success',
          text: isKannada ? "ಹೊಸ ಬೆಳೆ ಯಶಸ್ವಿಯಾಗಿ ಸೇರಿಸಲಾಗಿದೆ!" : "New crop added successfully!"
        });
        setSelectedCrop(res.data);
      } else if (modalMode === 'edit' && selectedCrop) {
        const cropId = selectedCrop.id || selectedCrop._id;
        const res = await axios.put(`http://localhost:5000/api/crops/${cropId}`, payload);
        setActionMsg({
          type: 'success',
          text: isKannada ? "ಬೆಳೆ ವಿವರಗಳನ್ನು ಯಶಸ್ವಿಯಾಗಿ ನವೀಕರಿಸಲಾಗಿದೆ!" : "Crop updated successfully!"
        });
        setSelectedCrop(res.data);
      }
      setModalMode(null);
      fetchCrops();
    } catch (err) {
      alert("Error saving crop: " + (err.response?.data?.error || err.message));
    } finally {
      setSavingCrop(false);
    }
  };

  // Delete Crop (DELETE /api/crops/:id)
  const handleDeleteCrop = async (crop) => {
    const cropId = crop.id || crop._id;
    if (!window.confirm(isKannada ? `ನೀವು ನಿಜವಾಗಿಯೂ "${crop.name}" ಬೆಳೆಯನ್ನು ಅಳಿಸಲು ಬಯಸುವಿರಾ?` : `Are you sure you want to delete ${crop.name}?`)) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/crops/${cropId}`);
      setActionMsg({
        type: 'success',
        text: isKannada ? "ಬೆಳೆಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಅಳಿಸಲಾಗಿದೆ!" : "Crop deleted successfully!"
      });
      if (selectedCrop && (selectedCrop.id || selectedCrop._id) === cropId) {
        setSelectedCrop(null);
      }
      fetchCrops();
    } catch (err) {
      alert("Error deleting crop: " + (err.response?.data?.error || err.message));
    }
  };

  // Format history for the chart
  const chartData = selectedCrop?.price_history 
    ? [...selectedCrop.price_history].reverse().map(entry => {
        const dateObj = new Date(entry.date);
        return {
          name: `${dateObj.getDate()}/${dateObj.getMonth() + 1}`,
          price: parseFloat(entry.price)
        };
      })
    : [];
    
  // Find highest price in history for selected crop
  const highestPrice = selectedCrop?.price_history && selectedCrop.price_history.length > 0
    ? Math.max(...selectedCrop.price_history.map(h => parseFloat(h.price)))
    : (selectedCrop?.current_price || 0);

  const filteredCrops = crops.filter(crop => {
    const matchesName = crop.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = crop.location.toLowerCase().includes(locationSearchTerm.toLowerCase());
    return matchesName && matchesLocation;
  });

  if (loading) return <div style={styles.center}>Loading market prices...</div>;
  if (error) return <div style={styles.error}>{error}</div>;

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <div>
          <h1 style={styles.header}>{t("Market Prices")}</h1>
          <p style={styles.subtitle}>{t("market_sub")}</p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          {isAdmin ? (
            <>
              <button
                onClick={handleSyncPrices}
                disabled={syncing}
                style={styles.syncBtn}
                title={isKannada ? "ಲೈವ್ ಮಂಡಿ ದರಗಳನ್ನು ಸಿಂಕ್ ಮಾಡಿ" : "Sync Live Mandi Prices"}
              >
                <RefreshCw size={16} className={syncing ? "spin-icon" : ""} />
                <span>{syncing ? (isKannada ? "ಸಿಂಕ್ ಆಗುತ್ತಿದೆ..." : "Syncing Mandi...") : (isKannada ? "ಮಂಡಿ ದರ ಸಿಂಕ್" : "Sync Live Prices")}</span>
              </button>

              <button
                onClick={handleOpenAddModal}
                style={styles.addCropBtn}
              >
                <PlusCircle size={16} />
                <span>{isKannada ? "ಹೊಸ ಬೆಳೆ ಸೇರಿಸಿ" : "Add New Crop"}</span>
              </button>
            </>
          ) : (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(52, 211, 153, 0.12)',
              color: 'var(--accent-primary)',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: '700',
              border: '1px solid rgba(52, 211, 153, 0.3)'
            }}>
              <CheckCircle2 size={16} />
              <span>{isKannada ? "ಅಧಿಕೃತ ಎಪಿಎಂಸಿ ಮಂಡಿ ದರಗಳು" : "Official APMC Mandi Rates"}</span>
            </div>
          )}
        </div>
      </div>

      {actionMsg.text && (
        <div style={{
          ...styles.alertBanner,
          backgroundColor: actionMsg.type === 'success' ? 'rgba(52, 211, 153, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          borderColor: actionMsg.type === 'success' ? 'rgba(52, 211, 153, 0.4)' : 'rgba(239, 68, 68, 0.4)',
          color: actionMsg.type === 'success' ? 'var(--accent-primary)' : '#ef4444'
        }}>
          {actionMsg.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{actionMsg.text}</span>
        </div>
      )}
      
      <div style={styles.layout}>
        {/* Left Column - Crop List */}
        <div style={styles.mainCol}>
          
          <div style={styles.filters}>
            <div style={styles.inputGroup}>
              <Search size={18} color="var(--text-muted)" style={styles.inputIcon} />
              <input 
                type="text" 
                placeholder={t("Search crops...")} 
                style={styles.input}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div style={styles.inputGroup}>
              <MapPin size={18} color="var(--text-muted)" style={{ ...styles.inputIcon, zIndex: 1 }} />
              <select 
                style={{ ...styles.input, appearance: 'none', cursor: 'pointer' }}
                value={locationSearchTerm}
                onChange={(e) => setLocationSearchTerm(e.target.value)}
              >
                <option value="">{t("All Districts")}</option>
                {uniqueDistricts.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={styles.cropList}>
            {filteredCrops.map((crop) => {
              const cropId = crop.id || crop._id;
              const isSelected = selectedCrop && (selectedCrop.id || selectedCrop._id) === cropId;
              return (
              <div 
                key={cropId} 
                className={`glass-panel hover-3d-lift ${isSelected ? 'crop-card-active' : ''}`}
                style={{
                  ...styles.cropCard,
                  borderColor: isSelected ? 'var(--accent-primary)' : 'var(--border-color)',
                  backgroundColor: isSelected ? 'rgba(52, 211, 153, 0.05)' : 'var(--bg-card)'
                }}
                onClick={() => handleSelectCrop(crop)}
              >
                <div style={styles.cropInfo}>
                  <div style={styles.cropIconBg}>
                    <Sprout size={24} color="var(--accent-primary)" />
                  </div>
                  <div>
                    <h3 style={styles.cropName}>{crop.name}</h3>
                    <div style={styles.cropLocation}>
                      <MapPin size={14} style={{marginRight: '4px'}} />
                      {crop.location}
                    </div>
                  </div>
                </div>
                
                <div style={styles.priceInfo}>
                  <div style={styles.priceRow}>
                    <span style={styles.currency}>₹</span>
                    <span style={styles.price}>{crop.current_price}</span>
                  </div>
                  <div style={styles.unit}>per INR/quintal</div>
                  <div style={
                    crop.trend === 'up' ? styles.trendUp : 
                    crop.trend === 'down' ? styles.trendDown : 
                    styles.trendStable
                  }>
                    {crop.trend === 'up' ? <TrendingUp size={14}/> : 
                     crop.trend === 'down' ? <TrendingDown size={14}/> : 
                     <Minus size={14}/>}
                     <span style={{marginLeft: '4px'}}>
                        {crop.trend === 'up' ? '2.1%' : crop.trend === 'down' ? '0.6%' : '0.0%'}
                     </span>
                  </div>
                </div>
              </div>
            )})}
          </div>

        </div>

        {/* Right Column - Insights */}
        <div style={styles.sideCol}>
          <div className="glass-panel" style={styles.insightCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={styles.insightHeader}>
                <Activity size={20} color="var(--accent-primary)" />
                <h3 style={styles.insightTitle}>{t("Market Insights")}</h3>
              </div>
              {selectedCrop && isAdmin && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleOpenEditModal(selectedCrop)}
                    style={styles.actionIconBtn}
                    title={isKannada ? "ಬೆಳೆ ತಿದ್ದಿ" : "Edit Crop"}
                  >
                    <Edit3 size={15} color="var(--accent-primary)" />
                  </button>
                  <button
                    onClick={() => handleDeleteCrop(selectedCrop)}
                    style={{ ...styles.actionIconBtn, borderColor: 'rgba(239, 68, 68, 0.4)' }}
                    title={isKannada ? "ಬೆಳೆ ಅಳಿಸಿ" : "Delete Crop"}
                  >
                    <Trash2 size={15} color="#ef4444" />
                  </button>
                </div>
              )}
            </div>
            
            <p style={styles.insightSub}>{selectedCrop ? `${selectedCrop.name} - ${t("Highest Price Today")}` : t("Highest Price Today")}</p>
            <div style={styles.bestPriceBox}>
              <h2 style={styles.bestPriceText}>₹{highestPrice}</h2>
              <p style={styles.bestPriceLoc}>{selectedCrop ? `${selectedCrop.location} (${selectedCrop.category || 'Standard'})` : "Karnataka"}</p>
            </div>

            <p style={{ ...styles.insightSub, marginTop: '24px', marginBottom: '16px' }}>
              {selectedCrop ? `${selectedCrop.name} 14-Day Mandi Price Trend` : '14-Day Trend'}
            </p>
            <div style={styles.chartContainer}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis 
                    dataKey="name" 
                    stroke="var(--text-muted)" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                  />
                  <YAxis 
                    domain={['dataMin - 100', 'dataMax + 100']} 
                    stroke="var(--text-muted)" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    width={40}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                    itemStyle={{ color: 'var(--accent-primary)' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke="var(--accent-primary)" 
                    strokeWidth={3}
                    dot={{ r: 4, fill: "var(--bg-main)", stroke: "var(--accent-primary)", strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: "var(--accent-primary)" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Add / Edit Crop Modal */}
      {modalMode && (
        <div style={styles.modalOverlay}>
          <div className="glass-panel" style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                {modalMode === 'add' ? (isKannada ? "ಹೊಸ ಬೆಳೆ ನೋಂದಣಿ" : "Add New Crop Entry") : (isKannada ? "ಬೆಳೆ ವಿವರ ತಿದ್ದಿ" : "Edit Crop Details")}
              </h3>
              <button onClick={() => setModalMode(null)} style={styles.closeBtn}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveCrop} style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>{isKannada ? "ಬೆಳೆಯ ಹೆಸರು" : "Crop Name"} *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tomato, Paddy, Sugarcane"
                  value={cropForm.name}
                  onChange={(e) => setCropForm({ ...cropForm, name: e.target.value })}
                  style={styles.modalInput}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>{isKannada ? "ಪ್ರಸ್ತುತ ದರ (₹/ಕ್ವಿಂಟಾಲ್)" : "Current Price (₹/Qtl)"} *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={cropForm.current_price}
                  onChange={(e) => setCropForm({ ...cropForm, current_price: e.target.value })}
                  style={styles.modalInput}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>{isKannada ? "ಮಂಡಿ ಸ್ಥಳ / ಜಿಲ್ಲೆ" : "APMC Location / District"} *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mandya, Raichur APMC"
                  value={cropForm.location}
                  onChange={(e) => setCropForm({ ...cropForm, location: e.target.value })}
                  style={styles.modalInput}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>{isKannada ? "ದರ ಪ್ರವೃತ್ತಿ" : "Price Trend"}</label>
                <select
                  value={cropForm.trend}
                  onChange={(e) => setCropForm({ ...cropForm, trend: e.target.value })}
                  style={styles.modalInput}
                >
                  <option value="up">Rising (ಏರಿಕೆಯಲ್ಲಿದೆ) ↑</option>
                  <option value="stable">Stable (ಸ್ಥಿರವಾಗಿದೆ) →</option>
                  <option value="down">Falling (ಇಳಿಕೆಯಲ್ಲಿದೆ) ↓</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>{isKannada ? "ವರ್ಗ" : "Category"}</label>
                <select
                  value={cropForm.category}
                  onChange={(e) => setCropForm({ ...cropForm, category: e.target.value })}
                  style={styles.modalInput}
                >
                  <option value="Cash Crop">Cash Crop (ವಾಣಿಜ್ಯ ಬೆಳೆ)</option>
                  <option value="Food Grain">Food Grain (ಆಹಾರ ಧಾನ್ಯ)</option>
                  <option value="Horticulture">Horticulture (ತೋಟಗಾರಿಕೆ)</option>
                  <option value="Pulses">Pulses (ದ್ವಿದಳ ಧಾನ್ಯ)</option>
                  <option value="Oilseeds">Oilseeds (ಎಣ್ಣೆಕಾಳು)</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>{isKannada ? "ಕನಿಷ್ಠ - ಗರಿಷ್ಠ ದರ ಮಿತಿ (₹)" : "Price Range (Min - Max ₹)"}</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="number"
                    placeholder="Min"
                    value={cropForm.minPrice}
                    onChange={(e) => setCropForm({ ...cropForm, minPrice: e.target.value })}
                    style={{ ...styles.modalInput, flex: 1 }}
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={cropForm.maxPrice}
                    onChange={(e) => setCropForm({ ...cropForm, maxPrice: e.target.value })}
                    style={{ ...styles.modalInput, flex: 1 }}
                  />
                </div>
              </div>

              <div style={{ ...styles.modalActions, gridColumn: '1 / -1' }}>
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  style={styles.cancelBtn}
                >
                  {t("Cancel")}
                </button>
                <button
                  type="submit"
                  disabled={savingCrop}
                  style={styles.saveBtn}
                >
                  <Save size={16} />
                  <span>{savingCrop ? (isKannada ? "ಉಳಿಸಲಾಗುತ್ತಿದೆ..." : "Saving...") : (isKannada ? "ಉಳಿಸಿ" : "Save Crop")}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "var(--font-main)",
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px',
    flexWrap: 'wrap',
    gap: '16px'
  },
  syncBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'var(--bg-card)',
    color: 'var(--text-primary)',
    border: '1px solid var(--border-color)',
    padding: '10px 18px',
    borderRadius: '12px',
    fontWeight: '700',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  addCropBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'var(--accent-primary)',
    color: 'var(--text-on-primary)',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '12px',
    fontWeight: '700',
    fontSize: '13px',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(52, 211, 153, 0.3)',
  },
  actionIconBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '6px',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-main)',
    cursor: 'pointer',
  },
  alertBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 18px',
    borderRadius: '12px',
    border: '1px solid',
    marginBottom: '24px',
    fontSize: '14px',
    fontWeight: '600',
  },
  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "50vh",
    fontSize: "1.2rem",
    color: "var(--accent-primary)",
  },
  error: {
    color: "#ef4444",
    padding: "20px",
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    borderRadius: "8px",
  },
  header: {
    color: "var(--text-primary)",
    margin: "0 0 4px 0",
    fontSize: "28px",
    fontWeight: "800",
  },
  subtitle: {
    color: "var(--text-muted)",
    margin: 0,
    fontSize: "15px",
  },
  layout: {
    display: "flex",
    gap: "32px",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  mainCol: {
    flex: "1 1 500px",
  },
  sideCol: {
    flex: "0 1 380px",
    width: "100%",
  },
  filters: {
    display: "flex",
    gap: "16px",
    marginBottom: "24px",
    flexWrap: "wrap",
  },
  inputGroup: {
    position: "relative",
    flex: 1,
    minWidth: "180px",
  },
  inputIcon: {
    position: "absolute",
    left: "14px",
    top: "50%",
    transform: "translateY(-50%)",
  },
  input: {
    width: "100%",
    padding: "12px 16px 12px 42px",
    borderRadius: "12px",
    border: "1px solid var(--border-color)",
    backgroundColor: "var(--bg-card)",
    color: "var(--text-primary)",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  },
  cropList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  cropCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 20px",
    borderRadius: "16px",
    border: "1px solid var(--border-color)",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  cropInfo: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  cropIconBg: {
    width: "44px",
    height: "44px",
    borderRadius: "12px",
    backgroundColor: "rgba(52, 211, 153, 0.12)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cropName: {
    color: "var(--text-primary)",
    margin: "0 0 4px 0",
    fontSize: "16px",
    fontWeight: "700",
  },
  cropLocation: {
    color: "var(--text-muted)",
    fontSize: "13px",
    display: "flex",
    alignItems: "center",
  },
  priceInfo: {
    textAlign: "right",
  },
  priceRow: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "flex-end",
  },
  currency: {
    color: "var(--accent-primary)",
    fontSize: "14px",
    fontWeight: "700",
    marginRight: "2px",
  },
  price: {
    color: "var(--text-primary)",
    fontSize: "20px",
    fontWeight: "800",
  },
  unit: {
    color: "var(--text-muted)",
    fontSize: "11px",
    marginBottom: "4px",
  },
  trendUp: {
    display: "inline-flex",
    alignItems: "center",
    color: "var(--accent-primary)",
    fontSize: "12px",
    fontWeight: "600",
  },
  trendDown: {
    display: "inline-flex",
    alignItems: "center",
    color: "#ef4444",
    fontSize: "12px",
    fontWeight: "600",
  },
  trendStable: {
    display: "inline-flex",
    alignItems: "center",
    color: "var(--text-muted)",
    fontSize: "12px",
    fontWeight: "600",
  },
  insightCard: {
    padding: "24px",
    borderRadius: "20px",
    border: "1px solid var(--border-color)",
  },
  insightHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  insightTitle: {
    color: "var(--text-primary)",
    fontSize: "17px",
    fontWeight: "700",
    margin: 0,
  },
  insightSub: {
    color: "var(--text-secondary)",
    fontSize: "13px",
    fontWeight: "600",
    marginTop: "16px",
    marginBottom: "8px",
  },
  bestPriceBox: {
    backgroundColor: "rgba(52, 211, 153, 0.08)",
    padding: "16px",
    borderRadius: "14px",
    border: "1px solid rgba(52, 211, 153, 0.2)",
  },
  bestPriceText: {
    color: "var(--accent-primary)",
    margin: 0,
    fontSize: "28px",
    fontWeight: "800",
  },
  bestPriceLoc: {
    color: "var(--text-muted)",
    margin: "4px 0 0 0",
    fontSize: "12px",
  },
  chartContainer: {
    height: "200px",
    width: "100%",
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  modalContent: {
    width: '100%',
    maxWidth: '520px',
    borderRadius: '20px',
    padding: '28px',
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '14px',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: '4px',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '14px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--text-secondary)',
  },
  modalInput: {
    padding: '10px 14px',
    borderRadius: '10px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-main)',
    color: 'var(--text-primary)',
    fontSize: '14px',
    outline: 'none',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '14px',
    paddingTop: '16px',
    borderTop: '1px solid var(--border-color)',
  },
  cancelBtn: {
    padding: '10px 20px',
    borderRadius: '10px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'transparent',
    color: 'var(--text-primary)',
    fontWeight: '600',
    cursor: 'pointer',
  },
  saveBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 22px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: 'var(--accent-primary)',
    color: 'var(--text-on-primary)',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(52, 211, 153, 0.3)',
  }
};

export default CropPrices;
