import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FileText, Sprout, Users, TrendingUp, ChevronRight, CheckCircle2, Tractor, Sun, Cloud, Leaf, CloudSun, Store } from "lucide-react";
import { useLanguage } from "../LanguageContext";
import axios from "axios";

function Dashboard() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [stats, setStats] = useState({ crops: 0, buyers: 0, schemes: 0 });
  const [topCrops, setTopCrops] = useState([]);
  const [featuredSchemes, setFeaturedSchemes] = useState([]);

  useEffect(() => {
    // Fetch real data to populate the dashboard!
    const fetchData = async () => {
      try {
        const [cropsRes, buyersRes, schemesRes] = await Promise.all([
          axios.get("http://localhost:5000/api/crops/"),
          axios.get("http://localhost:5000/api/buyers/"),
          axios.get("http://localhost:5000/api/schemes/")
        ]);

        const crops = cropsRes.data;
        const buyers = buyersRes.data;
        const schemes = schemesRes.data;

        setStats({
          crops: crops.length,
          buyers: buyers.length,
          schemes: schemes.length
        });

        // Top 3 crops
        setTopCrops(crops.slice(0, 3));
        
        // Top 3 featured schemes
        setFeaturedSchemes(schemes.slice(0, 3));

      } catch (err) {
        console.error("Dashboard fetch error", err);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div style={styles.container}>
      {/* Animated Hero Banner */}
      <div style={styles.heroBanner}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>{t("Welcome to farmX")}</h1>
          <p style={styles.heroSubtitle}>
            {t("dash_sub")}
          </p>
          <div style={styles.heroButtons}>
            <button style={styles.primaryBtn} onClick={() => navigate('/recommend')}>
              <Sprout size={18} /> {t("AI Crop Guide")}
            </button>
            <button style={styles.secondaryBtn} onClick={() => navigate('/fertilizer')}>
              <FileText size={18} /> {t("Fertilizer Calc")}
            </button>
            <button style={{...styles.secondaryBtn, backgroundColor: '#0284c7', color: '#fff'}} onClick={() => navigate('/weather')}>
              <CloudSun size={18} /> {t("Weather & Spray")}
            </button>
            <button style={{...styles.secondaryBtn, backgroundColor: '#059669', color: '#fff'}} onClick={() => navigate('/emandi')}>
              <Store size={18} /> {t("Live e-Mandi")}
            </button>
          </div>
        </div>

        {/* Animated Farm Elements */}
        <div style={styles.farmAnimContainer}>
          <div style={styles.sun}><Sun size={80} color="#fbbf24" fill="#fef08a" /></div>
          <div style={styles.cloud1}><Cloud size={60} color="#ffffff" fill="#ffffff" /></div>
          <div style={styles.cloud2}><Cloud size={40} color="#ffffff" fill="#ffffff" opacity={0.7} /></div>
          <div style={styles.tractor}><Tractor size={100} color="#064e3b" /></div>
          <div style={styles.leaf1}><Leaf size={32} color="#059669" fill="#10b981" /></div>
          <div style={styles.leaf2}><Leaf size={24} color="#047857" fill="#059669" /></div>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={styles.statsRow}>
        <div className="glass-panel hover-3d-lift" style={styles.statCard}>
          <div style={{...styles.iconBg, backgroundColor: 'rgba(251, 191, 36, 0.1)'}}>
            <Sprout size={24} color="#fbbf24" />
          </div>
          <div>
            <div style={styles.statLabel}>{t("Total Crops")}</div>
            <div style={styles.statValue}>{stats.crops}</div>
          </div>
        </div>
        
        <div className="glass-panel hover-3d-lift" style={styles.statCard}>
          <div style={{...styles.iconBg, backgroundColor: 'rgba(59, 130, 246, 0.1)'}}>
            <Users size={24} color="#3b82f6" />
          </div>
          <div>
            <div style={styles.statLabel}>{t("Active Buyers")}</div>
            <div style={styles.statValue}>{stats.buyers}</div>
          </div>
        </div>

        <div className="glass-panel hover-3d-lift" style={styles.statCard}>
          <div style={{...styles.iconBg, backgroundColor: 'rgba(249, 115, 22, 0.1)'}}>
            <FileText size={24} color="#f97316" />
          </div>
          <div>
            <div style={styles.statLabel}>{t("Govt Schemes")}</div>
            <div style={styles.statValue}>{stats.schemes}</div>
          </div>
        </div>
      </div>

      {/* Mini Widgets */}
      <div style={styles.widgetRow}>
        
        {/* Top Market Prices */}
        <div style={styles.widgetCol}>
          <div style={styles.widgetHeader}>
            <h3 style={styles.widgetTitle}><TrendingUp size={20} color="var(--accent-primary)"/> {t("Top Market Prices")}</h3>
            <Link to="/" style={styles.viewAll}>{t("View All")} <ChevronRight size={16}/></Link>
          </div>
          <div style={styles.widgetList}>
            {topCrops.map(crop => (
              <div key={crop.id} className="glass-panel hover-3d-lift" style={styles.widgetItem}>
                <div>
                  <h4 style={styles.itemName}>{crop.name}</h4>
                  <p style={styles.itemSub}>{crop.location}</p>
                </div>
                <div style={styles.itemRight}>
                  <div style={styles.priceText}>₹{crop.current_price}</div>
                  <div style={{fontSize: '12px', color: crop.trend === 'up' ? 'var(--accent-primary)' : '#ef4444'}}>
                    {crop.trend === 'up' ? '+2.1%' : '-0.5%'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Schemes */}
        <div style={styles.widgetCol}>
          <div style={styles.widgetHeader}>
            <h3 style={styles.widgetTitle}><CheckCircle2 size={20} color="#fbbf24"/> {t("Featured Schemes")}</h3>
            <Link to="/schemes" style={styles.viewAll}>{t("View All")} <ChevronRight size={16}/></Link>
          </div>
          <div style={styles.widgetList}>
            {featuredSchemes.map(scheme => (
              <div key={scheme.id} className="glass-panel hover-3d-lift" style={styles.widgetItem}>
                <div>
                  <h4 style={styles.itemName}>{scheme.title}</h4>
                  <p style={styles.itemSub}>{scheme.department}</p>
                </div>
                <div style={styles.itemRight}>
                  <div style={styles.subsidyText}>{scheme.subsidy_amount}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* CSS Animations for Farm Elements */}
      <style>{`
        @keyframes rotateSun {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes floatCloud {
          0% { transform: translateX(0); }
          50% { transform: translateX(20px); }
          100% { transform: translateX(0); }
        }
        @keyframes driveTractor {
          0% { transform: translateX(0) translateY(0); }
          50% { transform: translateX(-15px) translateY(-3px) rotate(-2deg); }
          100% { transform: translateX(0) translateY(0); }
        }
        @keyframes floatLeaf {
          0% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(15deg); }
          100% { transform: translateY(0) rotate(0deg); }
        }
      `}</style>

    </div>
  );
}

const styles = {
  container: {
    fontFamily: "var(--font-main)",
  },
  heroBanner: {
    position: "relative",
    backgroundColor: "var(--accent-primary)",
    borderRadius: "24px",
    padding: "48px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "32px",
    overflow: "hidden",
    boxShadow: "0 10px 30px rgba(52, 211, 153, 0.15)",
  },
  heroContent: {
    position: "relative",
    zIndex: 2,
    maxWidth: "500px",
  },
  heroTitle: {
    color: "var(--text-on-primary)",
    fontSize: "42px",
    fontWeight: "800",
    margin: "0 0 16px 0",
    letterSpacing: "-1px",
  },
  heroSubtitle: {
    color: "rgba(15, 22, 18, 0.8)",
    fontSize: "18px",
    lineHeight: "1.6",
    margin: "0 0 32px 0",
    fontWeight: "500",
  },
  heroButtons: {
    display: "flex",
    gap: "16px",
  },
  primaryBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#ffffff",
    color: "var(--accent-primary)",
    border: "none",
    padding: "14px 24px",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
    transition: "transform 0.2s",
  },
  secondaryBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "rgba(15, 22, 18, 0.1)",
    color: "var(--text-on-primary)",
    border: "1px solid rgba(15, 22, 18, 0.2)",
    padding: "14px 24px",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  farmAnimContainer: {
    position: "absolute",
    right: "0",
    top: "0",
    width: "40%",
    height: "100%",
    zIndex: 1,
    overflow: "hidden",
  },
  sun: {
    position: "absolute",
    top: "-20px",
    right: "60px",
    animation: "rotateSun 30s linear infinite",
    opacity: 0.9,
  },
  cloud1: {
    position: "absolute",
    top: "30px",
    right: "180px",
    animation: "floatCloud 10s ease-in-out infinite",
    opacity: 0.9,
  },
  cloud2: {
    position: "absolute",
    top: "80px",
    right: "30px",
    animation: "floatCloud 14s ease-in-out infinite reverse",
  },
  tractor: {
    position: "absolute",
    bottom: "10px",
    right: "80px",
    animation: "driveTractor 3s ease-in-out infinite",
  },
  leaf1: {
    position: "absolute",
    bottom: "80px",
    right: "220px",
    animation: "floatLeaf 5s ease-in-out infinite",
  },
  leaf2: {
    position: "absolute",
    top: "120px",
    right: "240px",
    animation: "floatLeaf 6s ease-in-out infinite reverse",
  },
  statsRow: {
    display: "flex",
    gap: "24px",
    marginBottom: "32px",
  },
  statCard: {
    flex: 1,
    padding: "24px",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  iconBg: {
    width: "56px",
    height: "56px",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  statLabel: {
    color: "var(--text-secondary)",
    fontSize: "15px",
    fontWeight: "500",
    marginBottom: "4px",
  },
  statValue: {
    color: "var(--text-primary)",
    fontSize: "28px",
    fontWeight: "700",
  },
  widgetRow: {
    display: "flex",
    gap: "32px",
  },
  widgetCol: {
    flex: 1,
  },
  widgetHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  widgetTitle: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "var(--text-primary)",
    fontSize: "18px",
    fontWeight: "700",
    margin: 0,
  },
  viewAll: {
    display: "flex",
    alignItems: "center",
    color: "var(--text-secondary)",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "500",
  },
  widgetList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  widgetItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px",
    borderRadius: "12px",
  },
  itemName: {
    margin: "0 0 4px 0",
    color: "var(--text-primary)",
    fontSize: "16px",
    fontWeight: "600",
  },
  itemSub: {
    margin: 0,
    color: "var(--text-muted)",
    fontSize: "13px",
  },
  itemRight: {
    textAlign: "right",
  },
  priceText: {
    color: "var(--text-primary)",
    fontSize: "18px",
    fontWeight: "700",
    marginBottom: "2px",
  },
  subsidyText: {
    color: "var(--accent-primary)",
    fontSize: "15px",
    fontWeight: "600",
    backgroundColor: "rgba(52, 211, 153, 0.1)",
    padding: "4px 10px",
    borderRadius: "20px",
  }
};

export default Dashboard;
