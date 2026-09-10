import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  MapPin, 
  Star, 
  Phone, 
  ChevronDown, 
  PlusCircle, 
  Trash2, 
  X, 
  Save, 
  CheckCircle2, 
  AlertCircle,
  Building,
  Leaf
} from "lucide-react";
import { useLanguage } from "../LanguageContext";

function Buyers() {
  const { t, isKannada } = useLanguage();
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedCrop, setSelectedCrop] = useState("All Crops");
  const [locationSearch, setLocationSearch] = useState("");

  // Add Buyer Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [buyerForm, setBuyerForm] = useState({
    name: "",
    company: "",
    crop_interest: "Sugarcane",
    phone_number: "",
    location: "Mandya APMC Yard",
    rating: 4.8
  });
  const [savingBuyer, setSavingBuyer] = useState(false);
  const [actionMsg, setActionMsg] = useState({ type: '', text: '' });

  const fetchBuyers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/buyers/");
      setBuyers(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching buyers:", err);
      setError("Failed to load buyers.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuyers();
  }, []);

  // Handle Add Buyer (POST /api/buyers)
  const handleCreateBuyer = async (e) => {
    e.preventDefault();
    setSavingBuyer(true);
    setActionMsg({ type: '', text: '' });

    try {
      await axios.post("http://localhost:5000/api/buyers", buyerForm);
      setActionMsg({
        type: 'success',
        text: isKannada ? "ಖರೀದಿದಾರರನ್ನು ಯಶಸ್ವಿಯಾಗಿ ನೋಂದಾಯಿಸಲಾಗಿದೆ!" : "Verified buyer added successfully!"
      });
      setIsAddModalOpen(false);
      setBuyerForm({
        name: "",
        company: "",
        crop_interest: "Sugarcane",
        phone_number: "",
        location: "Mandya APMC Yard",
        rating: 4.8
      });
      fetchBuyers();
    } catch (err) {
      alert("Error creating buyer: " + (err.response?.data?.error || err.message));
    } finally {
      setSavingBuyer(false);
    }
  };

  // Handle Delete Buyer (DELETE /api/buyers/:id)
  const handleDeleteBuyer = async (buyer) => {
    const buyerId = buyer.id || buyer._id;
    if (!window.confirm(isKannada ? `ನೀವು ನಿಜವಾಗಿಯೂ "${buyer.name}" ಖರೀದಿದಾರರನ್ನು ಅಳಿಸಲು ಬಯಸುವಿರಾ?` : `Are you sure you want to delete ${buyer.name}?`)) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/buyers/${buyerId}`);
      setActionMsg({
        type: 'success',
        text: isKannada ? "ಖರೀದಿದಾರರನ್ನು ಅಳಿಸಲಾಗಿದೆ!" : "Buyer deleted successfully!"
      });
      fetchBuyers();
    } catch (err) {
      alert("Error deleting buyer: " + (err.response?.data?.error || err.message));
    }
  };

  // Extract unique crops for the dropdown
  const uniqueCrops = ["All Crops", ...new Set(buyers.map(b => b.crop_interest || b.crop_interested).filter(Boolean))];

  // Filter buyers
  const filteredBuyers = buyers.filter(buyer => {
    const cropInterest = buyer.crop_interest || buyer.crop_interested || "";
    const matchCrop = selectedCrop === "All Crops" || cropInterest.toLowerCase() === selectedCrop.toLowerCase();
    
    // Safely get location or fallback to company
    const location = buyer.location || buyer.company || "";
    const matchLocation = location.toLowerCase().includes(locationSearch.toLowerCase());
    
    return matchCrop && matchLocation;
  });

  if (loading) return <div style={styles.center}>Loading buyers...</div>;
  if (error) return <div style={styles.error}>{error}</div>;

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <div>
          <h1 style={styles.header}>{isKannada ? "ಪರಿಶೀಲಿಸಿದ ಖರೀದಿದಾರರು" : "Verified Buyers"}</h1>
          <p style={styles.subtitle}>
            {isKannada ? "ಉತ್ತಮ ಬೆಲೆ ನೀಡುವ ಅಧಿಕೃತ ಸಗಟು ವ್ಯಾಪಾರಿಗಳು ಮತ್ತು ಮಿಲ್ ಮಾಲೀಕರೊಂದಿಗೆ ನೇರವಾಗಿ ಸಂಪರ್ಕ ಸಾಧಿಸಿ." : "Connect directly with traders offering the best prices for your produce."}
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          style={styles.addBtn}
        >
          <PlusCircle size={16} />
          <span>{isKannada ? "ಖರೀದಿದಾರರನ್ನು ಸೇರಿಸಿ" : "Add Verified Buyer"}</span>
        </button>
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

      {/* Filters */}
      <div style={styles.filterBar}>
        <div style={styles.selectWrapper}>
          <select 
            style={styles.select}
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
          >
            {uniqueCrops.map(crop => (
              <option key={crop} value={crop}>{crop}</option>
            ))}
          </select>
          <ChevronDown size={16} color="var(--text-muted)" style={styles.selectIcon} />
        </div>

        <div style={styles.searchWrapper}>
          <MapPin size={16} color="var(--text-muted)" style={styles.searchIcon} />
          <input 
            type="text" 
            placeholder={isKannada ? "ಸ್ಥಳ ಅಥವಾ ಮಂಡಿ ಮೂಲಕ ಹುಡುಕಿ..." : "Search by location or mandi..."} 
            style={styles.searchInput}
            value={locationSearch}
            onChange={(e) => setLocationSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Buyers Grid */}
      <div style={styles.grid}>
        {filteredBuyers.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            {isKannada ? "ಯಾವುದೇ ಖರೀದಿದಾರರು ಕಂಡುಬಂದಿಲ್ಲ." : "No buyers matching your criteria."}
          </div>
        ) : (
          filteredBuyers.map((buyer) => {
            const buyerId = buyer.id || buyer._id;
            const rating = buyer.rating || (4.0 + (String(buyerId).charCodeAt(0) % 10) / 10).toFixed(1);
            
            return (
              <div key={buyerId} className="hover-3d-lift glass-panel" style={styles.card}>
                <div style={styles.cardHeader}>
                  <div>
                    <h3 style={styles.buyerName}>{buyer.name}</h3>
                    <div style={styles.companyName}>
                      <Building size={13} style={{ marginRight: 4 }} />
                      {buyer.company || "Independent Procurement Trader"}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={styles.ratingBadge}>
                      <Star size={12} fill="#fbbf24" color="#fbbf24" />
                      {rating}
                    </div>
                    <button
                      onClick={() => handleDeleteBuyer(buyer)}
                      style={styles.deleteBtn}
                      title={isKannada ? "ಖರೀದಿದಾರರನ್ನು ಅಳಿಸಿ" : "Delete Buyer"}
                    >
                      <Trash2 size={14} color="#ef4444" />
                    </button>
                  </div>
                </div>
                
                <div style={styles.locationInfo}>
                  <MapPin size={14} />
                  {buyer.location || "Karnataka APMC Yard"}
                </div>

                <div style={styles.tradeInfo}>
                  <p style={styles.tradeText}>
                    <Leaf size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                    {isKannada ? "ಖರೀದಿಸುವ ಬೆಳೆ: " : "Procuring: "}
                    <span style={styles.tradeHighlight}>{buyer.crop_interest || buyer.crop_interested || "Sugarcane"}</span>
                  </p>
                  <div style={styles.priceRow}>
                    <span style={styles.priceValue}>₹{buyer.price_offered || 3200}</span>
                    <span style={styles.priceUnit}>/quintal</span>
                  </div>
                </div>

                <a 
                  href={`tel:${buyer.phone_number || buyer.contact || "9845012345"}`}
                  style={styles.callBtn}
                >
                  <Phone size={16} /> 
                  <span>{buyer.phone_number || buyer.contact || "+91 98450 12345"}</span>
                </a>
              </div>
            );
          })
        )}
      </div>

      {/* Add Buyer Modal */}
      {isAddModalOpen && (
        <div style={styles.modalOverlay}>
          <div className="glass-panel" style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                {isKannada ? "ಹೊಸ ಪರಿಶೀಲಿಸಿದ ಖರೀದಿದಾರರ ನೋಂದಣಿ" : "Register Verified Buyer"}
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} style={styles.closeBtn}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateBuyer} style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>{isKannada ? "ಖರೀದಿದಾರರ ಹೆಸರು" : "Buyer Full Name"} *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={buyerForm.name}
                  onChange={(e) => setBuyerForm({ ...buyerForm, name: e.target.value })}
                  style={styles.modalInput}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>{isKannada ? "ಸಂಸ್ಥೆ / ಮಿಲ್ ಹೆಸರು" : "Company / Firm Name"} *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mysore Sugar & Agro Trading"
                  value={buyerForm.company}
                  onChange={(e) => setBuyerForm({ ...buyerForm, company: e.target.value })}
                  style={styles.modalInput}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>{isKannada ? "ಆಸಕ್ತಿಯ ಬೆಳೆ" : "Primary Crop Interest"} *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sugarcane, Paddy, Tomato, Ragi"
                  value={buyerForm.crop_interest}
                  onChange={(e) => setBuyerForm({ ...buyerForm, crop_interest: e.target.value })}
                  style={styles.modalInput}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>{isKannada ? "ದೂರವಾಣಿ ಸಂಖ್ಯೆ" : "Phone / Mobile Number"} *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98450 XXXXX"
                  value={buyerForm.phone_number}
                  onChange={(e) => setBuyerForm({ ...buyerForm, phone_number: e.target.value })}
                  style={styles.modalInput}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>{isKannada ? "ಮಂಡಿ / ಕಾರ್ಯಾಚರಣೆ ಸ್ಥಳ" : "Location / Mandi Yard"} *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mandya APMC Yard"
                  value={buyerForm.location}
                  onChange={(e) => setBuyerForm({ ...buyerForm, location: e.target.value })}
                  style={styles.modalInput}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>{isKannada ? "ರೇಟಿಂಗ್ (೧-೫)" : "Verified Rating (1-5)"}</label>
                <input
                  type="number"
                  step="0.1"
                  min="3.0"
                  max="5.0"
                  value={buyerForm.rating}
                  onChange={(e) => setBuyerForm({ ...buyerForm, rating: parseFloat(e.target.value) || 4.8 })}
                  style={styles.modalInput}
                />
              </div>

              <div style={{ ...styles.modalActions, gridColumn: '1 / -1' }}>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  style={styles.cancelBtn}
                >
                  {t("Cancel")}
                </button>
                <button
                  type="submit"
                  disabled={savingBuyer}
                  style={styles.saveBtn}
                >
                  <Save size={16} />
                  <span>{savingBuyer ? (isKannada ? "ಉಳಿಸಲಾಗುತ್ತಿದೆ..." : "Registering...") : (isKannada ? "ನೋಂದಾಯಿಸಿ" : "Register Buyer")}</span>
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
    gap: '16px',
  },
  header: {
    color: "var(--text-primary)",
    margin: "0 0 6px 0",
    fontSize: "28px",
    fontWeight: "800",
  },
  subtitle: {
    color: "var(--text-muted)",
    margin: 0,
    fontSize: "15px",
  },
  addBtn: {
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
  filterBar: {
    display: "flex",
    gap: "16px",
    marginBottom: "28px",
    backgroundColor: "var(--bg-card)",
    padding: "16px",
    borderRadius: "16px",
    border: "1px solid var(--border-color)",
    flexWrap: "wrap",
  },
  selectWrapper: {
    position: "relative",
    flex: "1 1 200px",
  },
  select: {
    width: "100%",
    backgroundColor: "var(--bg-main)",
    border: "1px solid var(--border-color)",
    padding: "12px 16px",
    borderRadius: "10px",
    color: "var(--text-primary)",
    fontSize: "14px",
    appearance: "none",
    outline: "none",
    cursor: "pointer",
  },
  selectIcon: {
    position: "absolute",
    right: "16px",
    top: "50%",
    transform: "translateY(-50%)",
    pointerEvents: "none",
  },
  searchWrapper: {
    position: "relative",
    flex: "2 1 280px",
  },
  searchIcon: {
    position: "absolute",
    left: "16px",
    top: "50%",
    transform: "translateY(-50%)",
  },
  searchInput: {
    width: "100%",
    backgroundColor: "var(--bg-main)",
    border: "1px solid var(--border-color)",
    padding: "12px 16px 12px 42px",
    borderRadius: "10px",
    color: "var(--text-primary)",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "24px",
  },
  card: {
    padding: "24px",
    borderRadius: "16px",
    border: "1px solid var(--border-color)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "12px",
  },
  buyerName: {
    color: "var(--text-primary)",
    margin: "0 0 2px 0",
    fontSize: "18px",
    fontWeight: "700",
  },
  companyName: {
    color: "var(--text-muted)",
    fontSize: "12px",
    display: "flex",
    alignItems: "center",
  },
  ratingBadge: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    backgroundColor: "rgba(251, 191, 36, 0.15)",
    color: "#d97706",
    padding: "4px 8px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "700",
  },
  deleteBtn: {
    background: 'none',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '6px',
    padding: '4px 6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationInfo: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    color: "var(--text-secondary)",
    fontSize: "13px",
    marginBottom: "16px",
  },
  tradeInfo: {
    backgroundColor: "rgba(52, 211, 153, 0.05)",
    padding: "14px",
    borderRadius: "12px",
    border: "1px dashed var(--border-color)",
    marginBottom: "16px",
  },
  tradeText: {
    margin: "0 0 8px 0",
    fontSize: "13px",
    color: "var(--text-muted)",
  },
  tradeHighlight: {
    color: "var(--text-primary)",
    fontWeight: "600",
  },
  priceRow: {
    display: "flex",
    alignItems: "baseline",
    gap: "4px",
  },
  priceValue: {
    color: "var(--accent-primary)",
    fontSize: "20px",
    fontWeight: "800",
  },
  priceUnit: {
    color: "var(--text-muted)",
    fontSize: "12px",
  },
  callBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    backgroundColor: "var(--accent-primary)",
    color: "var(--text-on-primary)",
    padding: "12px",
    borderRadius: "10px",
    fontWeight: "700",
    fontSize: "14px",
    textDecoration: "none",
    boxShadow: "0 4px 12px rgba(52, 211, 153, 0.25)",
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

export default Buyers;
