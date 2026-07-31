import React, { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import styles from './Dashboard.module.css';

const COLORS = ['#f39c12', '#3498db', '#9b59b6', '#2ecc71'];

interface DashboardData {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  recentOrders: any[];
  ordersByStatus: { name: string; value: number }[];
  topProducts: any[];
  revenueData: { name: string; revenue: number }[];
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/dashboard', {
      headers: {
        'Authorization': 'Bearer demo_admin_token'
      }
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.data) {
          setData(json.data);
        }
      })
      .catch((err) => console.error('Dashboard fetch error:', err))
      .finally(() => setLoading(false));
  }, []);

  const revenueData = data?.revenueData || [];
  const orderStatusData = data?.ordersByStatus || [];
  const recentOrders = data?.recentOrders || [];
  const topProducts = data?.topProducts || [];

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.header}>
        <h1 className={styles.title}>Dashboard Analytics</h1>
        <p className={styles.subtitle}>Real-time perfumery command center synced with Express REST API.</p>
      </header>

      {/* Stats Summary Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statTitle}>Total Revenue</div>
          <div className={styles.statValue}>
            ৳{(data?.totalRevenue || 0).toLocaleString()}
          </div>
          <div className={`${styles.statChange} ${styles.positive}`}>Live Backend Sync</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statTitle}>Total Orders</div>
          <div className={styles.statValue}>{data?.totalOrders ?? 0}</div>
          <div className={`${styles.statChange} ${styles.positive}`}>Live Sync</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statTitle}>Active Fragrances</div>
          <div className={styles.statValue}>{data?.totalProducts ?? 0}</div>
          <div className={styles.statChange}>Catalog Active</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statTitle}>Registered Users</div>
          <div className={styles.statValue}>{data?.totalUsers ?? 0}</div>
          <div className={`${styles.statChange} ${styles.positive}`}>Collector Circle</div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className={styles.chartsSection}>
        <div className={styles.chartCard}>
          <h2 className={styles.sectionTitle}>Revenue Analytics</h2>
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C5A880" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#C5A880" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
                <Area type="monotone" dataKey="revenue" stroke="#C5A880" fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={styles.chartCard}>
          <h2 className={styles.sectionTitle}>Orders by Status</h2>
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {orderStatusData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Orders & Top Products */}
      <div className={styles.bottomSection}>
        <div className={styles.tableCard}>
          <div className={styles.cardHeader}>
            <h2 className={styles.sectionTitle}>Recent Orders</h2>
            <a href="/orders" className={styles.viewAll}>View All</a>
          </div>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length > 0 ? (
                recentOrders.map((order: any) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.customer || order.user?.firstName || 'Collector'}</td>
                    <td>{order.date || order.createdAt?.slice(0, 10) || '2026-07-28'}</td>
                    <td>{order.total || `৳ ${order.grandTotal}`}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${styles[(order.status || 'PENDING').toLowerCase()]}`}>
                        {order.status || 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', color: '#888', padding: '2rem' }}>
                    No recent orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className={styles.topProductsCard}>
          <h2 className={styles.sectionTitle}>Top Products</h2>
          <ul className={styles.productList}>
            {topProducts.length > 0 ? (
              topProducts.map((p: any, idx: number) => (
                <li key={p.id || idx} className={styles.productItem}>
                  <div className={styles.productInfo}>
                    <div className={styles.productName}>{p.name || p.product?.name || 'Oud Extrait'}</div>
                    <div className={styles.productSales}>{p.sales || p.count || 12} sales</div>
                  </div>
                  <div className={styles.productRevenue}>{p.revenue || '৳ 45,000'}</div>
                </li>
              ))
            ) : (
              <li style={{ color: '#888', textAlign: 'center', padding: '1rem' }}>No sales records yet.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
