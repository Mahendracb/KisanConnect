import React, { useState, useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import axios from "axios";
import {
  Sparkles,
  Sprout,
  Loader2,
  CheckCircle2,
  Download,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  RotateCcw,
  Key,
  ShieldAlert
} from "lucide-react";
import { useLanguage } from "../LanguageContext";
import { generateFarmAdvisoryPdf } from "../utils/generatePdf";

function Recommend() {
  const { t, isKannada } = useLanguage();

  // Farm Profile State
  const [soil, setSoil] = useState("Loamy Soil");
  const [season, setSeason] = useState("Kharif (Monsoon)");
  const [water, setWater] = useState("Medium (Some irrigation)");
  const [query, setQuery] = useState("");

  // Custom API Key (stored in localStorage)
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [customApiKey, setCustomApiKey] = useState(() => localStorage.getItem("farmx_gemini_key") || "");

  // AI Advisory State
  const [aiResult, setAiResult] = useState(null);
  const [aiSource, setAiSource] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  // Rule-based Recommendations State
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  // Audio / Speech Synthesis State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Speech-to-Text Recognition Hook
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  // Sync speech transcript with query textarea
  useEffect(() => {
    if (transcript) {
      setQuery(transcript);
    }
  }, [transcript]);

  // Handle Speech Recognition Toggle
  const toggleListening = () => {
    if (!browserSupportsSpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.");
      return;
    }

    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      try {
        SpeechRecognition.startListening({
          continuous: false,
          language: isKannada ? "kn-IN" : "en-IN"
        });
      } catch (err) {
        console.error("Speech recognition error:", err);
      }
    }
  };

  // Safe Text-to-Speech (TTS)
  const toggleAudio = (textToSpeak) => {
    if (!('speechSynthesis' in window)) {
      alert("Text-to-Speech is not supported in your browser.");
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak || aiResult);
      utterance.lang = isKannada ? "kn-IN" : "en-IN";
      utterance.rate = 0.95;

      utterance.onend = () => {
        setIsPlayingAudio(false);
      };

      utterance.onerror = () => {
        setIsPlayingAudio(false);
      };

      setIsPlayingAudio(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Stop any playing audio when unmounting
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Submit query to AI Crop Advisory Endpoint
  const submitAIQuery = async (e) => {
    if (e) e.preventDefault();
    setAiLoading(true);
    setAiError("");
    setAiResult(null);
    setAiSource(null);

    if (isPlayingAudio && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }

    const promptText = query.trim()
      ? `Soil type: ${soil}, Growing season: ${season}, Water availability: ${water}. Question: ${query.trim()}`
      : `Provide comprehensive crop recommendation and farming advice for: Soil type: ${soil}, Growing season: ${season}, Water availability: ${water}. Recommend best crops, fertilizer schedule, and spray safety.`;

    try {
      const response = await axios.post("http://localhost:5000/api/ai/text", {
        prompt: promptText,
        apiKey: customApiKey.trim() || undefined
      });

      if (response.data && response.data.result) {
        setAiResult(response.data.result);
        setAiSource(response.data.source || (response.data.model ? `Gemini (${response.data.model})` : 'AI Agronomy Engine'));
      } else {
        setAiError("Received empty response from AI engine. Please try again.");
      }
    } catch (err) {
      console.error("AI Query Error:", err);
      const msg = err.response?.data?.error || err.message || "Failed to reach AI service. Please check your network connection.";
      setAiError(msg);
    } finally {
      setAiLoading(false);
    }
  };

  // Rule-based quick matching
  const generateRecommendations = () => {
    setLoading(true);
    setResults(null);
    setAiError("");

    setTimeout(() => {
      let recs = [];
      if (soil === "Black Soil") {
        recs.push({ name: "Cotton", confidence: "94%", reason: "Black soil retains moisture excellently, perfect for cotton's deep root system." });
        if (season === "Kharif (Monsoon)") recs.push({ name: "Soybean", confidence: "88%", reason: "Thrives in black soil during monsoons with moderate water." });
      } else if (soil === "Clay Soil" || water === "High (Canal/River)") {
        recs.push({ name: "Paddy (Rice)", confidence: "96%", reason: "Clay soil holds standing water perfectly, ideal for paddy transplanting." });
        recs.push({ name: "Sugarcane", confidence: "89%", reason: "Requires high water retention and deep nutrient-rich soil." });
      } else if (soil === "Sandy Soil" || water === "Low (Rainfed only)") {
        recs.push({ name: "Ragi (Finger Millet)", confidence: "92%", reason: "Highly drought-resistant and flourishes in well-drained sandy/red soils." });
        recs.push({ name: "Groundnut", confidence: "85%", reason: "Sandy loam allows easy peg penetration for high pod yield." });
      } else {
        recs.push({ name: "Maize", confidence: "91%", reason: "Loamy soil provides optimal drainage and organic matter for maize." });
        recs.push({ name: "Tur Dal (Red Gram)", confidence: "86%", reason: "Hardy legume that enriches soil nitrogen." });
      }
      setResults(recs);
      setLoading(false);
    }, 1000);
  };

  const handleSaveApiKey = (val) => {
    setCustomApiKey(val);
    if (val.trim()) {
      localStorage.setItem("farmx_gemini_key", val.trim());
    } else {
      localStorage.removeItem("farmx_gemini_key");
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.headerArea}>
        <div style={styles.sparkleIcon}>
          <Sparkles size={36} color="var(--accent-primary)" />
        </div>
        <h1 style={styles.header}>{t("AI Crop Guide")}</h1>
        <p style={styles.subtitle}>
          {isKannada
            ? "ನಿಮ್ಮ ಮಣ್ಣು, ಋತು ಮತ್ತು ನೀರಿನ ಲಭ್ಯತೆಗೆ ತಕ್ಕಂತೆ ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ (AI) ಬೆಳೆ ಸಲಹೆ ಪಡೆಯಿರಿ."
            : "Bilingual AI agronomist providing tailored crop guidance, fertilizer ratios, and spray timing."}
        </p>
      </div>

      <div style={styles.layout}>
        {/* Left Column: Farm Profile & Query Form */}
        <div className="glass-panel" style={styles.formCard}>
          <div style={styles.cardHeader}>
            <Sprout size={22} color="var(--accent-primary)" />
            <h3 style={styles.cardTitle}>{t("Land Profile")}</h3>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>{t("Soil Type")}</label>
            <select style={styles.input} value={soil} onChange={(e) => setSoil(e.target.value)}>
              <option value="Loamy Soil">Loamy Soil (ಗೋಡು ಮಣ್ಣು)</option>
              <option value="Clay Soil">Clay Soil (ಜೇಡಿ ಮಣ್ಣು)</option>
              <option value="Sandy Soil">Sandy Soil (ಮರಳು ಮಣ್ಣು)</option>
              <option value="Black Soil">Black Soil (ಕಪ್ಪು ಮಣ್ಣು)</option>
              <option value="Red Soil">Red Soil (ಕೆಂಪು ಮಣ್ಣು)</option>
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>{t("Current Season")}</label>
            <select style={styles.input} value={season} onChange={(e) => setSeason(e.target.value)}>
              <option value="Kharif (Monsoon)">Kharif / Monsoon (ಮುಂಗಾರು)</option>
              <option value="Rabi (Winter)">Rabi / Winter (ಹಿಂಗಾರು)</option>
              <option value="Zaid (Summer)">Zaid / Summer (ಬೇಸಿಗೆ)</option>
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>{t("Water Availability")}</label>
            <select style={styles.input} value={water} onChange={(e) => setWater(e.target.value)}>
              <option value="High (Canal/River)">High (Canal / River Irrigation)</option>
              <option value="Medium (Some irrigation)">Medium (Borewell / Drip Irrigation)</option>
              <option value="Low (Rainfed only)">Low (Rainfed / Dryland)</option>
            </select>
          </div>

          <div style={styles.inputGroup}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <label style={{ ...styles.label, margin: 0 }}>{t("AI Query")}</label>
              <button
                type="button"
                style={{
                  ...styles.micToggleBtn,
                  backgroundColor: listening ? "rgba(239, 68, 68, 0.15)" : "rgba(52, 211, 153, 0.15)",
                  color: listening ? "#ef4444" : "var(--accent-primary)",
                  borderColor: listening ? "#ef4444" : "var(--accent-primary)"
                }}
                onClick={toggleListening}
                title={listening ? "Click to stop listening" : "Click to speak in Kannada or English"}
              >
                {listening ? <MicOff size={14} /> : <Mic size={14} />}
                <span>{listening ? "Listening..." : "Voice Mic"}</span>
              </button>
            </div>

            <textarea
              style={styles.textarea}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={isKannada ? "ಉದಾ: ಟೊಮ್ಯಾಟೊ ರೋಗ ಅಥವಾ ಯೂರಿಯಾ ಗೊಬ್ಬರ ನೀಡುವ ವಿಧಾನ ಕೇಳಿ..." : "e.g. Which fertilizer schedule for tomato? How to treat blast in paddy?"}
              rows={4}
            />
          </div>

          {/* Action Buttons */}
          <button
            type="button"
            style={styles.aiPrimaryBtn}
            onClick={submitAIQuery}
            disabled={aiLoading || loading}
          >
            {aiLoading ? (
              <>
                <Loader2 size={18} className="spin-animation" />
                <span>{isKannada ? "ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ..." : "Consulting AI..."}</span>
              </>
            ) : (
              <>
                <Sparkles size={18} />
                <span>{isKannada ? "AI ಕೃಷಿ ಸಲಹೆ ಪಡೆಯಿರಿ" : "Ask AI Agronomist"}</span>
              </>
            )}
          </button>

          <button
            type="button"
            style={styles.ruleBtn}
            onClick={generateRecommendations}
            disabled={loading || aiLoading}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="spin-animation" />
                <span>Matching...</span>
              </>
            ) : (
              <span>Quick Match by Soil/Season</span>
            )}
          </button>

          {/* Optional Custom Gemini Key Section */}
          <div style={{ marginTop: "16px", borderTop: "1px solid var(--border-color)", paddingTop: "12px" }}>
            <button
              type="button"
              style={styles.settingsToggle}
              onClick={() => setShowApiKeyInput(!showApiKeyInput)}
            >
              <Key size={13} />
              <span>{showApiKeyInput ? "Hide Gemini API Key" : "Custom Gemini API Key (Optional)"}</span>
            </button>

            {showApiKeyInput && (
              <div style={{ marginTop: "8px" }}>
                <input
                  type="password"
                  style={styles.keyInput}
                  value={customApiKey}
                  onChange={(e) => handleSaveApiKey(e.target.value)}
                  placeholder="Paste Google Gemini API Key (AIzaSy...)"
                />
                <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: "4px 0 0 0" }}>
                  Leave blank to use the server's intelligent agronomy engine.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: AI & Recommendation Results */}
        <div className="glass-panel" style={styles.resultCard}>
          {/* 1. Loading State */}
          {(aiLoading || loading) && (
            <div style={styles.emptyState}>
              <div style={styles.loaderRing}>
                <Loader2 size={48} color="var(--accent-primary)" className="spin-animation" />
              </div>
              <h2 style={styles.emptyStateTitle}>
                {aiLoading
                  ? (isKannada ? "AI ಕೃಷಿ ವಿಜ್ಞಾನಿ ಸಲಹೆ ಸಿದ್ಧಪಡಿಸುತ್ತಿದ್ದಾರೆ..." : "Consulting AI Agricultural Scientist...")
                  : t("Generating AI Insights...")}
              </h2>
              <p style={styles.emptyStateText}>
                {isKannada
                  ? "ನಿಮ್ಮ ಮಣ್ಣು, ಋತು ಮತ್ತು ಬೆಳೆ ನಿಯತಾಂಕಗಳನ್ನು ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ..."
                  : "Synthesizing soil composition, seasonal temperature, N-P-K nutrient schedules, and spray safety."}
              </p>
            </div>
          )}

          {/* 2. Error State */}
          {!aiLoading && !loading && aiError && (
            <div style={styles.errorBox}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                <ShieldAlert size={22} color="#ef4444" />
                <strong style={{ fontSize: "16px" }}>AI Assistant Error</strong>
              </div>
              <p style={{ margin: "0 0 12px 0", lineHeight: "1.5" }}>{aiError}</p>
              <button
                type="button"
                style={styles.retryBtn}
                onClick={submitAIQuery}
              >
                <RotateCcw size={14} /> Retry Query
              </button>
            </div>
          )}

          {/* 3. Empty State (No input yet) */}
          {!aiLoading && !loading && !results && !aiResult && !aiError && (
            <div style={styles.emptyState}>
              <Sprout size={56} color="var(--text-muted)" style={{ marginBottom: "20px", opacity: 0.6 }} />
              <h2 style={styles.emptyStateTitle}>{t("Awaiting Input")}</h2>
              <p style={styles.emptyStateText}>
                {isKannada
                  ? "ಎಡಭಾಗದಲ್ಲಿ ನಿಮ್ಮ ಜಮೀನಿನ ವಿವರಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ 'AI ಕೃಷಿ ಸಲಹೆ ಪಡೆಯಿರಿ' ಕ್ಲಿಕ್ ಮಾಡಿ."
                  : "Select your land parameters and enter your query, then click 'Ask AI Agronomist'."}
              </p>
            </div>
          )}

          {/* 4. AI Advisory Output Card */}
          {!aiLoading && aiResult && (
            <div style={styles.aiResultCard}>
              <div style={styles.aiHeaderRow}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={styles.aiIconBadge}>
                    <Sparkles size={18} color="var(--accent-primary)" />
                  </div>
                  <div>
                    <h3 style={styles.aiResultTitle}>
                      {isKannada ? "AI ಕೃಷಿ ವಿಜ್ಞಾನಿಗಳ ಶಿಫಾರಸು" : "AI Agronomist Recommendation"}
                    </h3>
                    {aiSource && (
                      <span style={styles.sourceBadge}>
                        Source: {aiSource}
                      </span>
                    )}
                  </div>
                </div>

                {/* Audio Playback Button */}
                <button
                  type="button"
                  style={{
                    ...styles.audioBtn,
                    backgroundColor: isPlayingAudio ? "#ef4444" : "var(--accent-primary)",
                    color: "#fff"
                  }}
                  onClick={() => toggleAudio(aiResult)}
                  title={isPlayingAudio ? "Stop reading" : "Listen aloud"}
                >
                  {isPlayingAudio ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  <span>{isPlayingAudio ? "Stop Audio" : "Listen Audio"}</span>
                </button>
              </div>

              {/* Formatted Text Box */}
              <div style={styles.aiContentBox}>
                <pre style={styles.aiTextPre}>{aiResult}</pre>
              </div>

              {/* Download Official PDF */}
              <button
                type="button"
                style={styles.downloadPdfBtn}
                onClick={() =>
                  generateFarmAdvisoryPdf({
                    farmerName: "Farmer",
                    village: "Karnataka",
                    crop: results?.[0]?.name || "Cultivated Crop",
                    acres: 2,
                    season: season,
                    customAdvice: aiResult
                  })
                }
              >
                <Download size={18} /> Download Official Farm Advisory & Soil Health Card (PDF)
              </button>
            </div>
          )}

          {/* 5. Rule-Based Recommendations List */}
          {!loading && results && (
            <div style={{ ...styles.resultsContainer, marginTop: aiResult ? "24px" : "0" }}>
              <h3 style={styles.resultsHeader}>
                <CheckCircle2 size={22} color="var(--accent-primary)" />
                <span>{t("AI Recommendations")} (Soil & Season Matches)</span>
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
                      <span style={styles.aiLabel}><Sparkles size={12} /> {t("AI REASONING")}</span>
                      <p style={styles.reasoningText}>{rec.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .spin-animation {
          animation: spin 1.2s linear infinite;
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
    maxWidth: "1280px",
    margin: "0 auto",
    padding: "16px 0"
  },
  headerArea: {
    textAlign: "center",
    marginBottom: "36px",
    maxWidth: "700px",
    margin: "0 auto 36px auto",
  },
  sparkleIcon: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "12px",
  },
  header: {
    color: "var(--text-primary)",
    margin: "0 0 8px 0",
    fontSize: "32px",
    fontWeight: "800",
    letterSpacing: "-0.5px"
  },
  subtitle: {
    color: "var(--text-muted)",
    margin: 0,
    fontSize: "15px",
    lineHeight: "1.6",
  },
  layout: {
    display: "flex",
    gap: "28px",
    alignItems: "flex-start",
  },
  formCard: {
    width: "380px",
    padding: "28px",
    borderRadius: "20px",
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
    boxShadow: "0 12px 36px rgba(0, 0, 0, 0.08)",
  },
  resultCard: {
    flex: 1,
    minHeight: "560px",
    borderRadius: "20px",
    padding: "32px",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 12px 36px rgba(0, 0, 0, 0.08)",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "24px",
  },
  cardTitle: {
    margin: 0,
    fontSize: "19px",
    color: "var(--text-primary)",
    fontWeight: "700",
  },
  inputGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    color: "var(--text-secondary)",
    fontSize: "13px",
    marginBottom: "8px",
    fontWeight: "600",
  },
  input: {
    width: "100%",
    backgroundColor: "var(--bg-main)",
    border: "1px solid var(--border-color)",
    padding: "12px 14px",
    borderRadius: "12px",
    color: "var(--text-primary)",
    fontSize: "14px",
    outline: "none",
    cursor: "pointer",
  },
  textarea: {
    width: "100%",
    backgroundColor: "var(--bg-main)",
    border: "1px solid var(--border-color)",
    padding: "12px 14px",
    borderRadius: "12px",
    color: "var(--text-primary)",
    fontSize: "14px",
    outline: "none",
    resize: "vertical",
    minHeight: "90px",
    lineHeight: "1.5"
  },
  micToggleBtn: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    padding: "4px 10px",
    borderRadius: "8px",
    border: "1px solid",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s"
  },
  aiPrimaryBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    width: "100%",
    backgroundColor: "var(--accent-primary)",
    color: "var(--text-on-primary)",
    border: "none",
    padding: "14px 20px",
    borderRadius: "12px",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 4px 16px rgba(52, 211, 153, 0.35)",
    transition: "all 0.2s ease",
    marginBottom: "10px"
  },
  ruleBtn: {
    width: "100%",
    backgroundColor: "transparent",
    color: "var(--text-secondary)",
    border: "1px solid var(--border-color)",
    padding: "11px",
    borderRadius: "12px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s"
  },
  settingsToggle: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    background: "none",
    border: "none",
    color: "var(--text-muted)",
    fontSize: "12px",
    cursor: "pointer",
    padding: 0,
    fontWeight: "500"
  },
  keyInput: {
    width: "100%",
    backgroundColor: "var(--bg-main)",
    border: "1px solid var(--border-color)",
    padding: "8px 10px",
    borderRadius: "8px",
    color: "var(--text-primary)",
    fontSize: "12px",
    outline: "none"
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "360px",
    textAlign: "center",
    padding: "40px 20px"
  },
  emptyStateTitle: {
    color: "var(--text-primary)",
    fontSize: "22px",
    fontWeight: "700",
    margin: "0 0 10px 0",
  },
  emptyStateText: {
    color: "var(--text-muted)",
    fontSize: "14px",
    maxWidth: "460px",
    margin: 0,
    lineHeight: "1.6"
  },
  loaderRing: {
    marginBottom: "20px",
    padding: "16px",
    borderRadius: "50%",
    backgroundColor: "rgba(52, 211, 153, 0.1)"
  },
  errorBox: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    borderRadius: "16px",
    padding: "24px",
    color: "var(--text-primary)",
    marginBottom: "20px"
  },
  retryBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    backgroundColor: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer"
  },
  aiResultCard: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    animation: "fadeIn 0.3s ease-in-out"
  },
  aiHeaderRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid var(--border-color)",
    paddingBottom: "16px"
  },
  aiIconBadge: {
    width: "38px",
    height: "38px",
    borderRadius: "10px",
    backgroundColor: "rgba(52, 211, 153, 0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  aiResultTitle: {
    margin: 0,
    fontSize: "19px",
    fontWeight: "700",
    color: "var(--text-primary)"
  },
  sourceBadge: {
    fontSize: "12px",
    color: "var(--accent-primary)",
    fontWeight: "600"
  },
  audioBtn: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    border: "none",
    padding: "8px 14px",
    borderRadius: "10px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)"
  },
  aiContentBox: {
    backgroundColor: "var(--bg-main)",
    border: "1px solid var(--border-color)",
    borderRadius: "16px",
    padding: "24px",
    overflowX: "auto"
  },
  aiTextPre: {
    margin: 0,
    fontFamily: "var(--font-main)",
    fontSize: "14px",
    lineHeight: "1.75",
    color: "var(--text-primary)",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word"
  },
  downloadPdfBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    width: "100%",
    padding: "13px 20px",
    backgroundColor: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontWeight: "700",
    fontSize: "14px",
    cursor: "pointer",
    boxShadow: "0 4px 14px rgba(22, 163, 74, 0.3)",
    transition: "all 0.2s"
  },
  resultsContainer: {
    marginTop: "20px"
  },
  resultsHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    margin: "0 0 16px 0",
    fontSize: "18px",
    fontWeight: "700",
    color: "var(--text-primary)"
  },
  recsList: {
    display: "flex",
    flexDirection: "column",
    gap: "14px"
  },
  recCard: {
    backgroundColor: "var(--bg-main)",
    border: "1px solid var(--border-color)",
    borderRadius: "14px",
    padding: "20px"
  },
  recHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px"
  },
  recName: {
    margin: 0,
    fontSize: "17px",
    fontWeight: "700",
    color: "var(--text-primary)"
  },
  confidenceBadge: {
    backgroundColor: "rgba(52, 211, 153, 0.15)",
    color: "var(--accent-primary)",
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700"
  },
  reasoningBox: {
    display: "flex",
    flexDirection: "column",
    gap: "4px"
  },
  aiLabel: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    color: "var(--accent-primary)",
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "0.5px"
  },
  reasoningText: {
    margin: 0,
    color: "var(--text-secondary)",
    fontSize: "13px",
    lineHeight: "1.6"
  }
};

export default Recommend;
