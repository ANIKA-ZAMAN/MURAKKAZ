import React, { useState } from 'react';
import { 
  Store, 
  Plus, 
  MapPin, 
  Phone, 
  Clock, 
  Edit3, 
  Trash2, 
  Building2,
  Users
} from 'lucide-react';
import styles from './Stores.module.css';

interface StoreItem {
  id: string;
  name: string;
  address: string;
  zone: string;
  contract: string;
  hours: string;
}

const INITIAL_STORES: StoreItem[] = [
  {
    id: '01',
    name: 'Banani Flagship Atelier',
    address: 'House 45, Road 11, Block H, Banani, Dhaka - 1213',
    zone: 'Dhaka, Banani',
    contract: '+880 1735-494949',
    hours: '10:00 AM - 9:00 PM Daily'
  },
  {
    id: '02',
    name: 'Dhanmondi Boutique',
    address: 'Level 3, Shimanto Square, Dhanmondi, Dhaka - 1209',
    zone: 'Dhaka, Dhanmondi',
    contract: '+880 1745-595959',
    hours: '10:00 AM - 8:30 PM Daily'
  },
  {
    id: '03',
    name: 'Chattogram Heritage Lounge',
    address: 'GEC Circle, Central Shopping Arcade, Level 1, Chattogram - 4000',
    zone: 'Chattogram, Nasirabad',
    contract: '+880 1765-898989',
    hours: '11:00 AM - 9:00 PM Daily'
  }
];

const Stores: React.FC = () => {
  const [stores, setStores] = useState<StoreItem[]>(INITIAL_STORES);
  const [showModal, setShowModal] = useState(false);
  const [editingStore, setEditingStore] = useState<StoreItem | null>(null);

  const [formName, setFormName] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formZone, setFormZone] = useState('Dhaka, Banani');
  const [formPhone, setFormPhone] = useState('');
  const [formHours, setFormHours] = useState('10:00 AM - 9:00 PM Daily');

  const handleOpenAdd = () => {
    setEditingStore(null);
    setFormName('');
    setFormAddress('');
    setFormZone('Dhaka, Banani');
    setFormPhone('');
    setFormHours('10:00 AM - 9:00 PM Daily');
    setShowModal(true);
  };

  const handleOpenEdit = (store: StoreItem) => {
    setEditingStore(store);
    setFormName(store.name);
    setFormAddress(store.address);
    setFormZone(store.zone);
    setFormPhone(store.contract);
    setFormHours(store.hours);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this store location?')) {
      setStores((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStore) {
      setStores((prev) =>
        prev.map((s) =>
          s.id === editingStore.id
            ? { ...s, name: formName, address: formAddress, zone: formZone, contract: formPhone, hours: formHours }
            : s
        )
      );
    } else {
      const newStore: StoreItem = {
        id: String(Date.now()),
        name: formName || 'New Atelier Boutique',
        address: formAddress,
        zone: formZone,
        contract: formPhone,
        hours: formHours
      };
      setStores((prev) => [...prev, newStore]);
    }
    setShowModal(false);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h1>Store Locations & Ateliers</h1>
          <p>Manage physical boutique addresses, customer hotline phones, and operating hours.</p>
        </div>
        <button type="button" className={styles.addBtn} onClick={handleOpenAdd}>
          <Plus size={18} /> Add New Store
        </button>
      </div>

      {/* Stat Summary Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Building2 size={22} />
          </div>
          <div className={styles.statInfo}>
            <h4>Active Boutiques</h4>
            <p>{stores.length}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ color: '#34D399', background: 'rgba(52, 211, 153, 0.08)' }}>
            <MapPin size={22} />
          </div>
          <div className={styles.statInfo}>
            <h4>Cities Covered</h4>
            <p>2 Cities</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ color: '#FBBF24', background: 'rgba(251, 191, 36, 0.08)' }}>
            <Users size={22} />
          </div>
          <div className={styles.statInfo}>
            <h4>Monthly Footfall</h4>
            <p>8.5K Visitors</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ color: '#C5A880', background: 'rgba(197, 168, 128, 0.08)' }}>
            <Phone size={22} />
          </div>
          <div className={styles.statInfo}>
            <h4>Support Hotline</h4>
            <p>24/7 Active</p>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Boutique & Location</th>
              <th>City Zone</th>
              <th>Contact Phone</th>
              <th>Opening Hours</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((store) => (
              <tr key={store.id}>
                <td>
                  <div>
                    <div style={{ fontFamily: 'Playfair Display, serif', fontWeight: 500, fontSize: '1rem', color: '#F5F1E8', marginBottom: '4px' }}>
                      {store.name}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#A0A0A5', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={12} style={{ color: '#C5A880' }} /> {store.address}
                    </div>
                  </div>
                </td>
                <td>
                  <span className={styles.zoneBadge}>{store.zone}</span>
                </td>
                <td>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem' }}>
                    <Phone size={14} style={{ color: '#34D399' }} /> {store.contract}
                  </span>
                </td>
                <td>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#A0A0A5' }}>
                    <Clock size={14} /> {store.hours}
                  </span>
                </td>
                <td>
                  <div className={styles.actions}>
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(store)}
                      className={styles.actionBtn}
                      title="Edit Location"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(store.id)}
                      className={`${styles.actionBtn} ${styles.deleteBtn}`}
                      title="Delete Location"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Dialog */}
      {showModal && (
        <div className={styles.modal}>
          <form onSubmit={handleSave} className={styles.modalContent}>
            <h2>{editingStore ? 'Edit Store Location' : 'Add New Boutique Location'}</h2>

            <div className={styles.formGroup}>
              <label>Store Name</label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. Banani Flagship Atelier"
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>City Zone</label>
              <select
                value={formZone}
                onChange={(e) => setFormZone(e.target.value)}
                className={styles.select}
              >
                <option value="Dhaka, Banani">Dhaka, Banani</option>
                <option value="Dhaka, Dhanmondi">Dhaka, Dhanmondi</option>
                <option value="Dhaka, Gulshan">Dhaka, Gulshan</option>
                <option value="Chattogram, Nasirabad">Chattogram, Nasirabad</option>
                <option value="Sylhet, Zindabazar">Sylhet, Zindabazar</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Full Address</label>
              <textarea
                rows={3}
                value={formAddress}
                onChange={(e) => setFormAddress(e.target.value)}
                placeholder="House 45, Road 11, Block H..."
                className={styles.textarea}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Contact Phone</label>
              <input
                type="text"
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
                placeholder="+880 1735-XXXXXX"
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Operating Hours</label>
              <input
                type="text"
                value={formHours}
                onChange={(e) => setFormHours(e.target.value)}
                placeholder="10:00 AM - 9:00 PM Daily"
                className={styles.input}
                required
              />
            </div>

            <div className={styles.modalActions}>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className={styles.cancelBtn}
              >
                Cancel
              </button>
              <button type="submit" className={styles.saveBtn}>
                {editingStore ? 'Save Changes' : 'Create Location'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Stores;
