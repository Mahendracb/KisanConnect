import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  CloudSun, 
  Wind, 
  Droplets, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  MapPin, 
  Clock, 
  Calendar,
  Compass,
  RefreshCw,
  Thermometer
} from "lucide-react";
import { useLanguage } from "../LanguageContext";

function WeatherAdvisory() {
  const { language } = useLanguage();
  const [district, setDistrict] = useState("Mandya");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locating, setLocating] = useState(false);

  const fetchWeather = async (distName, lat, lon) => {
    setLoading(true);
    setError(null);
    try {
      let url = `http://localhost:5000/api/weather?district=${encodeURIComponent(distName)}`;
      if (lat && lon) {
        url = `http://localhost:5000/api/weather?lat=${lat}&lon=${lon}&district=${encodeURIComponent(distName)}`;
      }
      const response = await axios.get(url);
      setWeatherData(response.data);
    } catch (err) {
      console.error("Error fetching weather advisory:", err);
      setError("Failed to fetch weather data. Please ensure the backend is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(district);
  }, [district]);

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeather("GPS Location", latitude, longitude);
        setLocating(false);
      },
      (err) => {
        alert("Unable to retrieve your location. Defaulting to selected district.");
        setLocating(false);
      }
    );
  };

  const spray = weatherData?.sprayAdvisory;
  const isKannada = language === 'kn';

  return (
    <div style={styles.container}>
      {/* Header Bar */}
      <div style={styles.headerRow}>
        <div>
          <h1 style={styles.title}>
            <CloudSun size={32} color="#16a34a" style={{ verticalAlign: 'middle', marginRight: 10 }} />
            {isKannada ? "ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ ಮತ್ತು ಸಿಂಪಡಣೆ ಸಲಹೆ" : "Hyper-Local Weather & Spray Advisory"}
          </h1>
          <p style={styles.subtitle}>
            {isKannada 
              ? "ನಿಮ್ಮ ತಾಲೂಕಿನ ನಿಖರ ಹವಾಮಾನ ಆಧರಿಸಿ ರಸಗೊಬ್ಬರ ಮತ್ತು ಕೀಟನಾಶಕ ಸಿಂಪಡಣೆಗೆ ಸೂಕ್ತ ಮಾರ್ಗದರ್ಶನ."
              : "Smart meteorological guidance to prevent chemical wastage and protect crop yield."}
          </p>
        </div>

        {/* District Selector & GPS */}
        <div style={styles.controlBar}>
          <div style={styles.selectWrapper}>
            <MapPin size={18} color="#16a34a" style={{ marginLeft: 12 }} />
            <select
              style={styles.districtSelect}
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
            >
              {weatherData?.districtsList ? (
                weatherData.districtsList.map((d) => (
                  <option key={d} value={d}>
                    {d} District
                  </option>
                ))
              ) : (
                <option value="Mandya">Mandya District</option>
              )}
            </select>
          </div>

          <button
            style={styles.gpsBtn}
            onClick={handleUseLocation}
            disabled={locating}
            title="Use Device GPS"
          >
            <Compass size={18} />
            {locating ? (isKannada ? "ಪತ್ತೆಮಾಡಲಾಗುತ್ತಿದೆ..." : "Locating...") : (isKannada ? "ನನ್ನ ಸ್ಥಳ" : "My GPS")}
          </button>

          <button
            style={styles.refreshBtn}
            onClick={() => fetchWeather(district)}
            title="Refresh Live Data"
          >
            <RefreshCw size={18} className={loading ? "spin" : ""} />
          </button>
        </div>
      </div>

      {error && <div style={styles.errorBox}>{error}</div>}

      {loading && !weatherData ? (
        <div style={styles.loadingBox}>
          <RefreshCw size={36} color="#16a34a" className="spin" />
          <p style={{ marginTop: 14, color: '#4b5563', fontWeight: 600 }}>
            {isKannada ? "ಹವಾಮಾನ ದತ್ತಾಂಶ ಲೋಡ್ ಆಗುತ್ತಿದೆ..." : "Fetching live satellite weather data..."}
          </p>
        </div>
      ) : weatherData ? (
        <>
          {/* SMART SPRAY ADVISORY HERO BANNER */}
          <div
            style={{
              ...styles.advisoryBanner,
              backgroundColor:
                spray?.bannerColor === 'green'
                  ? '#ecfdf5'
                  : spray?.bannerColor === 'yellow'
                  ? '#fffbeb'
                  : '#fef2f2',
              borderColor:
                spray?.bannerColor === 'green'
                  ? '#10b981'
                  : spray?.bannerColor === 'yellow'
                  ? '#f59e0b'
                  : '#ef4444'
            }}
          >
            <div style={styles.advisoryIconCol}>
              {spray?.status === 'safe' ? (
                <CheckCircle2 size={46} color="#059669" />
              ) : spray?.status === 'caution' ? (
                <AlertTriangle size={46} color="#d97706" />
              ) : (
                <XCircle size={46} color="#dc2626" />
              )}
            </div>

            <div style={styles.advisoryContentCol}>
              <div style={styles.bannerBadgeRow}>
                <span
                  style={{
                    ...styles.badge,
                    backgroundColor:
                      spray?.bannerColor === 'green'
                        ? '#059669'
                        : spray?.bannerColor === 'yellow'
                        ? '#d97706'
                        : '#dc2626'
                  }}
                >
                  {spray?.status === 'safe' ? 'SAFE TO SPRAY' : spray?.status === 'caution' ? 'CAUTION' : 'SPRAYING RESTRICTED'}
                </span>
                <span style={styles.timeWindowTag}>
                  <Clock size={14} style={{ marginRight: 5, verticalAlign: 'middle' }} />
                  {spray?.bestTimeWindow}
                </span>
              </div>

              <h2 style={{ ...styles.bannerTitle, color: spray?.bannerColor === 'green' ? '#065f46' : spray?.bannerColor === 'yellow' ? '#92400e' : '#991b1b' }}>
                {isKannada ? spray?.kannadaTitle : spray?.bannerTitle}
              </h2>

              <p style={{ ...styles.bannerText, color: spray?.bannerColor === 'green' ? '#047857' : spray?.bannerColor === 'yellow' ? '#b45309' : '#b91c1c' }}>
                {isKannada ? spray?.kannadaRecommendation : spray?.recommendation}
              </p>

              {spray?.alerts && spray.alerts.length > 0 && (
                <div style={styles.alertTagsRow}>
                  {spray.alerts.map((al, idx) => (
                    <div key={idx} style={styles.alertPill}>
                      <AlertTriangle size={14} color="#b45309" style={{ marginRight: 6 }} />
                      <strong>{al.title}:</strong> {al.desc}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* CURRENT WEATHER METRICS CARDS */}
          <div style={styles.metricsGrid}>
            <div style={styles.metricCard}>
              <div style={styles.metricHeader}>
                <Thermometer size={22} color="#f97316" />
                <span style={styles.metricLabel}>{isKannada ? "ತಾಪಮಾನ" : "Temperature"}</span>
              </div>
              <div style={styles.metricValue}>{Math.round(weatherData.current.temp)}°C</div>
              <div style={styles.metricSub}>{weatherData.current.condition}</div>
            </div>

            <div style={styles.metricCard}>
              <div style={styles.metricHeader}>
                <Droplets size={22} color="#3b82f6" />
                <span style={styles.metricLabel}>{isKannada ? "ಗಾಳಿಯ ತೇವಾಂಶ" : "Humidity"}</span>
              </div>
              <div style={styles.metricValue}>{weatherData.current.humidity}%</div>
              <div style={styles.metricSub}>
                {weatherData.current.humidity > 75 
                  ? (isKannada ? "ಅಧಿಕ (ಶಿಲೀಂಧ್ರ ಅಪಾಯ)" : "High (Fungal threat)")
                  : (isKannada ? "ಸಾಮಾನ್ಯ" : "Normal")}
              </div>
            </div>

            <div style={styles.metricCard}>
              <div style={styles.metricHeader}>
                <Wind size={22} color="#06b6d4" />
                <span style={styles.metricLabel}>{isKannada ? "ಗಾಳಿಯ ವೇಗ" : "Wind Speed"}</span>
              </div>
              <div style={styles.metricValue}>{Math.round(weatherData.current.windSpeed)} km/h</div>
              <div style={styles.metricSub}>
                {weatherData.current.windSpeed < 12 
                  ? (isKannada ? "ಶಾಂತ (ಸಿಂಪಡಣೆಗೆ ಸೂಕ್ತ)" : "Gentle (Ideal for spraying)")
                  : (isKannada ? "ವೇಗದ ಗಾಳಿ (ಪೋಲಾಗುವ ಅಪಾಯ)" : "Gusty (Drift Risk)")}
              </div>
            </div>

            <div style={styles.metricCard}>
              <div style={styles.metricHeader}>
                <CloudSun size={22} color="#8b5cf6" />
                <span style={styles.metricLabel}>{isKannada ? "ಮಳೆಯ ಸಾಧ್ಯತೆ" : "Rain Probability"}</span>
              </div>
              <div style={styles.metricValue}>{weatherData.forecast7Days[0]?.rainProbability || 0}%</div>
              <div style={styles.metricSub}>
                {weatherData.forecast7Days[0]?.rainProbability > 40 
                  ? (isKannada ? "ಮಳೆಯಾಗುವ ಸಂಭವವಿದೆ" : "Rain Likely Today") 
                  : (isKannada ? "ಶುಷ್ಕ ವಾತಾವರಣ" : "Dry Skies")}
              </div>
            </div>
          </div>

          {/* HOURLY SPRAY SUITABILITY BAR */}
          {weatherData.hourlySprayGuide && weatherData.hourlySprayGuide.length > 0 && (
            <div style={styles.sectionCard}>
              <h3 style={styles.sectionHeading}>
                <Clock size={20} color="#16a34a" style={{ verticalAlign: 'middle', marginRight: 8 }} />
                {isKannada ? "ಮುಂದಿನ 12 ಗಂಟೆಗಳ ಸಿಂಪಡಣೆ ಸಮಯ ಕೋಷ್ಟಕ" : "Next 12 Hours Spraying Suitability Timeline"}
              </h3>
              <p style={styles.sectionDesc}>
                {isKannada 
                  ? "ಹಸಿರು (ಸುರಕ್ಷಿತ), ಹಳದಿ (ಎಚ್ಚರಿಕೆ), ಕೆಂಪು (ಸಿಂಪಡಿಸಬೇಡಿ)."
                  : "Color indicators reflect hourly wind, rain risk, and thermal evaporation."}
              </p>

              <div style={styles.hourlyScroll}>
                {weatherData.hourlySprayGuide.map((h, idx) => (
                  <div 
                    key={idx} 
                    style={{
                      ...styles.hourTile,
                      borderColor: h.status === 'safe' ? '#10b981' : h.status === 'caution' ? '#f59e0b' : '#ef4444',
                      backgroundColor: h.status === 'safe' ? '#f0fdf4' : h.status === 'caution' ? '#fffbeb' : '#fef2f2'
                    }}
                  >
                    <span style={styles.hourTime}>{h.time}</span>
                    <div 
                      style={{
                        ...styles.hourIndicator,
                        backgroundColor: h.status === 'safe' ? '#10b981' : h.status === 'caution' ? '#f59e0b' : '#ef4444'
                      }}
                    />
                    <span style={styles.hourTemp}>{h.temp}°C</span>
                    <span style={styles.hourWind}><Wind size={11} style={{ marginRight: 2 }} />{h.windSpeed}k</span>
                    <span style={styles.hourRain}><Droplets size={11} style={{ marginRight: 2 }} />{h.rainProb}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7-DAY EXTENDED FORECAST CARDS */}
          <div style={styles.sectionCard}>
            <h3 style={styles.sectionHeading}>
              <Calendar size={20} color="#16a34a" style={{ verticalAlign: 'middle', marginRight: 8 }} />
              {isKannada ? "7 ದಿನಗಳ ವಿಸ್ತೃತ ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ" : "7-Day Extended Agricultural Forecast"}
            </h3>

            <div style={styles.forecastGrid}>
              {weatherData.forecast7Days.map((f, idx) => (
                <div key={idx} style={styles.forecastCard}>
                  <div style={styles.fDate}>{idx === 0 ? (isKannada ? "ಇಂದು" : "Today") : f.dayName}</div>
                  <div style={styles.fSubDate}>{f.date.slice(5)}</div>
                  <div style={styles.fConditionBadge}>{f.condition}</div>
                  <div style={styles.fTempRow}>
                    <span style={styles.fMaxTemp}>{f.maxTemp}°</span>
                    <span style={styles.fMinTemp}>/ {f.minTemp}°C</span>
                  </div>
                  <div style={styles.fMetaRow}>
                    <span><Droplets size={12} color="#3b82f6" /> {f.rainProbability}%</span>
                    <span><Wind size={12} color="#06b6d4" /> {f.windSpeed} km/h</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

const styles = {
  container: {
    padding: "32px 40px",
    maxWidth: 1200,
    margin: "0 auto",
    fontFamily: "'Segoe UI', Roboto, sans-serif"
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 24
  },
  title: {
    fontSize: "2rem",
    fontWeight: 800,
    color: "#1e293b",
    margin: 0
  },
  subtitle: {
    fontSize: "1rem",
    color: "#64748b",
    marginTop: 6,
    marginBottom: 0
  },
  controlBar: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap"
  },
  selectWrapper: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#fff",
    border: "1.5px solid #cbd5e1",
    borderRadius: 10,
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
  },
  districtSelect: {
    padding: "10px 14px",
    border: "none",
    background: "transparent",
    fontSize: "0.95rem",
    color: "#1e293b",
    fontWeight: 600,
    outline: "none",
    cursor: "pointer"
  },
  gpsBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "10px 16px",
    backgroundColor: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontWeight: 700,
    fontSize: "0.9rem",
    cursor: "pointer",
    boxShadow: "0 2px 6px rgba(22, 163, 74, 0.25)"
  },
  refreshBtn: {
    padding: "10px 14px",
    backgroundColor: "#f1f5f9",
    border: "1px solid #cbd5e1",
    borderRadius: 10,
    color: "#334155",
    cursor: "pointer"
  },
  errorBox: {
    padding: "16px 20px",
    backgroundColor: "#fef2f2",
    border: "1px solid #ef4444",
    color: "#b91c1c",
    borderRadius: 10,
    marginBottom: 20
  },
  loadingBox: {
    textAlign: "center",
    padding: "60px 20px"
  },
  advisoryBanner: {
    display: "flex",
    gap: 20,
    padding: "24px 28px",
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: "solid",
    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
    marginBottom: 28,
    alignItems: "flex-start"
  },
  advisoryIconCol: {
    paddingTop: 4
  },
  advisoryContentCol: {
    flex: 1
  },
  bannerBadgeRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 8
  },
  badge: {
    color: "#fff",
    padding: "4px 12px",
    borderRadius: 20,
    fontSize: "0.8rem",
    fontWeight: 800,
    letterSpacing: 0.5
  },
  timeWindowTag: {
    fontSize: "0.85rem",
    color: "#475569",
    fontWeight: 600
  },
  bannerTitle: {
    fontSize: "1.45rem",
    fontWeight: 800,
    margin: "4px 0 8px 0"
  },
  bannerText: {
    fontSize: "1rem",
    lineHeight: 1.5,
    margin: 0,
    fontWeight: 500
  },
  alertTagsRow: {
    display: "flex",
    gap: 10,
    marginTop: 14,
    flexWrap: "wrap"
  },
  alertPill: {
    display: "flex",
    alignItems: "center",
    padding: "5px 12px",
    backgroundColor: "#fff",
    border: "1px solid #fde68a",
    borderRadius: 8,
    fontSize: "0.85rem",
    color: "#92400e"
  },
  metricsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 18,
    marginBottom: 28
  },
  metricCard: {
    backgroundColor: "#fff",
    padding: "20px 22px",
    borderRadius: 14,
    boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
    border: "1px solid #e2e8f0"
  },
  metricHeader: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 10
  },
  metricLabel: {
    fontSize: "0.9rem",
    color: "#64748b",
    fontWeight: 600
  },
  metricValue: {
    fontSize: "1.9rem",
    fontWeight: 800,
    color: "#1e293b"
  },
  metricSub: {
    fontSize: "0.85rem",
    color: "#64748b",
    marginTop: 4,
    fontWeight: 500
  },
  sectionCard: {
    backgroundColor: "#fff",
    padding: "24px 28px",
    borderRadius: 16,
    boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
    border: "1px solid #e2e8f0",
    marginBottom: 28
  },
  sectionHeading: {
    fontSize: "1.2rem",
    fontWeight: 700,
    color: "#1e293b",
    margin: "0 0 4px 0"
  },
  sectionDesc: {
    fontSize: "0.9rem",
    color: "#64748b",
    margin: "0 0 18px 0"
  },
  hourlyScroll: {
    display: "flex",
    gap: 12,
    overflowX: "auto",
    paddingBottom: 8
  },
  hourTile: {
    minWidth: 85,
    padding: "12px 10px",
    borderRadius: 10,
    borderWidth: 1.5,
    borderStyle: "solid",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 6
  },
  hourTime: {
    fontSize: "0.8rem",
    fontWeight: 700,
    color: "#334155"
  },
  hourIndicator: {
    width: 10,
    height: 10,
    borderRadius: "50%"
  },
  hourTemp: {
    fontSize: "0.95rem",
    fontWeight: 800,
    color: "#1e293b"
  },
  hourWind: {
    fontSize: "0.75rem",
    color: "#475569",
    display: "flex",
    alignItems: "center"
  },
  hourRain: {
    fontSize: "0.75rem",
    color: "#2563eb",
    display: "flex",
    alignItems: "center"
  },
  forecastGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(135px, 1fr))",
    gap: 14
  },
  forecastCard: {
    padding: "16px 12px",
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    border: "1px solid #e2e8f0",
    textAlign: "center"
  },
  fDate: {
    fontSize: "1rem",
    fontWeight: 800,
    color: "#1e293b"
  },
  fSubDate: {
    fontSize: "0.8rem",
    color: "#64748b",
    marginBottom: 8
  },
  fConditionBadge: {
    fontSize: "0.75rem",
    fontWeight: 700,
    color: "#16a34a",
    backgroundColor: "#dcfce7",
    padding: "3px 8px",
    borderRadius: 12,
    display: "inline-block",
    marginBottom: 8
  },
  fTempRow: {
    fontSize: "1.1rem",
    fontWeight: 800,
    color: "#1e293b",
    marginBottom: 8
  },
  fMaxTemp: {
    color: "#ea580c"
  },
  fMinTemp: {
    fontSize: "0.85rem",
    color: "#64748b"
  },
  fMetaRow: {
    display: "flex",
    justifyContent: "space-around",
    fontSize: "0.75rem",
    color: "#475569",
    borderTop: "1px solid #e2e8f0",
    paddingTop: 6
  }
};

export default WeatherAdvisory;
