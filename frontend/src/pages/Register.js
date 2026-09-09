import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useLanguage } from '../LanguageContext';
import {
  UserCircle,
  Lock,
  Loader2,
  User,
  Phone,
  Mail,
  MapPin,
  Sprout,
  Building2,
  CheckCircle2,
  Wheat,
  Briefcase
} from 'lucide-react';

const KARNATAKA_DISTRICTS = [
  'Bagalkot', 'Ballari', 'Belagavi', 'Bengaluru Rural', 'Bengaluru Urban',
  'Bidar', 'Chamarajanagar', 'Chikkaballapur', 'Chikkamagaluru', 'Chitradurga',
  'Dakshina Kannada', 'Davanagere', 'Dharwad', 'Gadag', 'Hassan',
  'Haveri', 'Kalaburagi', 'Kodagu', 'Kolar', 'Koppal',
  'Mandya', 'Mysuru', 'Raichur', 'Ramanagara', 'Shivamogga',
  'Tumakuru', 'Udupi', 'Uttara Kannada', 'Vijayapura', 'Yadgir'
];

const CROPS_LIST = [
  'Sugarcane (ಕಬ್ಬು)',
  'Paddy / Rice (ಭತ್ತ)',
  'Ragi (ರಾಗಿ)',
  'Tomato (ಟೊಮ್ಯಾಟೊ)',
  'Cotton (ಹತ್ತಿ)',
  'Maize (ಮೆಕ್ಕೆಜೋಳ)',
  'Chilli (ಮೆಣಸಿನಕಾಯಿ)',
  'Onion (ಈರುಳ್ಳಿ)',
  'Potato (ಆಲೂಗಡ್ಡೆ)',
  'Banana (ಬಾಳೆ)',
  'Groundnut (ಕಡಲೆಕಾಯಿ)',
  'Tur Dal (ತೊಗರಿ)',
  'Arecanut (ಅಡಿಕೆ)',
  'Coconut (ತೆಂಗು)',
  'Coffee (ಕಾಫಿ)'
];

