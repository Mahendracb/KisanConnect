import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  ShieldCheck, 
  CloudRain, 
  PlusCircle, 
  Trash2, 
  X, 
  Save, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink 
} from "lucide-react";
import { useLanguage } from "../LanguageContext";

function Schemes() {
  const { t, isKannada } = useLanguage();
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("pre_crop");

  // Add Scheme Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [schemeForm, setSchemeForm] = useState({
    title: "",
    description: "",
    eligibility: "",
    category: "pre_crop",
    link: "https://agricoop.gov.in"
  });
  const [savingScheme, setSavingScheme] = useState(false);
  const [actionMsg, setActionMsg] = useState({ type: '', text: '' });

  const fetchSchemes = async (categoryFilter = activeTab) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/schemes?category=${categoryFilter}`);
      setSchemes(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching schemes:", err);
      setError("Failed to load schemes.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes(activeTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // Handle Add Scheme (POST /api/schemes)
  const handleCreateScheme = async (e) => {
    e.preventDefault();
    setSavingScheme(true);
    setActionMsg({ type: '', text: '' });

    try {
      await axios.post("http://localhost:5000/api/schemes", schemeForm);
      setActionMsg({
        type: 'success',
        text: isKannada ? "ಹೊಸ ಕೃಷಿ ಯೋಜನೆ ಯಶಸ್ವಿಯಾಗಿ ಸೇರಿಸಲಾಗಿದೆ!" : "Government scheme added successfully!"
      });
      setIsAddModalOpen(false);
      setSchemeForm({
        title: "",
        description: "",
        eligibility: "",
        category: activeTab,
        link: "https://agricoop.gov.in"
      });
      fetchSchemes(activeTab);
    } catch (err) {
      alert("Error adding scheme: " + (err.response?.data?.error || err.message));
    } finally {
      setSavingScheme(false);
    }
  };

  // Handle Delete Scheme (DELETE /api/schemes/:id)
  const handleDeleteScheme = async (scheme) => {
    const schemeId = scheme.id || scheme._id;
    if (!window.confirm(isKannada ? `ನೀವು ನಿಜವಾಗಿಯೂ "${scheme.title}" ಯೋಜನೆಯನ್ನು ಅಳಿಸಲು ಬಯಸುವಿರಾ?` : `Are you sure you want to delete ${scheme.title}?`)) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/schemes/${schemeId}`);
      setActionMsg({
        type: 'success',
        text: isKannada ? "ಯೋಜನೆಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಅಳಿಸಲಾಗಿದೆ!" : "Scheme deleted successfully!"
      });
      fetchSchemes(activeTab);
    } catch (err) {
      alert("Error deleting scheme: " + (err.response?.data?.error || err.message));
    }
  };

  const filteredSchemes = schemes.filter(scheme => scheme.category === activeTab);

  if (loading) return <div style={styles.center}>Loading schemes...</div>;
  if (error) return <div style={styles.error}>{error}</div>;

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <div>
          <h1 style={styles.header}>{isKannada ? "ಸರ್ಕಾರಿ ಕೃಷಿ ಯೋಜನೆಗಳು" : "Government Schemes"}</h1>
          <p style={styles.subtitle}>{isKannada ? "ರೈತರಿಗಾಗಿ ಲಭ್ಯವಿರುವ ಸಬ್ಸಿಡಿಗಳು, ಬೆಳೆ ವಿಮೆ ಮತ್ತು ಹಣಕಾಸು ನೆರವು ಯೋಜನೆಗಳು." : "Find support programs and subsidies you are eligible for."}</p>
        </div>

        <button
          onClick={() => {
            setSchemeForm(prev => ({ ...prev, category: activeTab }));
            setIsAddModalOpen(true);
          }}
          style={styles.addBtn}
        >
          <PlusCircle size={16} />
          <span>{isKannada ? "ಹೊಸ ಯೋಜನೆ ಸೇರಿಸಿ" : "Add New Scheme"}</span>
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

      {/* Tabs / Toggles */}
      <div style={styles.tabsContainer}>
        <button 
          style={{...styles.tab, ...(activeTab === "pre_crop" ? styles.activeTab : {})}}
          onClick={() => setActiveTab("pre_crop")}
        >
          <ShieldCheck size={18} />
          {isKannada ? "ಬಿತ್ತನೆ ಪೂರ್ವ ಯೋಜನೆಗಳು" : "Pre-Crop Schemes"}
        </button>
        <button 
          style={{...styles.tab, ...(activeTab === "crop_loss" ? styles.activeTab : {})}}
          onClick={() => setActiveTab("crop_loss")}
        >
          <CloudRain size={18} />
          {isKannada ? "ಬೆಳೆ ನಷ್ಟ ಪರಿಹಾರ ಯೋಜನೆಗಳು" : "Crop Loss Support"}
        </button>
      </div>

      {/* Schemes Grid */}
      <div style={styles.grid}>
        {filteredSchemes.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            {isKannada ? "ಈ ವಿಭಾಗದಲ್ಲಿ ಯಾವುದೇ ಯೋಜನೆಗಳು ಲಭ್ಯವಿಲ್ಲ." : "No schemes found in this category."}
          </div>
        ) : (
          filteredSchemes.map((scheme) => {
            const schemeId = scheme.id || scheme._id;
            // Parse the eligibility text to separate main text from bullet points
            const parts = (scheme.eligibility || "").split('\n');
            const mainEligibility = parts[0];
            const benefitsList = parts.slice(1).map(p => p.replace(/^- /, ''));

            return (
              <div key={schemeId} className="hover-3d-lift glass-panel" style={styles.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h2 style={styles.cardTitle}>{scheme.title}</h2>
                  <button
                    onClick={() => handleDeleteScheme(scheme)}
                    style={styles.deleteBtn}
                    title={isKannada ? "ಯೋಜನೆ ಅಳಿಸಿ" : "Delete Scheme"}
                  >
                    <Trash2 size={15} color="#ef4444" />
                  </button>
                </div>

                <p style={styles.cardDesc}>{scheme.description}</p>
                
                <div style={styles.eligibilityText}>
                  {mainEligibility}
                </div>

                {benefitsList.length > 0 && (
                  <div style={styles.benefitsSection}>
                    <h4 style={styles.benefitsHeader}>{isKannada ? "ಪ್ರಮುಖ ಪ್ರಯೋಜನಗಳು" : "KEY BENEFITS"}</h4>
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
                  <span>{isKannada ? "ಅರ್ಹತೆ ಪರಿಶೀಲಿಸಿ & ಅರ್ಜಿ ಸಲ್ಲಿಸಿ" : "View Eligibility & Apply"}</span>
                  <ExternalLink size={16} />
                </a>
              </div>
            );
          })
        )}
      </div>

      {/* Add Scheme Modal */}
      {isAddModalOpen && (
        <div style={styles.modalOverlay}>
          <div className="glass-panel" style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                {isKannada ? "ಹೊಸ ಸರ್ಕಾರಿ ಕೃಷಿ ಯೋಜನೆ ಸೇರಿಸಿ" : "Add Government Scheme"}
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} style={styles.closeBtn}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateScheme} style={styles.formGrid}>
              <div style={{ ...styles.formGroup, gridColumn: '1 / -1' }}>
                <label style={styles.label}>{isKannada ? "ಯೋಜನೆಯ ಹೆಸರು" : "Scheme Title"} *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PM-KISAN Samman Nidhi Yojana"
                  value={schemeForm.title}
                  onChange={(e) => setSchemeForm({ ...schemeForm, title: e.target.value })}
                  style={styles.modalInput}
                />
              </div>

              <div style={{ ...styles.formGroup, gridColumn: '1 / -1' }}>
                <label style={styles.label}>{isKannada ? "ವಿವರಣೆ" : "Scheme Description"} *</label>
                <textarea
                  rows="2"
                  required
                  placeholder="e.g. Financial benefit of ₹6,000 per year in three equal installments to all landholding farmer families."
                  value={schemeForm.description}
                  onChange={(e) => setSchemeForm({ ...schemeForm, description: e.target.value })}
                  style={styles.modalInput}
                />
              </div>

              <div style={{ ...styles.formGroup, gridColumn: '1 / -1' }}>
                <label style={styles.label}>{isKannada ? "ಅರ್ಹತೆ ಮತ್ತು ಪ್ರಯೋಜನಗಳು (ಬುಲೆಟ್ ಪಾಯಿಂಟ್‌ಗಳೊಂದಿಗೆ)" : "Eligibility & Benefits (Separate points with newlines)"} *</label>
                <textarea
                  rows="3"
                  required
                  placeholder={`All landholding farmer families with cultivable landholding in their names.\n- Direct Bank Transfer (DBT) of ₹2,000 per installment\n- 100% centrally funded scheme`}
                  value={schemeForm.eligibility}
                  onChange={(e) => setSchemeForm({ ...schemeForm, eligibility: e.target.value })}
                  style={styles.modalInput}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>{isKannada ? "ವರ್ಗ" : "Category"}</label>
                <select
                  value={schemeForm.category}
                  onChange={(e) => setSchemeForm({ ...schemeForm, category: e.target.value })}
                  style={styles.modalInput}
                >
                  <option value="pre_crop">{isKannada ? "ಬಿತ್ತನೆ ಪೂರ್ವ ಯೋಜನೆ" : "Pre-Crop Scheme"}</option>
                  <option value="crop_loss">{isKannada ? "ಬೆಳೆ ನಷ್ಟ ಪರಿಹಾರ" : "Crop Loss Support"}</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>{isKannada ? "ಅಧಿಕೃತ ಪೋರ್ಟಲ್ ಲಿಂಕ್" : "Official Portal Link (URL)"} *</label>
                <input
                  type="url"
                  required
                  placeholder="https://pmkisan.gov.in"
                  value={schemeForm.link}
                  onChange={(e) => setSchemeForm({ ...schemeForm, link: e.target.value })}
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
                  disabled={savingScheme}
                  style={styles.saveBtn}
                >
                  <Save size={16} />
                  <span>{savingScheme ? (isKannada ? "ಉಳಿಸಲಾಗುತ್ತಿದೆ..." : "Saving...") : (isKannada ? "ಯೋಜನೆ ಸೇರಿಸಿ" : "Add Scheme")}</span>
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
  tabsContainer: {
    display: "flex",
    gap: "12px",
    marginBottom: "32px",
    borderBottom: "1px solid var(--border-color)",
    paddingBottom: "16px",
    flexWrap: "wrap",
  },
  tab: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 24px",
    borderRadius: "12px",
    border: "1px solid transparent",
    backgroundColor: "transparent",
    color: "var(--text-secondary)",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  activeTab: {
    backgroundColor: "rgba(52, 211, 153, 0.12)",
    color: "var(--accent-primary)",
    border: "1px solid rgba(52, 211, 153, 0.3)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
    gap: "24px",
  },
  card: {
    padding: "28px",
    borderRadius: "16px",
    display: "flex",
    flexDirection: "column",
    border: "1px solid var(--border-color)",
  },
  cardTitle: {
    margin: "0 0 12px 0",
    fontSize: "20px",
    color: "var(--text-primary)",
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
  cardDesc: {
    margin: "0 0 16px 0",
    color: "var(--text-secondary)",
    fontSize: "14px",
    lineHeight: "1.5",
  },
  eligibilityText: {
    color: "var(--text-muted)",
    fontSize: "13px",
    lineHeight: "1.5",
    marginBottom: "20px",
    fontStyle: "italic",
  },
  benefitsSection: {
    marginTop: "auto",
    marginBottom: "24px",
  },
  benefitsHeader: {
    color: "var(--accent-primary)",
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "0.5px",
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
    fontSize: "13px",
  },
  bulletPoint: {
    color: "#fbbf24",
    fontSize: "16px",
    lineHeight: "1",
  },
  applyBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    width: "100%",
    padding: "12px",
    backgroundColor: "rgba(52, 211, 153, 0.08)",
    color: "var(--accent-primary)",
    textDecoration: "none",
    borderRadius: "10px",
    fontWeight: "600",
    fontSize: "14px",
    transition: "all 0.2s",
    marginTop: "auto",
    border: "1px solid rgba(52, 211, 153, 0.2)",
    boxSizing: "border-box",
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
    maxWidth: '560px',
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

export default Schemes;
