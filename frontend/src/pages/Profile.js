import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { useLanguage } from '../LanguageContext';
import { UserCircle, MapPin, Phone, Leaf, Mail, Calendar, Wheat, Store, ArrowRight, Edit3, Save, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { Navigate, Link } from 'react-router-dom';

const KARNATAKA_DISTRICTS = [
  'Bagalkot', 'Ballari', 'Belagavi', 'Bengaluru Rural', 'Bengaluru Urban',
  'Bidar', 'Chamarajanagar', 'Chikkaballapur', 'Chikkamagaluru', 'Chitradurga',
  'Dakshina Kannada', 'Davanagere', 'Dharwad', 'Gadag', 'Hassan', 'Haveri',
  'Kalaburagi', 'Kodagu', 'Kolar', 'Koppal', 'Mandya', 'Mysuru', 'Raichur',
  'Ramanagara', 'Shivamogga', 'Tumakuru', 'Udupi', 'Uttara Kannada',
  'Vijayapura', 'Yadgir'
];

function Profile() {
  const { user, updateProfile } = useAuth();
  const { t, isKannada } = useLanguage();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    village: user?.village || '',
    district: user?.district || 'Mandya',
    landSizeAcres: user?.landSizeAcres || 2,
    primaryCrop: user?.primaryCrop || 'Sugarcane'
  });
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  if (!user) {
    return <Navigate to="/login" />;
  }

  const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username;
  const isFarmer = user.role === 'farmer';

  const handleOpenEdit = () => {
    setFormData({
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      email: user.email || '',
      phone: user.phone || '',
      village: user.village || '',
      district: user.district || 'Mandya',
      landSizeAcres: user.landSizeAcres || 2,
      primaryCrop: user.primaryCrop || 'Sugarcane'
    });
    setStatusMsg({ type: '', text: '' });
    setIsEditing(true);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg({ type: '', text: '' });
    try {
      await updateProfile(formData);
      setStatusMsg({
        type: 'success',
        text: isKannada ? "ಪ್ರೊಫೈಲ್ ಯಶಸ್ವಿಯಾಗಿ ಅಪ್‌ಡೇಟ್ ಆಗಿದೆ!" : "Profile updated successfully!"
      });
      setIsEditing(false);
    } catch (err) {
      setStatusMsg({
        type: 'error',
        text: err.response?.data?.error || err.message || "Failed to update profile."
      });
    } finally {
      setSaving(false);
    }
  };

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => handleOpenEdit()}
            style={styles.editProfileBtn}
            title={isKannada ? "ಪ್ರೊಫೈಲ್ ತಿದ್ದಿ" : "Edit Profile"}
          >
            <Edit3 size={16} />
            <span>{isKannada ? "ಪ್ರೊಫೈಲ್ ತಿದ್ದಿ" : "Edit Profile"}</span>
          </button>
          <div style={styles.roleBadge}>
            {isFarmer ? <Wheat size={16} /> : <Store size={16} />}
            <span>{isFarmer ? (isKannada ? "ರೈತ / ಮಾರಾಟಗಾರ" : "Farmer / Seller") : (isKannada ? "ಖರೀದಿದಾರ / ವ್ಯಾಪಾರಿ" : "Buyer / Trader")}</span>
          </div>
        </div>
      </div>

      {statusMsg.text && (
        <div style={{
          ...styles.alertBanner,
          backgroundColor: statusMsg.type === 'success' ? 'rgba(52, 211, 153, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          borderColor: statusMsg.type === 'success' ? 'rgba(52, 211, 153, 0.4)' : 'rgba(239, 68, 68, 0.4)',
          color: statusMsg.type === 'success' ? 'var(--accent-primary)' : '#ef4444'
        }}>
          {statusMsg.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Profile Details Grid */}
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

      {/* Edit Profile Modal */}
      {isEditing && (
        <div style={styles.modalOverlay}>
          <div className="glass-panel" style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Edit3 size={20} color="var(--accent-primary)" />
                <h2 style={{ margin: 0, fontSize: '20px', color: 'var(--text-primary)' }}>
                  {isKannada ? "ಪ್ರೊಫೈಲ್ ವಿವರಗಳನ್ನು ತಿದ್ದಿ" : "Edit Profile Details"}
                </h2>
              </div>
              <button onClick={() => setIsEditing(false)} style={styles.closeBtn}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} style={styles.formGrid}>
              <div style={styles.fieldGroup}>
                <label style={styles.fieldLabel}>{t("First Name")}</label>
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.fieldLabel}>{t("Last Name")}</label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  style={styles.input}
                />
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.fieldLabel}>{t("Email")}</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={styles.input}
                />
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.fieldLabel}>{t("Contact")}</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.fieldLabel}>{t("Village / Town")}</label>
                <input
                  type="text"
                  value={formData.village}
                  onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.fieldLabel}>{t("District")}</label>
                <select
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  style={styles.input}
                >
                  {KARNATAKA_DISTRICTS.map((dist) => (
                    <option key={dist} value={dist}>{dist}</option>
                  ))}
                </select>
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.fieldLabel}>
                  {isFarmer ? (isKannada ? "ಜಮೀನಿನ ವಿಸ್ತೀರ್ಣ (ಎಕರೆ)" : "Land Size (Acres)") : "Procurement Target (Acres)"}
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  value={formData.landSizeAcres}
                  onChange={(e) => setFormData({ ...formData, landSizeAcres: parseFloat(e.target.value) || 1 })}
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.fieldLabel}>
                  {isFarmer ? t("Primary Crop") : "Procurement Crop"}
                </label>
                <input
                  type="text"
                  value={formData.primaryCrop}
                  onChange={(e) => setFormData({ ...formData, primaryCrop: e.target.value })}
                  style={styles.input}
                  required
                />
              </div>

              <div style={{ ...styles.modalActions, gridColumn: '1 / -1' }}>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  style={styles.cancelBtn}
                >
                  {t("Cancel")}
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={styles.saveBtn}
                >
                  <Save size={16} />
                  <span>{saving ? (isKannada ? "ಉಳಿಸಲಾಗುತ್ತಿದೆ..." : "Saving...") : (isKannada ? "ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ" : "Save Changes")}</span>
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
    maxWidth: '900px',
    margin: '0 auto',
    fontFamily: 'var(--font-main)',
    padding: '16px 0',
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '24px',
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
  editProfileBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'var(--bg-surface)',
    color: 'var(--text-primary)',
    border: '1px solid var(--border-color)',
    padding: '8px 16px',
    borderRadius: '20px',
    fontWeight: '600',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  alertBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 18px',
    borderRadius: '12px',
    border: '1px solid',
    marginBottom: '20px',
    fontSize: '14px',
    fontWeight: '600',
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
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(5px)',
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
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
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
    borderRadius: '8px',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
    gap: '16px',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  fieldLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--text-secondary)',
  },
  input: {
    padding: '10px 14px',
    borderRadius: '10px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-input, var(--bg-surface))',
    color: 'var(--text-primary)',
    fontSize: '14px',
    outline: 'none',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '16px',
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

export default Profile;