function Register() {
  const { register } = useAuth();
  const { isKannada } = useLanguage();
  const navigate = useNavigate();

  // Form State
  const [role, setRole] = useState('farmer'); // 'farmer' | 'buyer'
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    village: '',
    district: 'Mandya',
    landSizeAcres: 2,
    primaryCrop: 'Sugarcane (ಕಬ್ಬು)',
    company: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!formData.username.trim() || !formData.password) {
      setError(isKannada ? 'ಬಳಕೆದಾರ ಹೆಸರು ಮತ್ತು ಗುಪ್ತಪದ ಅಗತ್ಯವಿದೆ.' : 'Username and password are required.');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError(isKannada ? 'ಗುಪ್ತಪದ ಕನಿಷ್ಠ 6 ಅಕ್ಷರಗಳಾಗಿರಬೇಕು.' : 'Password must be at least 6 characters.');
      setLoading(false);
      return;
    }

    if (!formData.phone.trim()) {
      setError(isKannada ? 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ.' : 'Please enter your mobile phone number.');
      setLoading(false);
      return;
    }

    try {
      await register({
        username: formData.username.trim(),
        password: formData.password,
        email: formData.email.trim(),
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        phone: formData.phone.trim(),
        role: role,
        village: formData.village.trim() || 'Taluk Center',
        district: formData.district,
        landSizeAcres: Number(formData.landSizeAcres) || 2,
        primaryCrop: role === 'farmer' ? formData.primaryCrop : (formData.company || 'Wholesale Buyer')
      });

      navigate('/profile');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError(isKannada ? 'ನೋಂದಣಿ ವಿಫಲವಾಗಿದೆ. ದಯವಿಟ್ಟು ಪರಿಶೀಲಿಸಿ.' : 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div className="glass-panel" style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.avatar}>
            <UserCircle size={44} color="var(--accent-primary)" />
          </div>
          <h2 style={styles.title}>
            {isKannada ? "farmX ಖಾತೆ ರಚಿಸಿ" : "Create farmX Account"}
          </h2>
          <p style={styles.subtitle}>
            {isKannada ? "ಕರ್ನಾಟಕದ ಆಧುನಿಕ ಕೃಷಿ ಸಮುದಾಯವನ್ನು ಸೇರಿ" : "Join the modern agricultural ecosystem"}
          </p>
        </div>

        {/* Role Selector Toggle */}
        <div style={styles.roleToggleContainer}>
          <button
            type="button"
            style={role === 'farmer' ? styles.roleBtnActive : styles.roleBtn}
            onClick={() => setRole('farmer')}
          >
            <Wheat size={18} />
            <span>{isKannada ? "ರೈತ / ಮಾರಾಟಗಾರ" : "Farmer / Producer"}</span>
          </button>
          <button
            type="button"
            style={role === 'buyer' ? styles.roleBtnActive : styles.roleBtn}
            onClick={() => setRole('buyer')}
          >
            <Briefcase size={18} />
            <span>{isKannada ? "ಖರೀದಿದಾರ / ವ್ಯಾಪಾರಿ" : "Buyer / Trader"}</span>
          </button>
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Row 1: First Name & Last Name */}
          <div style={styles.row}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>{isKannada ? "ಹೆಸರು" : "First Name"} *</label>
              <div style={styles.inputWrapper}>
                <User size={18} color="var(--text-muted)" style={styles.inputIcon} />
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={e => handleChange('first_name', e.target.value)}
                  style={styles.input}
                  placeholder={isKannada ? "ಮೊದಲ ಹೆಸರು" : "First Name"}
                  required
                />
              </div>
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>{isKannada ? "ಉಪನಾಮ" : "Last Name"}</label>
              <div style={styles.inputWrapper}>
                <User size={18} color="var(--text-muted)" style={styles.inputIcon} />
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={e => handleChange('last_name', e.target.value)}
                  style={styles.input}
                  placeholder={isKannada ? "ಉಪನಾಮ" : "Last Name"}
                />
              </div>
            </div>
          </div>

          {/* Row 2: Username & Phone Number */}
          <div style={styles.row}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>{isKannada ? "ಬಳಕೆದಾರ ಹೆಸರು" : "Username"} *</label>
              <div style={styles.inputWrapper}>
                <UserCircle size={18} color="var(--text-muted)" style={styles.inputIcon} />
                <input
                  type="text"
                  value={formData.username}
                  onChange={e => handleChange('username', e.target.value)}
                  style={styles.input}
                  placeholder="e.g. mahendra_farm"
                  required
                />
              </div>
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>{isKannada ? "ಮೊಬೈಲ್ / WhatsApp ಸಂಖ್ಯೆ" : "Mobile / WhatsApp"} *</label>
              <div style={styles.inputWrapper}>
                <Phone size={18} color="var(--text-muted)" style={styles.inputIcon} />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={e => handleChange('phone', e.target.value)}
                  style={styles.input}
                  placeholder="9876543210"
                  required
                />
              </div>
            </div>
          </div>

          {/* Row 3: Email & Password */}
          <div style={styles.row}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>{isKannada ? "ಇಮೇಲ್ (ಐಚ್ಛಿಕ)" : "Email (Optional)"}</label>
              <div style={styles.inputWrapper}>
                <Mail size={18} color="var(--text-muted)" style={styles.inputIcon} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => handleChange('email', e.target.value)}
                  style={styles.input}
                  placeholder="farmer@example.com"
                />
              </div>
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>{isKannada ? "ಗುಪ್ತಪದ" : "Password"} *</label>
              <div style={styles.inputWrapper}>
                <Lock size={18} color="var(--text-muted)" style={styles.inputIcon} />
                <input
                  type="password"
                  value={formData.password}
                  onChange={e => handleChange('password', e.target.value)}
                  style={styles.input}
                  placeholder={isKannada ? "ಕನಿಷ್ಠ 6 ಅಕ್ಷರಗಳು" : "Min 6 characters"}
                  required
                  minLength={6}
                />
              </div>
            </div>
          </div>

          {/* Row 4: District & Village/Taluk */}
          <div style={styles.row}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>{isKannada ? "ಜಿಲ್ಲೆ" : "District"} *</label>
              <div style={styles.inputWrapper}>
                <MapPin size={18} color="var(--text-muted)" style={styles.inputIcon} />
                <select
                  value={formData.district}
                  onChange={e => handleChange('district', e.target.value)}
                  style={styles.select}
                  required
                >
                  {KARNATAKA_DISTRICTS.map(dist => (
                    <option key={dist} value={dist}>{dist}</option>
                  ))}
                </select>
              </div>
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>{isKannada ? "ಗ್ರಾಮ / ತಾಲೂಕು" : "Village / Taluk"} *</label>
              <div style={styles.inputWrapper}>
                <MapPin size={18} color="var(--text-muted)" style={styles.inputIcon} />
                <input
                  type="text"
                  value={formData.village}
                  onChange={e => handleChange('village', e.target.value)}
                  style={styles.input}
                  placeholder={isKannada ? "ಗ್ರಾಮ ಅಥವಾ ತಾಲೂಕು" : "Village / Hobli / Taluk"}
                  required
                />
              </div>
            </div>
          </div>

          {/* Row 5: Role-Specific Fields */}
          {role === 'farmer' ? (
            <div style={styles.row}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>{isKannada ? "ಮುಖ್ಯ ಬೆಳೆ" : "Primary Cultivated Crop"}</label>
                <div style={styles.inputWrapper}>
                  <Sprout size={18} color="var(--accent-primary)" style={styles.inputIcon} />
                  <select
                    value={formData.primaryCrop}
                    onChange={e => handleChange('primaryCrop', e.target.value)}
                    style={styles.select}
                  >
                    {CROPS_LIST.map(crop => (
                      <option key={crop} value={crop}>{crop}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>{isKannada ? "ಜಮೀನಿನ ವಿಸ್ತೀರ್ಣ (ಎಕರೆ)" : "Land Size (Acres)"}</label>
                <div style={styles.inputWrapper}>
                  <Wheat size={18} color="var(--text-muted)" style={styles.inputIcon} />
                  <input
                    type="number"
                    step="0.5"
                    min="0.1"
                    value={formData.landSizeAcres}
                    onChange={e => handleChange('landSizeAcres', e.target.value)}
                    style={styles.input}
                    placeholder="e.g. 2.5"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div style={styles.row}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>{isKannada ? "ಸಂಸ್ಥೆ / ವ್ಯಾಪಾರ ಸಂಸ್ಥೆ ಹೆಸರು" : "Company / Firm Name"}</label>
                <div style={styles.inputWrapper}>
                  <Building2 size={18} color="var(--accent-primary)" style={styles.inputIcon} />
                  <input
                    type="text"
                    value={formData.company}
                    onChange={e => handleChange('company', e.target.value)}
                    style={styles.input}
                    placeholder={isKannada ? "ಕಂಪನಿ ಅಥವಾ ಅಂಗಡಿಯ ಹೆಸರು" : "e.g. Karnataka Agro Traders"}
                  />
                </div>
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>{isKannada ? "ಖರೀದಿಸುವ ಮುಖ್ಯ ಬೆಳೆ" : "Crop Procurement Interest"}</label>
                <div style={styles.inputWrapper}>
                  <Sprout size={18} color="var(--text-muted)" style={styles.inputIcon} />
                  <select
                    value={formData.primaryCrop}
                    onChange={e => handleChange('primaryCrop', e.target.value)}
                    style={styles.select}
                  >
                    {CROPS_LIST.map(crop => (
                      <option key={crop} value={crop}>{crop}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button type="submit" style={styles.submitBtn} disabled={loading}>
            {loading ? (
              <>
                <Loader2 size={20} className="spin-animation" />
                <span>{isKannada ? "ಖಾತೆ ರಚಿಸಲಾಗುತ್ತಿದೆ..." : "Creating Account..."}</span>
              </>
            ) : (
              <>
                <CheckCircle2 size={20} />
                <span>{isKannada ? "ಖಾತೆ ತೆರೆಯಿರಿ" : "Complete Registration"}</span>
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div style={styles.footer}>
          <span style={styles.footerText}>
            {isKannada ? "ಈಗಾಗಲೇ ಖಾತೆ ಹೊಂದಿದ್ದೀರಾ?" : "Already have an account?"}{" "}
          </span>
          <Link to="/login" style={styles.link}>
            {isKannada ? "ಇಲ್ಲಿ ಲಾಗಿನ್ ಆಗಿ" : "Login here"}
          </Link>
        </div>
      </div>

      <style>{`
        .spin-animation { animation: spin 1.2s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '32px 16px',
    fontFamily: 'var(--font-main)',
  },
  card: {
    width: '100%',
    maxWidth: '680px',
    padding: '36px',
    borderRadius: '24px',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 24px 48px rgba(0, 0, 0, 0.25)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '24px',
  },
  avatar: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    backgroundColor: 'rgba(52, 211, 153, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 12px auto',
  },
  title: {
    color: 'var(--text-primary)',
    margin: '0 0 6px 0',
    fontSize: '28px',
    fontWeight: '800',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    color: 'var(--text-muted)',
    margin: 0,
    fontSize: '14px',
  },
  roleToggleContainer: {
    display: 'flex',
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    borderRadius: '14px',
    padding: '4px',
    marginBottom: '24px',
    gap: '6px',
    border: '1px solid var(--border-color)',
  },
  roleBtn: {
    flex: 1,
    padding: '12px 16px',
    border: 'none',
    backgroundColor: 'transparent',
    color: 'var(--text-secondary)',
    borderRadius: '10px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontWeight: '600',
    fontSize: '14px',
    transition: 'all 0.2s ease',
  },
  roleBtnActive: {
    flex: 1,
    padding: '12px 16px',
    border: 'none',
    backgroundColor: 'var(--accent-primary)',
    color: 'var(--text-on-primary)',
    borderRadius: '10px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontWeight: '700',
    fontSize: '14px',
    boxShadow: '0 4px 14px rgba(52, 211, 153, 0.35)',
    transition: 'all 0.2s ease',
  },
  errorBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    color: '#ef4444',
    padding: '12px 16px',
    borderRadius: '12px',
    textAlign: 'center',
    marginBottom: '20px',
    fontSize: '14px',
    fontWeight: '500',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  row: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    flex: 1,
    minWidth: '220px',
  },
  label: {
    color: 'var(--text-secondary)',
    fontSize: '13px',
    fontWeight: '600',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '14px',
    pointerEvents: 'none',
  },
  input: {
    width: '100%',
    backgroundColor: 'var(--bg-main)',
    border: '1px solid var(--border-color)',
    padding: '12px 14px 12px 42px',
    borderRadius: '12px',
    color: 'var(--text-primary)',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  select: {
    width: '100%',
    backgroundColor: 'var(--bg-main)',
    border: '1px solid var(--border-color)',
    padding: '12px 14px 12px 42px',
    borderRadius: '12px',
    color: 'var(--text-primary)',
    fontSize: '14px',
    outline: 'none',
    cursor: 'pointer',
    transition: 'border-color 0.2s',
  },
  submitBtn: {
    backgroundColor: 'var(--accent-primary)',
    color: 'var(--text-on-primary)',
    border: 'none',
    padding: '15px 24px',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '10px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
    boxShadow: '0 4px 18px rgba(52, 211, 153, 0.35)',
    transition: 'all 0.2s ease',
  },
  footer: {
    marginTop: '24px',
    textAlign: 'center',
    fontSize: '14px',
  },
  footerText: {
    color: 'var(--text-secondary)',
  },
  link: {
    color: 'var(--accent-primary)',
    textDecoration: 'none',
    fontWeight: '700',
  }
};

export default Register;
