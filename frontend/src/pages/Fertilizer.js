import React, { useState } from "react";
import axios from "axios";
import { Calculator, FlaskConical, Beaker, Leaf, Store, MapPin, Phone, Download } from "lucide-react";
import { generateFarmAdvisoryPdf } from "../utils/generatePdf";

// Mock Data for standard fertilizer needs per acre (in kg)
const FERTILIZER_DATA = {
  "Sugarcane": { urea: 100, dap: 50, mop: 40 },
  "Rice": { urea: 80, dap: 40, mop: 20 },
  "Wheat": { urea: 60, dap: 30, mop: 20 },
  "Cotton": { urea: 90, dap: 45, mop: 30 },
  "Maize": { urea: 70, dap: 35, mop: 25 },
};

function Fertilizer() {
  const [crop, setCrop] = useState("");
  const [acres, setAcres] = useState(1);
  const [season, setSeason] = useState("Kharif (Monsoon)");
  const [query, setQuery] = useState("");
  const [calculatedResult, setCalculatedResult] = useState(null);
  const [aiResult, setAiResult] = useState(null);
  const [aiError, setAiError] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const clean = (text) => {
  return text
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/#/g, "")
    .replace(/`/g, "")
    .replace(/_/g, "")
    .replace(/>/g, "")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/\n+/g, "\n")
    .trim();
};


  const handleCalculate = () => {
    if (!crop || acres <= 0) return;
    
    const baseNeeds = FERTILIZER_DATA[crop];
    setCalculatedResult({
      urea: baseNeeds.urea * acres,
      dap: baseNeeds.dap * acres,
      mop: baseNeeds.mop * acres,
    });
  };

  const submitFertilizerAI = async () => {
    if (!query.trim()) {
      setAiError("Please enter a question for fertilizer advice.");
      return;
    }

    setAiLoading(true);
    setAiError("");
    setAiResult(null);

    try {
      const response = await axios.post("http://localhost:5000/api/ai/text/", {
        prompt: `Provide fertilizer recommendation and crop planning advice for ${crop || "a crop"}, ${acres} acres, season ${season}. ${query}`,
      });
      const cleaned = clean(response.data.result);
      setAiResult(cleaned);
    } catch (err) {
      setAiError(err.response?.data?.error || "AI request failed. Please try again.");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Fertilizer Calculator</h1>
      <p style={styles.subtitle}>Calculate exact fertilizer needs and find the cheapest suppliers near you.</p>

      <div style={styles.layout}>
        
        {/* Left Column - Input Form */}
        <div className="glass-panel hover-3d-lift" style={styles.formCard}>
          <div style={styles.cardHeader}>
            <div style={styles.iconBg}>
              <Calculator size={20} color="var(--accent-primary)" />
            </div>
            <h3 style={styles.cardTitle}>Input Details</h3>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Select Crop</label>
            <select 
              style={styles.input} 
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
            >
              <option value="">Select a crop</option>
              {Object.keys(FERTILIZER_DATA).map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Land Size (Acres)</label>
            <input 
              type="number" 
              min="0.1" 
              step="0.1" 
              style={styles.input}
              value={acres}
              onChange={(e) => setAcres(parseFloat(e.target.value) || 0)}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Growing Season</label>
            <select 
              style={styles.input}
              value={season}
              onChange={(e) => setSeason(e.target.value)}
            >
              <option value="Kharif (Monsoon)">Kharif (Monsoon)</option>
              <option value="Rabi (Winter)">Rabi (Winter)</option>
              <option value="Zaid (Summer)">Zaid (Summer)</option>
            </select>
          </div>

          <button 
            style={{
              ...styles.calculateBtn, 
              opacity: crop && acres > 0 ? 1 : 0.5,
              cursor: crop && acres > 0 ? "pointer" : "not-allowed"
            }}
            onClick={handleCalculate}
            disabled={!crop || acres <= 0}
          >
            Calculate Need
          </button>
          <div style={styles.inputGroup}>
            <label style={styles.label}>AI Query</label>
            <textarea
              style={styles.textarea}
              rows={4}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask for fertilizer recommendations, soil advice, or crop planning tips."
            />
          </div>
          <button
            style={{
              ...styles.secondaryBtn,
              opacity: aiLoading || !query.trim() ? 0.7 : 1,
              cursor: aiLoading || !query.trim() ? "not-allowed" : "pointer",
            }}
            onClick={submitFertilizerAI}
            disabled={aiLoading || !query.trim()}
          >
            {aiLoading ? "Asking AI..." : "Ask AI for Fertilizer Advice"}
          </button>
        </div>

        {/* Right Column - Results / Empty State */}
        <div className="glass-panel" style={styles.resultCard}>
          {!calculatedResult ? (
            <div style={styles.emptyState}>
              <FlaskConical size={64} color="var(--text-muted)" style={{marginBottom: "24px", opacity: 0.5}} />
              <h2 style={styles.emptyStateTitle}>Fill out the details to get an estimate</h2>
              <p style={styles.emptyStateText}>
                We'll calculate how much fertilizer you need based on the crop and land size.
              </p>
            </div>
          ) : (
            <div style={styles.resultsContainer}>
              <div style={styles.cardHeader}>
                <div style={styles.iconBg}>
                  <Beaker size={20} color="var(--accent-primary)" />
                </div>
                <h3 style={styles.cardTitle}>Required Fertilizers</h3>
              </div>

              <div style={styles.statsGrid}>
                <div style={styles.statBox}>
                  <p style={styles.statLabel}>Urea (Nitrogen)</p>
                  <h2 style={styles.statValue}>{calculatedResult.urea} <span style={styles.statUnit}>kg</span></h2>
                </div>
                <div style={styles.statBox}>
                  <p style={styles.statLabel}>DAP (Phosphorus)</p>
                  <h2 style={styles.statValue}>{calculatedResult.dap} <span style={styles.statUnit}>kg</span></h2>
                </div>
                <div style={styles.statBox}>
                  <p style={styles.statLabel}>MOP (Potassium)</p>
                  <h2 style={styles.statValue}>{calculatedResult.mop} <span style={styles.statUnit}>kg</span></h2>
                </div>
              </div>

              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  width: "100%",
                  padding: "12px",
                  backgroundColor: "#16a34a",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "700",
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  margin: "18px 0",
                  boxShadow: "0 2px 8px rgba(22, 163, 74, 0.25)"
                }}
                onClick={() =>
                  generateFarmAdvisoryPdf({
                    farmerName: "Farmer",
                    village: "Mandya, Karnataka",
                    crop: crop || "Cultivated Crop",
                    acres: acres || 1,
                    season,
                    fertilizerData: calculatedResult,
                    customAdvice: aiResult
                  })
                }
              >
                <Download size={18} /> Download Official PDF Soil & Advisory Card
              </button>

              <h4 style={styles.supplierHeader}>
                <Store size={18} /> Recommended Suppliers Near You
              </h4>
              
              <div style={styles.supplierList}>
                <div style={styles.supplierItem}>
                  <div>
                    <h5 style={styles.supplierName}>Kisan Agro Center</h5>
                    <p style={styles.supplierLoc}><MapPin size={12}/> Mandya APMC (2.4 km away)</p>
                  </div>
                  <div style={styles.supplierPriceInfo}>
                    <span style={styles.priceHighlight}>₹266</span> / bag (Urea)
                    <button style={styles.callBtn}><Phone size={14} /> Contact</button>
                  </div>
                </div>
                
                <div style={styles.supplierItem}>
                  <div>
                    <h5 style={styles.supplierName}>Green Earth Fertilizers</h5>
                    <p style={styles.supplierLoc}><MapPin size={12}/> Maddur (8.1 km away)</p>
                  </div>
                  <div style={styles.supplierPriceInfo}>
                    <span style={styles.priceHighlight}>₹270</span> / bag (Urea)
                    <button style={styles.callBtn}><Phone size={14} /> Contact</button>
                  </div>
                </div>
              </div>

            </div>
          )}

          {(aiLoading || aiError || aiResult) && (
            <div style={styles.aiPanel}>
              <div style={styles.aiPanelHeader}>
                <div style={styles.iconBgSmall}>
                  <Leaf size={16} color="var(--accent-primary)" />
                </div>
                <h4 style={styles.aiPanelTitle}>AI Advice</h4>
              </div>
              <div style={styles.aiPanelBody}>
                {aiLoading ? (
                  <p style={styles.aiPanelText}>Analyzing your query...</p>
                ) : aiError ? (
                  <p style={styles.aiErrorText}>{aiError}</p>
                ) : (
                  <div style={styles.aiFormattedText}>
                    {aiResult
                      ?.split(/\n{2,}/)
                      .filter(Boolean)
                      .map((block, index) => {
                        const trimmed = block.trim();
                        if (!trimmed) return null;

                        const isHeading = /^#{1,3}\s/.test(trimmed);
                        const isBullet = /^[-*•]\s/.test(trimmed);
                        const isNumbered = /^\d+\.\s/.test(trimmed);

                        if (isHeading) {
                          const text = trimmed.replace(/^#{1,3}\s/, "");
                          return <p key={index} style={styles.aiHeading}>{text}</p>;
                        }

                        if (isBullet || isNumbered) {
                          return (
                            <div key={index} style={styles.aiBulletBlock}>
                              <span style={styles.aiBulletMarker}>{isNumbered ? "•" : "•"}</span>
                              <span style={styles.aiPanelText}>{trimmed.replace(/^(?:[-*•]|\d+\.\s)/, "")}</span>
                            </div>
                          );
                        }

                        return <p key={index} style={styles.aiPanelText}>{trimmed}</p>;
                      })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "var(--font-main)",
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
    alignItems: "stretch",
  },
  formCard: {
    width: "380px",
    padding: "32px",
    borderRadius: "16px",
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
  },
  resultCard: {
    flex: 1,
    borderRadius: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "32px",
  },
  iconBg: {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    backgroundColor: "rgba(52, 211, 153, 0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    margin: 0,
    fontSize: "20px",
    color: "var(--text-primary)",
    fontWeight: "600",
  },
  inputGroup: {
    marginBottom: "24px",
  },
  label: {
    display: "block",
    color: "var(--text-secondary)",
    fontSize: "14px",
    marginBottom: "8px",
    fontWeight: "500",
  },
  input: {
    width: "100%",
    backgroundColor: "var(--bg-main)",
    border: "1px solid var(--border-color)",
    padding: "14px 16px",
    borderRadius: "12px",
    color: "var(--text-primary)",
    fontSize: "15px",
    outline: "none",
    transition: "border-color 0.2s",
  },
  textarea: {
    width: "100%",
    minHeight: "120px",
    backgroundColor: "var(--bg-main)",
    border: "1px solid var(--border-color)",
    padding: "14px 16px",
    borderRadius: "12px",
    color: "var(--text-primary)",
    fontSize: "15px",
    outline: "none",
    resize: "vertical",
    fontFamily: "var(--font-main)",
    lineHeight: "1.5",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  calculateBtn: {
    marginTop: "auto",
    width: "100%",
    backgroundColor: "var(--accent-primary)",
    color: "var(--text-on-primary)",
    border: "none",
    padding: "16px",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "600",
    transition: "all 0.2s",
  },
  secondaryBtn: {
    width: "100%",
    background: "linear-gradient(135deg, var(--accent-primary), #2dd4bf)",
    color: "var(--text-on-primary)",
    border: "none",
    padding: "14px 16px",
    borderRadius: "12px",
    fontSize: "15px",
    fontWeight: "700",
    transition: "transform 0.2s, box-shadow 0.2s",
    boxShadow: "0 8px 20px rgba(16, 185, 129, 0.18)",
    fontFamily: "var(--font-main)",
    letterSpacing: "0.2px",
  },
  errorBox: {
    marginTop: "12px",
    padding: "12px 14px",
    borderRadius: "10px",
    backgroundColor: "rgba(239, 68, 68, 0.09)",
    border: "1px solid rgba(239, 68, 68, 0.18)",
    color: "#dc2626",
    fontSize: "14px",
    fontWeight: "500",
  },
  aiPanel: {
    marginTop: "auto",
    padding: "18px",
    borderRadius: "12px",
    backgroundColor: "rgba(16, 185, 129, 0.08)",
    border: "1px solid rgba(16, 185, 129, 0.18)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2)",
  },
  aiPanelHeader: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "10px",
  },
  iconBgSmall: {
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    backgroundColor: "rgba(52, 211, 153, 0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  aiPanelTitle: {
    margin: 0,
    color: "var(--text-primary)",
    fontSize: "15px",
    fontWeight: "700",
  },
  aiPanelBody: {
    maxHeight: "220px",
    overflowY: "auto",
    paddingRight: "6px",
  },
  aiFormattedText: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  aiHeading: {
    margin: 0,
    color: "var(--text-primary)",
    fontSize: "14px",
    fontWeight: "700",
    lineHeight: "1.5",
  },
  aiBulletBlock: {
    display: "flex",
    gap: "8px",
    alignItems: "flex-start",
  },
  aiBulletMarker: {
    color: "var(--accent-primary)",
    fontWeight: "700",
    marginTop: "2px",
  },
  aiPanelText: {
    margin: 0,
    color: "var(--text-secondary)",
    fontSize: "14px",
    lineHeight: "1.6",
    whiteSpace: "pre-wrap",
    fontFamily: "var(--font-main)",
  },
  aiErrorText: {
    margin: 0,
    color: "#dc2626",
    fontSize: "14px",
    lineHeight: "1.6",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    padding: "60px",
    textAlign: "center",
  },
  emptyStateTitle: {
    color: "var(--text-primary)",
    fontSize: "24px",
    margin: "0 0 12px 0",
    fontWeight: "600",
  },
  emptyStateText: {
    color: "var(--text-muted)",
    fontSize: "16px",
    maxWidth: "400px",
    lineHeight: "1.5",
  },
  resultsContainer: {
    padding: "32px",
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "16px",
    marginBottom: "40px",
  },
  statBox: {
    backgroundColor: "rgba(52, 211, 153, 0.05)",
    border: "1px solid rgba(52, 211, 153, 0.15)",
    padding: "24px",
    borderRadius: "12px",
    textAlign: "center",
  },
  statLabel: {
    color: "var(--text-secondary)",
    fontSize: "14px",
    margin: "0 0 12px 0",
    fontWeight: "500",
  },
  statValue: {
    color: "var(--accent-primary)",
    fontSize: "36px",
    margin: 0,
    fontWeight: "700",
  },
  statUnit: {
    fontSize: "16px",
    color: "var(--text-muted)",
    fontWeight: "500",
  },
  supplierHeader: {
    color: "var(--text-primary)",
    fontSize: "18px",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    margin: "0 0 20px 0",
  },
  supplierList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  supplierItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "var(--bg-main)",
    border: "1px solid var(--border-color)",
    padding: "16px 20px",
    borderRadius: "12px",
  },
  supplierName: {
    margin: "0 0 4px 0",
    fontSize: "16px",
    color: "var(--text-primary)",
  },
  supplierLoc: {
    margin: 0,
    fontSize: "13px",
    color: "var(--text-muted)",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  supplierPriceInfo: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    color: "var(--text-secondary)",
    fontSize: "14px",
  },
  priceHighlight: {
    color: "var(--accent-primary)",
    fontWeight: "700",
    fontSize: "18px",
  },
  callBtn: {
    backgroundColor: "var(--bg-card)",
    border: "1px solid var(--border-color)",
    color: "var(--text-primary)",
    padding: "8px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "13px",
    fontWeight: "500",
    transition: "background-color 0.2s",
  }
};

export default Fertilizer;
