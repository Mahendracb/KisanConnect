import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapPin, Star, Phone, ChevronDown } from "lucide-react";

function Buyers() {
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedCrop, setSelectedCrop] = useState("All Crops");
  const [locationSearch, setLocationSearch] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/api/buyers/")
      .then(response => {
        setBuyers(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching buyers:", err);
        setError("Failed to load buyers.");
        setLoading(false);
      });
  }, []);

  // Extract unique crops for the dropdown
  const uniqueCrops = ["All Crops", ...new Set(buyers.map(b => b.crop_interest || b.crop_interested).filter(Boolean))];

  // Filter buyers
  const filteredBuyers = buyers.filter(buyer => {
    const cropInterest = buyer.crop_interest || buyer.crop_interested || "";
    const matchCrop = selectedCrop === "All Crops" || cropInterest === selectedCrop;
    
    // Safely get location or fallback to company
    const location = buyer.location || buyer.company || "";
    const matchLocation = location.toLowerCase().includes(locationSearch.toLowerCase());
    
    return matchCrop && matchLocation;
  });

  if (loading) return <div style={styles.center}>Loading buyers...</div>;
  if (error) return <div style={styles.error}>{error}</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Verified Buyers</h1>
      <p style={styles.subtitle}>Connect directly with traders offering the best prices for your produce.</p>

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
            placeholder="Search by location..." 
            style={styles.searchInput}
            value={locationSearch}
            onChange={(e) => setLocationSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Buyers Grid */}
      <div style={styles.grid}>
        {filteredBuyers.map((buyer) => {
          // Generate a deterministic mock rating based on ID
          const rating = (4.0 + (buyer.id % 10) / 10).toFixed(1);
          
          return (
            <div key={buyer.id} className="hover-3d-lift glass-panel" style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.buyerName}>{buyer.name}</h3>
                <div style={styles.ratingBadge}>
                  <Star size={12} fill="#fbbf24" color="#fbbf24" />
                  {rating}
                </div>
              </div>
              
              <div style={styles.locationInfo}>
                <MapPin size={14} />
                {buyer.location || buyer.company || "Karnataka"}
              </div>

              <div style={styles.tradeInfo}>
                <p style={styles.tradeText}>Buying: <span style={styles.tradeHighlight}>{buyer.crop_interest || buyer.crop_interested}</span></p>
                <div style={styles.priceRow}>
                  <span style={styles.priceValue}>₹{buyer.price_offered || (Math.floor(Math.random() * 50 + 20) * 100)}</span>
                  <span style={styles.priceUnit}>/quintal</span>
                </div>
              </div>

              <button style={styles.callBtn}>
                <Phone size={16} /> {buyer.phone_number || buyer.contact || "+91 90000 00000"}
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
}

const styles = {
  container: {
    fontFamily: "var(--font-main)",
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
    margin: "0 0 8px 0",
    fontSize: "28px",
    fontWeight: "700",
  },
  subtitle: {
    color: "var(--text-muted)",
    margin: "0 0 32px 0",
    fontSize: "15px",
  },
  filterBar: {
    display: "flex",
    gap: "16px",
    marginBottom: "32px",
    backgroundColor: "rgba(21, 29, 24, 0.5)",
    padding: "16px",
    borderRadius: "16px",
    border: "1px solid var(--border-color)",
  },
  selectWrapper: {
    position: "relative",
    flex: 1,
  },
  select: {
    width: "100%",
    backgroundColor: "var(--bg-main)",
    border: "1px solid var(--border-color)",
    padding: "12px 16px",
    borderRadius: "8px",
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
    flex: 1,
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
    padding: "12px 16px 12px 40px",
    borderRadius: "8px",
    color: "var(--text-primary)",
    fontSize: "14px",
    outline: "none",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "24px",
  },
  card: {
    padding: "24px",
    borderRadius: "16px",
    display: "flex",
    flexDirection: "column",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "8px",
  },
  buyerName: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "600",
    color: "var(--text-primary)",
  },
  ratingBadge: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    backgroundColor: "rgba(251, 191, 36, 0.1)",
    color: "#fbbf24",
    padding: "4px 8px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "600",
  },
  locationInfo: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    color: "var(--text-secondary)",
    fontSize: "13px",
    marginBottom: "20px",
  },
  tradeInfo: {
    backgroundColor: "rgba(52, 211, 153, 0.05)",
    padding: "16px",
    borderRadius: "12px",
    marginBottom: "24px",
  },
  tradeText: {
    margin: "0 0 8px 0",
    color: "var(--text-secondary)",
    fontSize: "14px",
  },
  tradeHighlight: {
    color: "var(--text-primary)",
    fontWeight: "600",
  },
  priceRow: {
    display: "flex",
    alignItems: "baseline",
  },
  priceValue: {
    fontSize: "24px",
    fontWeight: "700",
    color: "var(--accent-primary)",
  },
  priceUnit: {
    fontSize: "14px",
    color: "var(--text-muted)",
    marginLeft: "4px",
  },
  callBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    width: "100%",
    padding: "14px",
    backgroundColor: "#cd853f", // A muted orange/brown matching the user's design for the call button
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontWeight: "600",
    fontSize: "15px",
    cursor: "pointer",
    transition: "transform 0.2s",
    marginTop: "auto",
  }
};

export default Buyers;
