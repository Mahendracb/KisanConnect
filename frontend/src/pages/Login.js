import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useLanguage } from '../LanguageContext';
import { UserCircle, Lock, Loader2 } from 'lucide-react';

function Login() {
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(username, password);
      navigate('/profile');
    } catch (err) {
      setError(t("Invalid username or password"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div className="glass-panel" style={styles.loginCard}>
        <div style={styles.header}>
          <UserCircle size={48} color="var(--accent-primary)" />
          <h2 style={styles.title}>{t("Farmer Login")}</h2>
          <p style={styles.subtitle}>{t("Access your farmX account")}</p>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>{t("Username, Email or Phone")}</label>
            <div style={styles.inputWrapper}>
              <UserCircle size={20} color="var(--text-muted)" style={styles.inputIcon} />
              <input 
                type="text" 
                value={username}
                onChange={e => setUsername(e.target.value)}
                style={styles.input} 
                placeholder={t("Enter username")}
                required
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>{t("Password")}</label>
            <div style={styles.inputWrapper}>
              <Lock size={20} color="var(--text-muted)" style={styles.inputIcon} />
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={styles.input} 
                placeholder={t("Enter password")}
                required
              />
            </div>
          </div>

          <button type="submit" style={styles.submitBtn} disabled={loading}>
            {loading ? <Loader2 size={20} className="spin-animation" /> : t("Sign In")}
          </button>
        </form>

        <div style={styles.footer}>
          <span style={styles.footerText}>{t("New to farmX?")} </span>
          <Link to="/register" style={styles.link}>{t("Create an Account")}</Link>
        </div>
      </div>

      <style>{`
        .spin-animation { animation: spin 1.5s linear infinite; }
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
    minHeight: '70vh',
  },
  loginCard: {
    width: '100%',
    maxWidth: '400px',
    padding: '40px',
    borderRadius: '24px',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  title: {
    color: 'var(--text-primary)',
    margin: '16px 0 8px 0',
    fontSize: '28px',
  },
  subtitle: {
    color: 'var(--text-muted)',
    margin: 0,
    fontSize: '15px',
  },
  error: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    color: '#ef4444',
    padding: '12px',
    borderRadius: '8px',
    textAlign: 'center',
    marginBottom: '20px',
    fontSize: '14px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    color: 'var(--text-secondary)',
    fontSize: '14px',
    fontWeight: '500',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '16px',
  },
  input: {
    width: '100%',
    backgroundColor: 'rgba(15, 22, 18, 0.3)',
    border: '1px solid var(--border-color)',
    padding: '14px 14px 14px 48px',
    borderRadius: '12px',
    color: 'var(--text-primary)',
    fontSize: '15px',
    outline: 'none',
  },
  submitBtn: {
    backgroundColor: 'var(--accent-primary)',
    color: 'var(--text-on-primary)',
    border: 'none',
    padding: '16px',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '12px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
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
    fontWeight: '600',
  }
};

export default Login;
