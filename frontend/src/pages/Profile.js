import React from 'react';
import { useAuth } from '../AuthContext';
import { useLanguage } from '../LanguageContext';
import { UserCircle, MapPin, Phone, Leaf } from 'lucide-react';
import { Navigate } from 'react-router-dom';

function Profile() {
  const { user } = useAuth();
  const { t } = useLanguage();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>{t("Farmer Profile")}</h1>
      
      <div style={styles.profileGrid}>
        <div className="glass-panel" style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.avatar}>
              <UserCircle size={64} color="var(--accent-primary)" />
            </div>
            <div>
              <h2 style={styles.name}>{user.first_name} {user.last_name}</h2>
              <p style={styles.username}>@{user.username}</p>
            </div>
          </div>
          
          <div style={styles.infoList}>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>{t("Email")}</span>
              <span style={styles.infoValue}>{user.email}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>{t("Member Since")}</span>
              <span style={styles.infoValue}>{new Date(user.date_joined).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="glass-panel" style={styles.card}>
          <h3 style={styles.sectionTitle}>{t("Farm Details")}</h3>
          <div style={styles.infoList}>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}><MapPin size={16}/> {t("Location")}</span>
              <span style={styles.infoValue}>Karnataka, India</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}><Leaf size={16}/> {t("Primary Crop")}</span>
              <span style={styles.infoValue}>Ragi (Finger Millet)</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}><Phone size={16}/> {t("Contact")}</span>
              <span style={styles.infoValue}>+91 98765 43210</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  header: {
    color: 'var(--text-primary)',
    fontSize: '32px',
    marginBottom: '32px',
  },
  profileGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
  },
  card: {
    padding: '32px',
    borderRadius: '16px',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '32px',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '24px',
  },
  avatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: 'rgba(52, 211, 153, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    color: 'var(--text-primary)',
    margin: '0 0 4px 0',
    fontSize: '24px',
  },
  username: {
    color: 'var(--text-muted)',
    margin: 0,
    fontSize: '15px',
  },
  sectionTitle: {
    color: 'var(--text-primary)',
    fontSize: '20px',
    marginBottom: '24px',
  },
  infoList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  infoItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    color: 'var(--text-secondary)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '15px',
  },
  infoValue: {
    color: 'var(--text-primary)',
    fontWeight: '500',
    fontSize: '15px',
  }
};

export default Profile;
