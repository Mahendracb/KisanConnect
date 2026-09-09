import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, MapPin, TrendingUp, TrendingDown, Minus, Sprout, Activity } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useLanguage } from "../LanguageContext";

function CropPrices() {
  const { t } = useLanguage();
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationSearchTerm, setLocationSearchTerm] = useState("");
  const [selectedCrop, setSelectedCrop] = useState(null);

  const uniqueDistricts = React.useMemo(() => {
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
  const highestPrice = selectedCrop?.price_history
    ? Math.max(...selectedCrop.price_history.map(h => parseFloat(h.price)))
    : 0;

  useEffect(() => {
    axios.get("http://localhost:5000/api/crops/")
      .then(response => {
        setCrops(response.data);
        if (response.data.length > 0) {
          setSelectedCrop(response.data[0]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching crop prices:", err);
        setError("Failed to load crop data. Please make sure the backend is running.");
        setLoading(false);
      });
  }, []);

  const filteredCrops = crops.filter(crop => {
    const matchesName = crop.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = crop.location.toLowerCase().includes(locationSearchTerm.toLowerCase());
    return matchesName && matchesLocation;
  });

  if (loading) return <div style={styles.center}>Loading market prices...</div>;
  if (error) return <div style={styles.error}>{error}</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>{t("Market Prices")}</h1>
      <p style={styles.subtitle}>{t("market_sub")}</p>
      
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

          <div style={styles.list}>
            {filteredCrops.map((crop) => {
              const isSelected = selectedCrop?.id === crop.id;
              return (
              <div 
                key={crop.id} 
                className="hover-3d-lift glass-panel" 
                style={{
                  ...styles.cropRow, 
                  borderColor: isSelected ? 'var(--accent-primary)' : 'var(--border-color)',
                  boxShadow: isSelected ? '0 0 0 1px var(--accent-primary), 0 4px 14px rgba(0,0,0,0.1)' : 'none'
                }}
                onClick={() => setSelectedCrop(crop)}
              >
                <div style={styles.cropIconBg}>
                  <Sprout size={24} color="var(--accent-primary)" />
                </div>
                <div style={styles.cropInfo}>
                  <h3 style={styles.cropName}>{crop.name}</h3>
                  <div style={styles.cropLocation}>
                    <MapPin size={14} style={{marginRight: '4px'}} />
                    {crop.location}
                  </div>
                  <div style={styles.cropDate}>
                    Updated {new Date(crop.updated_at).toLocaleDateString()}
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
            <div style={styles.insightHeader}>
              <Activity size={20} color="var(--accent-primary)" />
              <h3 style={styles.insightTitle}>{t("Market Insights")}</h3>
            </div>
            
            <p style={styles.insightSub}>{selectedCrop ? `${selectedCrop.name} - ${t("Highest Price Today")}` : t("Highest Price Today")}</p>
            <div style={styles.bestPriceBox}>
              <h2 style={styles.bestPriceText}>₹{highestPrice}</h2>
              <p style={styles.bestPriceLoc}>{selectedCrop ? selectedCrop.location : "Karnataka"}</p>
            </div>

            <p style={{ ...styles.insightSub, marginTop: '30px', marginBottom: '16px' }}>14 - Day Trend</p>
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
  layout: {
    display: "flex",
    gap: "32px",
    alignItems: "flex-start",
  },
  mainCol: {
    flex: 1,
  },
  sideCol: {
    width: "360px",
    position: "sticky",
    top: "24px",
  },
  filters: {
    display: "flex",
    gap: "16px",
    marginBottom: "24px",
  },
  inputGroup: {
    position: "relative",
    flex: 1,
  },
  inputIcon: {
    position: "absolute",
    left: "16px",
    top: "50%",
    transform: "translateY(-50%)",
  },
  input: {
    width: "100%",
    backgroundColor: "var(--bg-card)",
    border: "1px solid var(--border-color)",
    padding: "14px 16px 14px 48px",
    borderRadius: "12px",
    color: "var(--text-primary)",
    fontSize: "15px",
    outline: "none",
    transition: "border-color 0.2s",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  cropRow: {
    display: "flex",
    alignItems: "center",
    padding: "24px",
    borderRadius: "16px",
    cursor: "pointer",
  },
  cropIconBg: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    backgroundColor: "rgba(52, 211, 153, 0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "20px",
  },
  cropInfo: {
    flex: 1,
  },
  cropName: {
    margin: "0 0 6px 0",
    fontSize: "18px",
    color: "var(--text-primary)",
  },
  cropLocation: {
    display: "flex",
    alignItems: "center",
    color: "var(--text-secondary)",
    fontSize: "14px",
    marginBottom: "4px",
  },
  cropDate: {
    color: "var(--text-muted)",
    fontSize: "13px",
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
    fontSize: "18px",
    color: "var(--accent-primary)",
    fontWeight: "600",
    marginRight: "4px",
  },
  price: {
    fontSize: "24px",
    fontWeight: "700",
    color: "var(--accent-primary)",
  },
  unit: {
    fontSize: "13px",
    color: "var(--text-muted)",
    margin: "4px 0 8px 0",
  },
  trendUp: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    color: "var(--accent-primary)",
    fontSize: "14px",
    fontWeight: "500",
  },
  trendDown: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    color: "#ef4444",
    fontSize: "14px",
    fontWeight: "500",
  },
  trendStable: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    color: "var(--text-muted)",
    fontSize: "14px",
    fontWeight: "500",
  },
  insightCard: {
    padding: "24px",
    borderRadius: "16px",
  },
  insightHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "24px",
  },
  insightTitle: {
    margin: 0,
    fontSize: "18px",
    color: "var(--text-primary)",
  },
  insightSub: {
    color: "var(--text-secondary)",
    fontSize: "14px",
    marginBottom: "12px",
  },
  bestPriceBox: {
    backgroundColor: "rgba(52, 211, 153, 0.08)",
    border: "1px solid rgba(52, 211, 153, 0.2)",
    padding: "20px",
    borderRadius: "12px",
  },
  bestPriceText: {
    margin: "0 0 4px 0",
    fontSize: "32px",
    color: "var(--accent-primary)",
    fontWeight: "700",
  },
  bestPriceLoc: {
    margin: 0,
    fontSize: "14px",
    color: "var(--text-secondary)",
  },
  chartContainer: {
    height: "200px",
    width: "100%",
  }
};

export default CropPrices;
