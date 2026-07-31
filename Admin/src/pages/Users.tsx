import React, { useState } from 'react';
import { 
  Users as UsersIcon, 
  Search, 
  Award, 
  Crown, 
  Mail, 
  Phone, 
  Calendar,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import styles from './Users.module.css';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  tier: 'Collector Circle' | 'Gold VVIP' | 'Silver Member';
  points: number;
  ordersCount: number;
  joinedDate: string;
}

const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'usr-1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    phone: '+880 1911-111111',
    tier: 'Collector Circle',
    points: 1250,
    ordersCount: 8,
    joinedDate: '2025-01-15'
  },
  {
    id: 'usr-2',
    name: 'Zaman Al-Hassan',
    email: 'zaman@murakkaz.com',
    phone: '+880 1712-345678',
    tier: 'Gold VVIP',
    points: 3400,
    ordersCount: 14,
    joinedDate: '2024-11-02'
  },
  {
    id: 'usr-3',
    name: 'Mahmudur Rahman',
    email: 'mahmud@gmail.com',
    phone: '+880 1819-887766',
    tier: 'Collector Circle',
    points: 850,
    ordersCount: 5,
    joinedDate: '2025-03-20'
  },
  {
    id: 'usr-4',
    name: 'Sabrina Chowdhury',
    email: 'sabrina@hotmail.com',
    phone: '+880 1622-445566',
    tier: 'Silver Member',
    points: 420,
    ordersCount: 3,
    joinedDate: '2025-04-10'
  }
];

const Users: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState('All');

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTier = selectedTier === 'All' || c.tier === selectedTier;

    return matchesSearch && matchesTier;
  });

  const totalPoints = customers.reduce((sum, c) => sum + c.points, 0);
  const vvipCount = customers.filter((c) => c.tier === 'Gold VVIP' || c.tier === 'Collector Circle').length;

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h1>Customer Directory & Collector Circle</h1>
          <p>View registered accounts, reward points balances, and VIP member tiers.</p>
        </div>
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
            <p>7.5 Orders</p>
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
        <table className={styles.table}>
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
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div className={styles.userCell}>
                      <div className={styles.avatar}>{c.name.charAt(0)}</div>
                      <div>
                        <div style={{ fontFamily: 'Playfair Display, serif', fontWeight: 500, color: '#F5F1E8' }}>
                          {c.name}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#A0A0A5' }}>ID: #{c.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '0.85rem' }}>
                      <span style={{ color: '#F5F1E8' }}>{c.email}</span>
                      <span style={{ color: '#A0A0A5' }}>{c.phone}</span>
                    </div>
                  </td>
                  <td>
                    {c.tier === 'Gold VVIP' ? (
                      <span className={styles.tierGold}>
                        <Crown size={12} /> {c.tier}
                      </span>
                    ) : (
                      <span className={styles.tierCollector}>
                        <Sparkles size={12} /> {c.tier}
                      </span>
                    )}
                  </td>
                  <td>
                    <span className={styles.pointsBadge}>
                      <Award size={14} /> {c.points} PTS
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 500, color: '#F5F1E8' }}>{c.ordersCount} Orders</span>
                  </td>
                  <td>{c.joinedDate}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: '#A0A0A5' }}>
                  No customer records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
