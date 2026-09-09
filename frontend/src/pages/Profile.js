import React from 'react';
import { useAuth } from '../AuthContext';
import { useLanguage } from '../LanguageContext';
import { UserCircle, MapPin, Phone, Leaf, Mail, Calendar, Wheat, Store, ArrowRight } from 'lucide-react';
import { Navigate, Link } from 'react-router-dom';

function Profile() {
  const { user } = useAuth();
  const { t, isKannada } = useLanguage();

  if (!user) {
    return <Navigate to="/login" />;
  }

  const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username;
  const isFarmer = user.role === 'farmer';

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <div>
          <h1 style={styles.header}>
            {isFarmer ? (isKannada ? "ರೈತರ ಪ್ರೊಫೈಲ್" : "Farmer Profile") : (isKannada ? "ಖರೀದಿದಾರರ ಪ್ರೊಫೈಲ್" : "Buyer Profile")}
          </h1>
          <p style={styles.subHeader}>
            {isKannada ? "ನಿಮ್ಮ farmX ಖಾತೆ ಮತ್ತು ಕೃಷಿ ಮಾಹಿತಿ ವಿವರಗಳು" : "Your verified farmX credentials and agronomic parameters"}
          </p>
        </div>
        <div style={styles.roleBadge}>
          {isFarmer ? <Wheat size={16} /> : <Store size={16} />}
          <span>{isFarmer ? (isKannada ? "ರೈತ / ಮಾರಾಟಗಾರ" : "Farmer / Seller") : (isKannada ? "ಖರೀದಿದಾರ / ವ್ಯಾಪಾರಿ" : "Buyer / Trader")}</span>
        </div>
      </div>

      <div style={styles.profileGrid}>
        {/* Card 1: Account Credentials */}
        <div className="glass-panel" style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.avatar}>
              <UserCircle size={64} color="var(--accent-primary)" />
            </div>
            <div>
              <h2 style={styles.name}>{fullName}</h2>
              <p style={styles.username}>@{user.username}</p>
            </div>
          </div>

          <div style={styles.infoList}>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}><Mail size={16} /> {t("Email")}</span>
              <span style={styles.infoValue}>{user.email || (isKannada ? "ನಮೂದಿಸಿಲ್ಲ" : "Not Provided")}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}><Phone size={16} /> {t("Contact")}</span>
              <span style={styles.infoValue}>{user.phone || (isKannada ? "ನಮೂದಿಸಿಲ್ಲ" : "Not Provided")}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}><Calendar size={16} /> {t("Member Since")}</span>
              <span style={styles.infoValue}>
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Active Member'}
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Farm / Business Details */}
        <div className="glass-panel" style={styles.card}>
          <h3 style={styles.sectionTitle}>
            {isFarmer ? (isKannada ? "ಜಮೀನು ವಿವರಗಳು" : "Farm Details") : (isKannada ? "ವ್ಯಾಪಾರ ವಿವರಗಳು" : "Business Details")}
          </h3>
          <div style={styles.infoList}>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}><MapPin size={16} /> {t("Location")}</span>
              <span style={styles.infoValue}>
                {user.village ? `${user.village}, ` : ''}{user.district || 'Mandya'}, Karnataka
              </span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}><Leaf size={16} /> {isFarmer ? t("Primary Crop") : "Procurement Crop"}</span>
              <span style={styles.infoValue}>{user.primaryCrop || 'Sugarcane'}</span>
            </div>
            {isFarmer && (
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}><Wheat size={16} /> {isKannada ? "ಜಮೀನಿನ ವಿಸ್ತೀರ್ಣ" : "Land Size"}</span>
                <span style={styles.infoValue}>{user.landSizeAcres || 2} Acres</span>
              </div>
            )}
          </div>

          {/* Quick Action Navigation */}
          <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: "1px solid var(--border-color)" }}>
            <Link
              to="/emandi"
              style={styles.quickActionBtn}
            >
              <span>{isFarmer ? (isKannada ? "e-ಮಂಡಿಯಲ್ಲಿ ಬೆಳೆ ಪೋಸ್ಟ್ ಮಾಡಿ" : "Post Harvest on e-Mandi") : (isKannada ? "ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಬೆಳೆಗಳನ್ನು ನೋಡಿ" : "Browse Live Marketplace")}</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    fontFamily: 'var(--font-main)',
    padding: '16px 0',
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '32px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  header: {
    color: 'var(--text-primary)',
    fontSize: '32px',
    fontWeight: '800',
    margin: '0 0 6px 0',
    letterSpacing: '-0.5px',
  },
  subHeader: {
    color: 'var(--text-muted)',
    margin: 0,
    fontSize: '15px',
  },
  roleBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'rgba(52, 211, 153, 0.15)',
    color: 'var(--accent-primary)',
    padding: '8px 16px',
    borderRadius: '20px',
    fontWeight: '700',
    fontSize: '13px',
    border: '1px solid rgba(52, 211, 153, 0.3)',
  },
  profileGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
    gap: '24px',
  },
  card: {
    padding: '32px',
    borderRadius: '20px',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.08)',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '28px',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '20px',
  },
  avatar: {
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    backgroundColor: 'rgba(52, 211, 153, 0.12)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    color: 'var(--text-primary)',
    margin: '0 0 4px 0',
    fontSize: '22px',
    fontWeight: '700',
  },
  username: {
    color: 'var(--text-muted)',
    margin: 0,
    fontSize: '14px',
  },
  sectionTitle: {
    color: 'var(--text-primary)',
    fontSize: '19px',
    fontWeight: '700',
    margin: '0 0 24px 0',
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
    padding: '8px 0',
    borderBottom: '1px dashed var(--border-color)',
  },
  infoLabel: {
    color: 'var(--text-secondary)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '500',
  },
  infoValue: {
    color: 'var(--text-primary)',
    fontWeight: '600',
    fontSize: '14px',
    textAlign: 'right',
  },
  quickActionBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    width: '100%',
    padding: '12px 18px',
    backgroundColor: 'var(--accent-primary)',
    color: 'var(--text-on-primary)',
    borderRadius: '12px',
    fontWeight: '700',
    fontSize: '14px',
    textDecoration: 'none',
    boxShadow: '0 4px 14px rgba(52, 211, 153, 0.3)',
    transition: 'all 0.2s ease',
  }
};

export default Profile;
