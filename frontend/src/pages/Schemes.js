import React, { useState, useEffect } from "react";
import axios from "axios";
import { ShieldCheck, CloudRain, ArrowRight } from "lucide-react";

function Schemes() {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("pre_crop");

  useEffect(() => {
    axios.get("http://localhost:5000/api/schemes/")
      .then(response => {
        setSchemes(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching schemes:", err);
        setError("Failed to load schemes.");
        setLoading(false);
      });
  }, []);

  const filteredSchemes = schemes.filter(scheme => scheme.category === activeTab);

  if (loading) return <div style={styles.center}>Loading schemes...</div>;
  if (error) return <div style={styles.error}>{error}</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Government Schemes</h1>
      <p style={styles.subtitle}>Find support programs and subsidies you are eligible for.</p>

      {/* Tabs / Toggles */}
      <div style={styles.tabsContainer}>
        <button 
          style={{...styles.tab, ...(activeTab === "pre_crop" ? styles.activeTab : {})}}
          onClick={() => setActiveTab("pre_crop")}
        >
          <ShieldCheck size={18} />
          Pre-Crop Schemes
        </button>
        <button 
          style={{...styles.tab, ...(activeTab === "crop_loss" ? styles.activeTab : {})}}
          onClick={() => setActiveTab("crop_loss")}
        >
          <CloudRain size={18} />
          Crop Loss Support
        </button>
      </div>

      {/* Schemes Grid */}
      <div style={styles.grid}>
        {filteredSchemes.map((scheme) => {
          // Parse the eligibility text to separate main text from bullet points
          const parts = scheme.eligibility.split('\n');
          const mainEligibility = parts[0];
          const benefitsList = parts.slice(1).map(p => p.replace(/^- /, ''));

          return (
            <div key={scheme.id} className="hover-3d-lift glass-panel" style={styles.card}>
              <h2 style={styles.cardTitle}>{scheme.title}</h2>
              <p style={styles.cardDesc}>{scheme.description}</p>
              
              <div style={styles.eligibilityText}>
                {mainEligibility}
              </div>

              {benefitsList.length > 0 && (
                <div style={styles.benefitsSection}>
                  <h4 style={styles.benefitsHeader}>KEY BENEFITS</h4>
                  <ul style={styles.benefitsList}>
                    {benefitsList.map((benefit, idx) => (
                      <li key={idx} style={styles.benefitItem}>
                        <span style={styles.bulletPoint}>•</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <a 
                href={scheme.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                style={styles.applyBtn}
              >
                View Eligibility & Apply <ArrowRight size={16} />
              </a>
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
  tabsContainer: {
    display: "flex",
    gap: "12px",
    marginBottom: "32px",
  },
  tab: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 24px",
    backgroundColor: "transparent",
    color: "var(--text-secondary)",
    border: "1px solid transparent",
    borderRadius: "30px",
    fontSize: "15px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  activeTab: {
    backgroundColor: "rgba(52, 211, 153, 0.15)",
    color: "var(--accent-primary)",
    border: "1px solid rgba(52, 211, 153, 0.3)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
    gap: "24px",
  },
  card: {
    padding: "28px",
    borderRadius: "16px",
    display: "flex",
    flexDirection: "column",
  },
  cardTitle: {
    margin: "0 0 12px 0",
    fontSize: "22px",
    color: "var(--text-primary)",
    fontWeight: "600",
  },
  cardDesc: {
    margin: "0 0 16px 0",
    color: "var(--text-primary)",
    fontSize: "15px",
    lineHeight: "1.5",
  },
  eligibilityText: {
    color: "var(--text-secondary)",
    fontSize: "14px",
    lineHeight: "1.5",
    marginBottom: "24px",
  },
  benefitsSection: {
    marginTop: "auto",
    marginBottom: "24px",
  },
  benefitsHeader: {
    color: "var(--accent-primary)",
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "1px",
    margin: "0 0 12px 0",
  },
  benefitsList: {
    margin: 0,
    padding: 0,
    listStyleType: "none",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  benefitItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "8px",
    color: "var(--text-primary)",
    fontSize: "14px",
  },
  bulletPoint: {
    color: "#fbbf24", // Yellow accent for bullets
    fontSize: "16px",
    lineHeight: "1",
  },
  applyBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    width: "100%",
    padding: "14px",
    backgroundColor: "rgba(52, 211, 153, 0.08)",
    color: "var(--accent-primary)",
    textDecoration: "none",
    borderRadius: "12px",
    fontWeight: "600",
    fontSize: "15px",
    transition: "all 0.2s",
    marginTop: "auto",
    border: "1px solid transparent",
  }
};

export default Schemes;
