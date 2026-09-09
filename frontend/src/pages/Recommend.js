/*
VOICE INTEGRATION TEMPLATE

1. Install:
   npm install react-speech-recognition

2. Add:
   import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

3. Add the speech hooks, microphone buttons, and speak() helper as discussed.

This file is your original component so you can safely edit it.
*/

import React, { useState } from "react";
import {useEffect} from "react";
import SpeechRecognition,{useSpeechRecognition} from "react-speech-recognition";
import axios from "axios";
import { Sparkles, Sprout, Loader2, CheckCircle2, Download } from "lucide-react";
import { useLanguage } from "../LanguageContext";
import { generateFarmAdvisoryPdf } from "../utils/generatePdf";

function Recommend() {
  const { t } = useLanguage();
  const [soil, setSoil] = useState("Loamy Soil");
  const [season, setSeason] = useState("Kharif (Monsoon)");
  const [water, setWater] = useState("Medium (Some irrigation)");
  const [query, setQuery] = useState("");
  const [aiResult, setAiResult] = useState(null);
  const [aiError, setAiError] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const {
  transcript,
  listening,
  resetTranscript
}=useSpeechRecognition();

useEffect(()=>{
  setQuery(transcript);
},[transcript]);
useEffect(() => {
  if (!listening && transcript.trim() !== "") {
    submitAIQuery(transcript);
  }
}, [listening, transcript]);

const startListening = () => {
  resetTranscript();

  SpeechRecognition.startListening({
    continuous: false,
    language: "en-IN",
  });
};

const stopListening=()=>{
  SpeechRecognition.stopListening();
};

// const speak=(text)=>{
//   window.speechSynthesis.cancel();
//   const u=new SpeechSynthesisUtterance(text);
//   u.lang="en-IN";
//   window.speechSynthesis.speak(u);
// };
const speak = (text) => {
  window.speechSynthesis.cancel();

  const u = new SpeechSynthesisUtterance(text);

  u.lang = "en-IN";
  u.rate = 1;

  u.onend = () => {
    startListening();
  };

  window.speechSynthesis.speak(u);
};


  const generateRecommendations = () => {
    // Simulate AI network delay
    setLoading(true);
    setResults(null);
    setAiResult(null);
    setAiError('');
    
    setTimeout(() => {
      let recs = [];
      
      // Simple rule-based "AI" engine
      if (soil === "Black Soil") {
        recs.push({ name: "Cotton", confidence: "94%", reason: "Black soil retains moisture excellently, which is perfect for cotton's deep root system." });
        if (season === "Kharif (Monsoon)") recs.push({ name: "Soybean", confidence: "88%", reason: "Thrives in black soil during monsoons with moderate water." });
      } else if (soil === "Clay Soil" || water === "High (Canal/River)") {
        recs.push({ name: "Paddy (Rice)", confidence: "96%", reason: "Clay soil holds standing water perfectly, making it ideal for Paddy cultivation." });
        recs.push({ name: "Sugarcane", confidence: "89%", reason: "Requires high water retention and nutrient-rich soil to maximize yield." });
      } else if (soil === "Sandy Soil" || water === "Low (Rainfed only)") {
        recs.push({ name: "Ragi (Finger Millet)", confidence: "92%", reason: "Highly drought-resistant and grows well in sandy, well-drained soils." });
        recs.push({ name: "Groundnut", confidence: "85%", reason: "Sandy soil allows the pegs to penetrate the ground easily for pod development." });
      } else {
        // Defaults for Loamy/Red
        recs.push({ name: "Maize", confidence: "91%", reason: "Loamy soil provides the perfect balance of drainage and nutrients for Maize." });
        recs.push({ name: "Tur Dal (Arhar)", confidence: "86%", reason: "A hardy crop that performs exceptionally well in moderate conditions." });
      }

      setResults(recs);
      setLoading(false);
    }, 1500); // 1.5 seconds loading simulation
  };
  const stopAll = () => {
  SpeechRecognition.stopListening();
  window.speechSynthesis.cancel();
};
const cleanResponse = (text) => {
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

  const submitAIQuery = async (voiceText = null) => {
  setAiLoading(true);
  setAiError("");
  setAiResult(null);

  const finalQuery =
    typeof voiceText === "string"
      ? voiceText
      : query;

  const promptText = finalQuery.trim()
    ? `Provide crop recommendation and farming advice based on soil type ${soil}, season ${season}, water availability ${water}. User query: ${finalQuery}`
    : `Provide crop recommendation and farming advice based on soil type ${soil}, season ${season}, water availability ${water}. Give a practical general recommendation for this farm profile.`;
      // ? `Provide crop recommendation and farming advice based on soil type ${soil}, season ${season}, water availability ${water}. User query: ${query}`
      // : `Provide crop recommendation and farming advice based on soil type ${soil}, season ${season}, water availability ${water}. Give a practical general recommendation for this farm profile.`;

    try {
      const response = await axios.post('http://localhost:5000/api/ai/text/', {
        prompt: promptText,
      });const cleaned = cleanResponse(response.data.result);

      setAiResult(cleaned);
      speak(cleaned);
    } catch (err) {
      setAiError(
        err.response?.data?.error || 'AI query failed. Please try again.'
      );
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerArea}>
        <div style={styles.sparkleIcon}>
          <Sparkles size={32} color="#fbbf24" />
        </div>
        <h1 style={styles.header}>{t("AI Crop Guide")}</h1>
        <p style={styles.subtitle}>
          {t("ai_subtitle")}
        </p>
      </div>

      <div style={styles.layout}>
        {/* Left Column - Input Form */}
        <div className="glass-panel" style={styles.formCard}>
          <div style={styles.cardHeader}>
            <Sprout size={20} color="var(--accent-primary)" />
            <h3 style={styles.cardTitle}>{t("Land Profile")}</h3>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>{t("Soil Type")}</label>
            <select style={styles.input} value={soil} onChange={(e) => setSoil(e.target.value)}>
              <option value="Loamy Soil">Loamy Soil</option>
              <option value="Clay Soil">Clay Soil</option>
              <option value="Sandy Soil">Sandy Soil</option>
              <option value="Black Soil">Black Soil</option>
              <option value="Red Soil">Red Soil</option>
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>{t("Current Season")}</label>
            <select style={styles.input} value={season} onChange={(e) => setSeason(e.target.value)}>
              <option value="Kharif (Monsoon)">Kharif (Monsoon)</option>
              <option value="Rabi (Winter)">Rabi (Winter)</option>
              <option value="Zaid (Summer)">Zaid (Summer)</option>
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>{t("Water Availability")}</label>
            <select style={styles.input} value={water} onChange={(e) => setWater(e.target.value)}>
              <option value="High (Canal/River)">High (Canal/River)</option>
              <option value="Medium (Some irrigation)">Medium (Some irrigation)</option>
              <option value="Low (Rainfed only)">Low (Rainfed only)</option>
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>{t("AI Query")}</label>
            <textarea
              style={styles.textarea}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask the AI for crop or soil recommendations..."
              rows={4}
            />
          </div>

          <button 
            style={styles.calculateBtn}
            onClick={generateRecommendations}
            disabled={loading || aiLoading}
          >
            {loading ? t("Analyzing...") : t("Get Recommendations")}
          </button>
          <button 
            type="button"
            style={styles.secondaryBtn}
            onClick={() => submitAIQuery()}
            disabled={aiLoading || loading}
          >
            {aiLoading ? t("Analyzing...") : "Ask AI for Advice"}
          </button>
        </div>

        {/* Right Column - Results / Empty State */}
        <div className="glass-panel" style={styles.resultCard}>
          
          {loading && (
            <div style={styles.emptyState}>
              <Loader2 size={48} color="var(--accent-primary)" className="spin-animation" style={{marginBottom: "24px"}} />
              <h2 style={styles.emptyStateTitle}>{t("Generating AI Insights...")}</h2>
              <p style={styles.emptyStateText}>{t("generating_sub")}</p>
            </div>
          )}

          {!loading && !results && !aiResult && (
            <div style={styles.emptyState}>
              <Sprout size={64} color="var(--text-muted)" style={{marginBottom: "24px", opacity: 0.5}} />
              <h2 style={styles.emptyStateTitle}>{t("Awaiting Input")}</h2>
              <p style={styles.emptyStateText}>
                {t("awaiting_sub")}
              </p>
            </div>
          )}

          {!loading && results && (
            <div style={styles.resultsContainer}>
              <h3 style={styles.resultsHeader}>
                <CheckCircle2 size={24} color="var(--accent-primary)" /> 
                {t("AI Recommendations")}
              </h3>
              
              <div style={styles.recsList}>
                {results.map((rec, index) => (
                  <div key={index} className="hover-3d-lift" style={styles.recCard}>
                    <div style={styles.recHeader}>
                      <h4 style={styles.recName}>{rec.name}</h4>
                      <div style={styles.confidenceBadge}>
                        {rec.confidence} {t("Match")}
                      </div>
                    </div>
                    <div style={styles.reasoningBox}>
                      <span style={styles.aiLabel}><Sparkles size={12}/> {t("AI REASONING")}</span>
                      <p style={styles.reasoningText}>{rec.reason}</p>
                    </div>
                  
  
                  </div>
                ))}
              </div>
              
            </div>
          )}
          <button
  type="button"
  style={styles.voiceBtnSecondary}
  onClick={stopAll}
>
  ⏹ Stop
</button>
          <div style={styles.voiceControls}>
            <button type="button" style={styles.voiceBtn} onClick={startListening}>
              🎤 Start
            </button>
            <button type="button" style={styles.voiceBtnSecondary} onClick={stopListening}>
              ⏹ Stop
            </button>
          </div>

          <p style={styles.voiceStatus}>{listening ? "Listening..." : "Not Listening"}</p>

          {!loading && aiResult && (
            <div style={styles.diseaseContainer}>
              <h3 style={styles.diseaseHeader}>AI Recommendation</h3>
              <div style={styles.diseaseBox}>
                <p style={styles.diseaseText}>{aiResult}</p>
              </div>
            </div>
          )}

          {!loading && (results || aiResult) && (
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
                borderRadius: "10px",
                fontWeight: "700",
                fontSize: "0.95rem",
                cursor: "pointer",
                marginTop: "16px",
                boxShadow: "0 2px 8px rgba(22, 163, 74, 0.25)"
              }}
              onClick={() =>
                generateFarmAdvisoryPdf({
                  farmerName: "Farmer",
                  village: "Karnataka",
                  crop: results?.[0]?.name || "Recommended Crop",
                  acres: 2,
                  season: season,
                  customAdvice: aiResult || results?.map(r => `${r.name}: ${r.reason}`).join('\n')
                })
              }
            >
              <Download size={18} /> Download Crop Advisory & Farm Card PDF
            </button>
          )}

          {!loading && aiError && (
            <div style={styles.errorBox}>{aiError}</div>
          )}
        </div>

      </div>

      <style>{`
        .spin-animation {
          animation: spin 1.5s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "var(--font-main)",
  },
  headerArea: {
    textAlign: "center",
    marginBottom: "48px",
    maxWidth: "600px",
    margin: "0 auto 48px auto",
  },
  sparkleIcon: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "16px",
  },
  header: {
    color: "var(--text-primary)",
    margin: "0 0 12px 0",
    fontSize: "36px",
    fontWeight: "700",
  },
  subtitle: {
    color: "var(--text-muted)",
    margin: 0,
    fontSize: "16px",
    lineHeight: "1.5",
  },
  layout: {
    display: "flex",
    gap: "32px",
    alignItems: "stretch",
  },
  formCard: {
    width: "360px",
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
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "32px",
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
    cursor: "pointer",
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
    cursor: "pointer",
    transition: "all 0.2s",
  },
  secondaryBtn: {
    marginTop: "16px",
    width: "100%",
    backgroundColor: "var(--bg-secondary)",
    color: "var(--text-primary)",
    border: "1px solid var(--border-color)",
    padding: "16px",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  textarea: {
    width: "100%",
    minHeight: "120px",
    resize: "vertical",
    padding: "14px 16px",
    borderRadius: "12px",
    border: "1px solid var(--border-color)",
    backgroundColor: "var(--bg-main)",
    color: "var(--text-primary)",
    fontSize: "15px",
    outline: "none",
    transition: "border-color 0.2s",
  },
  voiceControls: {
    display: "flex",
    gap: "10px",
    marginTop: "12px",
  },
  voiceBtn: {
    flex: 1,
    padding: "10px 12px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "var(--accent-primary)",
    color: "var(--text-on-primary)",
    fontWeight: "600",
    cursor: "pointer",
  },
  voiceBtnSecondary: {
    flex: 1,
    padding: "10px 12px",
    borderRadius: "10px",
    border: "1px solid var(--border-color)",
    backgroundColor: "var(--bg-main)",
    color: "var(--text-primary)",
    fontWeight: "600",
    cursor: "pointer",
  },
  voiceStatus: {
    margin: "8px 0 0 0",
    color: "var(--text-secondary)",
    fontSize: "14px",
  },
  diseaseContainer: {
    marginTop: "24px",
  },
  diseaseHeader: {
    margin: "0 0 12px 0",
    fontSize: "20px",
    color: "var(--text-primary)",
  },
  diseaseBox: {
    backgroundColor: "var(--bg-main)",
    border: "1px solid var(--border-color)",
    borderRadius: "16px",
    padding: "24px",
  },
  diseaseText: {
    color: "var(--text-primary)",
    lineHeight: "1.7",
    whiteSpace: "pre-wrap",
  },
  errorBox: {
    marginTop: "24px",
    backgroundColor: "rgba(248, 113, 113, 0.12)",
    color: "var(--danger)",
    padding: "18px",
    borderRadius: "14px",
    border: "1px solid rgba(248, 113, 113, 0.25)",
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
  resultsHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    color: "var(--text-primary)",
    fontSize: "24px",
    margin: "0 0 32px 0",
  },
  recsList: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  recCard: {
    backgroundColor: "var(--bg-main)",
    border: "1px solid var(--border-color)",
    borderRadius: "12px",
    padding: "24px",
  },
  recHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  recName: {
    margin: 0,
    fontSize: "22px",
    color: "var(--text-primary)",
    fontWeight: "600",
  },
  confidenceBadge: {
    backgroundColor: "rgba(52, 211, 153, 0.15)",
    color: "var(--accent-primary)",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "700",
  },
  reasoningBox: {
    backgroundColor: "rgba(251, 191, 36, 0.05)",
    borderLeft: "3px solid #fbbf24",
    padding: "16px",
    borderRadius: "0 8px 8px 0",
  },
  aiLabel: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    color: "#fbbf24",
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "1px",
    marginBottom: "8px",
  },
  reasoningText: {
    margin: 0,
    color: "var(--text-secondary)",
    fontSize: "14px",
    lineHeight: "1.6",
  }
};

export default Recommend;
