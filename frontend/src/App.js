import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import { Trees, LayoutDashboard, LineChart, HandCoins, FlaskConical, Users, Sparkles, UserCircle, Moon, Sun, LogOut, CloudSun, Store } from "lucide-react";
import CropPrices from "./pages/CropPrices";
import Schemes from "./pages/Schemes";
import Fertilizer from "./pages/Fertilizer";
import Buyers from "./pages/Buyers";
import Recommend from "./pages/Recommend";
import Dashboard from "./pages/Dashboard";
import WeatherAdvisory from "./pages/WeatherAdvisory";
import EMandi from "./pages/EMandi";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import { LanguageProvider, useLanguage } from "./LanguageContext";
import { AuthProvider, useAuth } from "./AuthContext";

function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();
  const { t } = useLanguage();

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { path: "/", label: "Crop Prices", icon: <LineChart size={20} /> },
    { path: "/weather", label: "Weather & Spray", icon: <CloudSun size={20} /> },
    { path: "/emandi", label: "Live e-Mandi", icon: <Store size={20} /> },
    { path: "/schemes", label: "Schemes", icon: <HandCoins size={20} /> },
    { path: "/fertilizer", label: "Fertilizer", icon: <FlaskConical size={20} /> },
    { path: "/buyers", label: "Buyers", icon: <Users size={20} /> },
    { path: "/recommend", label: "AI Recommend", icon: <Sparkles size={20} /> },
  ];

  return (
    <>
      <div className={`mobile-overlay ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(false)}></div>
      <div style={styles.sidebar} className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div style={styles.logoContainer}>
          <div style={styles.logoIcon}>
            <Trees size={24} color="var(--text-on-primary)" />
          </div>
          <h2 style={styles.logoText}>farmX</h2>
        </div>

        <nav style={styles.nav}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                onClick={() => setIsOpen(false)}
                style={{
                  ...styles.navItem,
                  ...(isActive ? styles.navItemActive : {})
                }}
              >
                <span style={{ color: isActive ? 'var(--text-on-primary)' : 'var(--text-muted)' }}>
                  {item.icon}
                </span>
                <span style={{ fontWeight: isActive ? '600' : '500' }}>
                  {t(item.label)}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}

function Topbar({ isDarkMode, setIsDarkMode, setIsSidebarOpen }) {
  const { lang, setLang, t } = useLanguage();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={styles.topbar} className="topbar">
      <div style={{ flex: 1 }}></div>
      
      {/* Theme Toggle */}
      <button 
        style={styles.iconBtn} 
        onClick={() => setIsDarkMode(!isDarkMode)}
        title={isDarkMode ? t("Light Mode") : t("Dark Mode")}
      >
        {isDarkMode ? <Sun size={20} color="var(--text-primary)"/> : <Moon size={20} color="var(--text-primary)"/>}
      </button>

      {/* Language Selector */}
      <div style={styles.langTopContainer}>
        <select 
          style={styles.langSelectTop} 
          value={lang} 
          onChange={(e) => setLang(e.target.value)}
        >
          <option value="en">EN</option>
          <option value="kn">ಕನ್ನಡ</option>
          <option value="hi">हिन्दी</option>
        </select>
      </div>

      {/* Farmer Profile & Logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={styles.profileTopContainer} onClick={() => navigate('/profile')}>
          <UserCircle size={24} color="var(--accent-primary)" />
          <span style={styles.profileTopText} className="profile-text-mobile">{user.first_name}</span>
        </div>
        <button style={styles.iconBtn} onClick={() => logout()} title={t("Logout")}>
          <LogOut size={20} color="var(--text-primary)" />
        </button>
      </div>
    </div>
  );
}

function AppContent({ isDarkMode, setIsDarkMode }) {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // If not logged in, show Unauthenticated routes
  if (!user) {
    return (
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }

  // If logged in, show the full application layout
  return (
    <div style={styles.appContainer}>
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div style={styles.mainArea}>
        <Topbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} setIsSidebarOpen={setIsSidebarOpen} />
        <div style={styles.mainContent} className="main-content">
          <Routes>
            <Route path="/" element={<CropPrices />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/weather" element={<WeatherAdvisory />} />
            <Route path="/emandi" element={<EMandi />} />
            <Route path="/schemes" element={<Schemes />} />
            <Route path="/fertilizer" element={<Fertilizer />} />
            <Route path="/buyers" element={<Buyers />} />
            <Route path="/recommend" element={<Recommend />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<CropPrices />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('farmx_theme');
    return saved !== null ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('farmx_theme', JSON.parse(isDarkMode));
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <AppContent isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

const styles = {
  appContainer: {
    display: "flex",
    minHeight: "100vh",
    width: "100%",
  },
  sidebar: {
    width: "280px",
    backgroundColor: "var(--bg-sidebar)",
    borderRight: "1px solid var(--border-color)",
    padding: "32px 24px",
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "48px",
  },
  logoIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "var(--accent-primary)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 14px rgba(52, 211, 153, 0.4)",
  },
  logoText: {
    color: "var(--accent-primary)",
    fontSize: "24px",
    fontWeight: "700",
    margin: 0,
    letterSpacing: "-0.5px",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    flex: 1,
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "14px 20px",
    borderRadius: "12px",
    textDecoration: "none",
    color: "var(--text-secondary)",
    transition: "all 0.2s ease",
    fontSize: "15px",
  },
  navItemActive: {
    backgroundColor: "var(--accent-primary)",
    color: "var(--text-on-primary)",
    boxShadow: "0 4px 14px rgba(46, 125, 50, 0.25)",
  },
  mainArea: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
    backgroundColor: "var(--bg-main)",
  },
  topbar: {
    display: "flex",
    alignItems: "center",
    padding: "20px 40px",
    gap: "24px",
  },
  iconBtn: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "8px",
    borderRadius: "50%",
    transition: "background 0.2s",
  },
  langTopContainer: {
    display: "flex",
    alignItems: "center",
  },
  langSelectTop: {
    backgroundColor: "var(--bg-card)",
    border: "1px solid var(--border-color)",
    color: "var(--text-primary)",
    padding: "8px 12px",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    cursor: "pointer",
    fontWeight: "600",
  },
  profileTopContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
    padding: "8px 16px",
    backgroundColor: "var(--bg-card)",
    border: "1px solid var(--border-color)",
    borderRadius: "20px",
  },
  profileTopText: {
    color: "var(--text-primary)",
    fontWeight: "600",
    fontSize: "14px",
  },
  loginBtn: {
    backgroundColor: "var(--accent-primary)",
    color: "var(--text-on-primary)",
    border: "none",
    padding: "10px 20px",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "transform 0.2s",
  },
  mainContent: {
    padding: "0 40px 40px 40px",
  }
};

export default App;