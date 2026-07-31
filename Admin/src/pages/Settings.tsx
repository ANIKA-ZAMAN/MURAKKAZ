import React, { useState } from 'react';
import { 
  User, 
  ShieldCheck, 
  CreditCard, 
  Bell, 
  Save, 
  Key, 
  CheckCircle2,
  Lock,
  Smartphone
} from 'lucide-react';
import styles from './Settings.module.css';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Profile');
  const [savedMsg, setSavedMsg] = useState('');

  // Profile States
  const [name, setName] = useState('Sadid Admin');
  const [email, setEmail] = useState('admin@murakkaz.com');
  const [phone, setPhone] = useState('+880 1735-494949');

  // Security States
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  // Payment Gateway States
  const [bkashEnabled, setBkashEnabled] = useState(true);
  const [bkashAppKey, setBkashAppKey] = useState('bkash_live_app_key_84920');
  const [sslCommerzStoreId, setSslCommerzStoreId] = useState('murakkaz_store_live');

  // Notification States
  const [orderAlerts, setOrderAlerts] = useState(true);
  const [reviewAlerts, setReviewAlerts] = useState(true);
  const [lowStockAlerts, setLowStockAlerts] = useState(true);

  const handleSave = (msg: string) => {
    setSavedMsg(msg);
    setTimeout(() => setSavedMsg(''), 3000);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h1>Admin Portal & Security Settings</h1>
          <p>Manage administrative credentials, payment gateway keys, and automated system alerts.</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'Profile' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('Profile')}
        >
          Admin Profile
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'Security' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('Security')}
        >
          Security & Password
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'Payments' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('Payments')}
        >
          Payment Gateways
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'Notifications' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('Notifications')}
        >
          Notifications & Alerts
        </button>
      </div>

      {/* Settings Tab Card */}
      <div className={styles.card}>
        {activeTab === 'Profile' && (
          <form onSubmit={(e) => { e.preventDefault(); handleSave('Profile updated successfully!'); }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: '#F5F1E8', marginBottom: '1rem' }}>
              Administrator Profile Info
            </h2>

            <div className={styles.formGroup} style={{ marginBottom: '1.25rem' }}>
              <label className={styles.label}>Full Administrator Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup} style={{ marginBottom: '1.25rem' }}>
              <label className={styles.label}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup} style={{ marginBottom: '1.25rem' }}>
              <label className={styles.label}>Hotline Contact Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={styles.input}
                required
              />
            </div>

            <button type="submit" className={styles.saveBtn}>
              <Save size={16} /> Update Profile
            </button>
            {savedMsg && <div className={styles.toastMsg} style={{ marginTop: '0.75rem' }}>✓ {savedMsg}</div>}
          </form>
        )}

        {activeTab === 'Security' && (
          <form onSubmit={(e) => { e.preventDefault(); handleSave('Password changed successfully!'); }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: '#F5F1E8', marginBottom: '1rem' }}>
              Security & Credentials
            </h2>

            <div className={styles.formGroup} style={{ marginBottom: '1.25rem' }}>
              <label className={styles.label}>Current Password</label>
              <input
                type="password"
                value={currentPass}
                onChange={(e) => setCurrentPass(e.target.value)}
                placeholder="••••••••••••"
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup} style={{ marginBottom: '1.25rem' }}>
              <label className={styles.label}>New Password</label>
              <input
                type="password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="At least 8 characters..."
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup} style={{ marginBottom: '1.25rem' }}>
              <label className={styles.label}>Confirm New Password</label>
              <input
                type="password"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                placeholder="Repeat new password..."
                className={styles.input}
                required
              />
            </div>

            <button type="submit" className={styles.saveBtn}>
              <Lock size={16} /> Update Password
            </button>
            {savedMsg && <div className={styles.toastMsg} style={{ marginTop: '0.75rem' }}>✓ {savedMsg}</div>}
          </form>
        )}

        {activeTab === 'Payments' && (
          <form onSubmit={(e) => { e.preventDefault(); handleSave('Payment Gateway Settings Saved!'); }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: '#F5F1E8', marginBottom: '1rem' }}>
              Payment Gateways & Wallet Settings
            </h2>

            <div className={styles.toggleRow}>
              <div>
                <div style={{ fontWeight: 500, fontSize: '0.95rem', color: '#F5F1E8' }}>bKash Direct Checkout</div>
                <div style={{ fontSize: '0.8rem', color: '#A0A0A5' }}>Enable mobile wallet payments via bKash API</div>
              </div>
              <input
                type="checkbox"
                checked={bkashEnabled}
                onChange={(e) => setBkashEnabled(e.target.checked)}
                style={{ width: '20px', height: '20px', accentColor: '#820011', cursor: 'pointer' }}
              />
            </div>

            <div className={styles.formGroup} style={{ marginBottom: '1.25rem' }}>
              <label className={styles.label}>bKash App Key</label>
              <input
                type="text"
                value={bkashAppKey}
                onChange={(e) => setBkashAppKey(e.target.value)}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup} style={{ marginBottom: '1.25rem' }}>
              <label className={styles.label}>SSLCommerz Store ID</label>
              <input
                type="text"
                value={sslCommerzStoreId}
                onChange={(e) => setSslCommerzStoreId(e.target.value)}
                className={styles.input}
              />
            </div>

            <button type="submit" className={styles.saveBtn}>
              <Save size={16} /> Save Gateway Keys
            </button>
            {savedMsg && <div className={styles.toastMsg} style={{ marginTop: '0.75rem' }}>✓ {savedMsg}</div>}
          </form>
        )}

        {activeTab === 'Notifications' && (
          <form onSubmit={(e) => { e.preventDefault(); handleSave('Notification Preferences Saved!'); }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: '#F5F1E8', marginBottom: '1rem' }}>
              Automated Email & System Alerts
            </h2>

            <div className={styles.toggleRow}>
              <div>
                <div style={{ fontWeight: 500, fontSize: '0.95rem', color: '#F5F1E8' }}>New Order Email Alerts</div>
                <div style={{ fontSize: '0.8rem', color: '#A0A0A5' }}>Receive instant notification on every customer purchase</div>
              </div>
              <input
                type="checkbox"
                checked={orderAlerts}
                onChange={(e) => setOrderAlerts(e.target.checked)}
                style={{ width: '20px', height: '20px', accentColor: '#820011', cursor: 'pointer' }}
              />
            </div>

            <div className={styles.toggleRow}>
              <div>
                <div style={{ fontWeight: 500, fontSize: '0.95rem', color: '#F5F1E8' }}>Review Moderation Alerts</div>
                <div style={{ fontSize: '0.8rem', color: '#A0A0A5' }}>Notify when a customer submits a new fragrance review</div>
              </div>
              <input
                type="checkbox"
                checked={reviewAlerts}
                onChange={(e) => setReviewAlerts(e.target.checked)}
                style={{ width: '20px', height: '20px', accentColor: '#820011', cursor: 'pointer' }}
              />
            </div>

            <div className={styles.toggleRow}>
              <div>
                <div style={{ fontWeight: 500, fontSize: '0.95rem', color: '#F5F1E8' }}>Low Inventory Warnings</div>
                <div style={{ fontSize: '0.8rem', color: '#A0A0A5' }}>Trigger alert when product stock drops below 5 bottles</div>
              </div>
              <input
                type="checkbox"
                checked={lowStockAlerts}
                onChange={(e) => setLowStockAlerts(e.target.checked)}
                style={{ width: '20px', height: '20px', accentColor: '#820011', cursor: 'pointer' }}
              />
            </div>

            <button type="submit" className={styles.saveBtn}>
              <Save size={16} /> Save Preferences
            </button>
            {savedMsg && <div className={styles.toastMsg} style={{ marginTop: '0.75rem' }}>✓ {savedMsg}</div>}
          </form>
        )}
      </div>
    </div>
  );
};

export default Settings;
