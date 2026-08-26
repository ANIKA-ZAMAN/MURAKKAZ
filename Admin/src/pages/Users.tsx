import React, { useState, useEffect } from 'react';
import { 
  Users as UsersIcon, 
  Search, 
  Award, 
  Crown, 
  RefreshCw,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { api } from '../api/client';
import styles from './Users.module.css';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  tier: string;
  points: number;
  ordersCount: number;
  role?: string;
  joinedDate: string;
}

const Users: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState('All');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get<{ data: Customer[] }>('/admin/users');
      if (res && res.data) {
        setCustomers(res.data);
      }
    } catch (err) {
      console.error('Failed to load users from backend:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTier = selectedTier === 'All' || c.tier === selectedTier;

    return matchesSearch && matchesTier;
  });

  const totalPoints = customers.reduce((sum, c) => sum + (c.points || 0), 0);
  const vvipCount = customers.filter((c) => c.tier === 'Gold VVIP' || c.tier === 'Collector Circle').length;
  const avgOrders = customers.length > 0
    ? (customers.reduce((sum, c) => sum + (c.ordersCount || 0), 0) / customers.length).toFixed(1)
    : '0';

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h1>Customer Directory & Collector Circle</h1>
          <p>View live registered accounts, reward points balances, and VIP member tiers.</p>
        </div>
        <button 
          onClick={fetchUsers}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            background: '#820011',
            color: '#F5F1E8',
            border: '1px solid rgba(197, 168, 128, 0.3)',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 500
          }}
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh Customers
        </button>
      </div>

      {/* Stat Summary Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <UsersIcon size={22} />
          </div>
          <div className={styles.statInfo}>
            <h4>Total Customers</h4>
            <p>{customers.length}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ color: '#C5A880', background: 'rgba(197, 168, 128, 0.08)' }}>
            <Crown size={22} />
          </div>
          <div className={styles.statInfo}>
            <h4>Collector Circle VIPs</h4>
            <p>{vvipCount}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ color: '#34D399', background: 'rgba(52, 211, 153, 0.08)' }}>
            <Award size={22} />
          </div>
          <div className={styles.statInfo}>
            <h4>Total Reward Points</h4>
            <p>{totalPoints.toLocaleString()} PTS</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ color: '#FBBF24', background: 'rgba(251, 191, 36, 0.08)' }}>
            <ShoppingBag size={22} />
          </div>
          <div className={styles.statInfo}>
            <h4>Avg. Order Count</h4>
            <p>{avgOrders} Orders</p>
          </div>
        </div>
      </div>

      {/* Controls Bar: Search & Filter */}
      <div className={styles.controlsBar}>
        <div className={styles.searchGroup}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search customer name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div>
          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            className={styles.selectInput}
          >
            <option value="All">All Member Tiers</option>
            <option value="Collector Circle">Collector Circle</option>
            <option value="Gold VVIP">Gold VVIP</option>
            <option value="Silver Member">Silver Member</option>
          </select>
        </div>
      </div>

      {/* Main Customers Table */}
      <div className={styles.tableCard}>
        <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table className={styles.table} style={{ width: '100%', minWidth: '700px' }}>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Contact Info</th>
                <th>Member Tier</th>
                <th>Reward Points</th>
                <th>Orders Count</th>
                <th>Joined Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: '#A0A0A5' }}>
                    Loading customer directory...
                  </td>
                </tr>
              ) : filteredCustomers.length > 0 ? (
                filteredCustomers.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div className={styles.userCell}>
                        <div className={styles.avatar}>{(c.name || 'U').charAt(0)}</div>
                        <div>
                          <div style={{ fontFamily: 'Playfair Display, serif', fontWeight: 500, color: 'var(--text-primary, #F5F1E8)' }}>
                            {c.name}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary, #9A9A9C)' }}>
                            {c.role === 'ADMIN' ? 'Administrator' : `ID: #${c.id.slice(0, 8)}`}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '0.85rem' }}>
                        <span style={{ color: 'var(--text-primary, #F5F1E8)' }}>{c.email}</span>
                        <span style={{ color: 'var(--text-secondary, #9A9A9C)' }}>{c.phone}</span>
                      </div>
                    </td>
                    <td>
                      {c.tier === 'Gold VVIP' ? (
                        <span className={styles.tierGold}>
                          <Crown size={12} /> {c.tier}
                        </span>
                      ) : (
                        <span className={styles.tierCollector}>
                          <Sparkles size={12} /> {c.tier || 'Collector Circle'}
                        </span>
                      )}
                    </td>
                    <td>
                      <span className={styles.pointsBadge}>
                        <Award size={14} /> {c.points || 0} PTS
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 500, color: 'var(--text-primary, #F5F1E8)' }}>{c.ordersCount || 0} Orders</span>
                    </td>
                    <td>{c.joinedDate}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: '#A0A0A5' }}>
                    No customer accounts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
