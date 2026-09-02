import React, { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { api } from '../api/client';
import styles from './Dashboard.module.css';

interface DashboardData {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  recentOrders: any[];
  topProducts: any[];
  revenueData: { name: string; revenue: number }[];
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ data: DashboardData }>('/admin/dashboard')
      .then((res) => {
        if (res && res.data) {
          setData(res.data);
        }
      })
      .catch((err) => console.error('Dashboard fetch error:', err))
      .finally(() => setLoading(false));
  }, []);

  const revenueData = data?.revenueData || [];
  const recentOrders = data?.recentOrders || [];
  const topProducts = data?.topProducts || [];

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading Perfumery Intelligence...</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.header}>
        <h1 className={styles.title}>Dashboard Analytics</h1>
        <p className={styles.subtitle}>Real-time perfumery command center synced with Express REST API.</p>
      </header>

      {/* KPI Stats Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statTitle}>Total Revenue</div>
          <div className={styles.statValue}>
            {data?.totalRevenue !== undefined ? `৳ ${data.totalRevenue.toLocaleString()}` : '৳ 0'}
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

      {/* Revenue Analytics Chart */}
      <div className={styles.chartsSection}>
        <div className={styles.chartCard}>
          <div className={styles.cardHeader}>
            <h2 className={styles.sectionTitle}>Revenue Analytics</h2>
            <span className={styles.chartSubtitle}>Monthly Sales Progression</span>
          </div>
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C5A880" stopOpacity={0.85}/>
                    <stop offset="95%" stopColor="#C5A880" stopOpacity={0.02}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#7A7A7C" tick={{ fill: '#9A9A9C', fontSize: 12 }} />
                <YAxis stroke="#7A7A7C" tick={{ fill: '#9A9A9C', fontSize: 12 }} tickFormatter={(val) => `৳${val}`} />
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(197, 168, 128, 0.1)" vertical={false} />
                <Tooltip
                  formatter={(value: any) => [`৳ ${Number(value).toLocaleString()}`, 'Revenue']}
                  contentStyle={{
                    backgroundColor: '#1C1C1F',
                    border: '1px solid rgba(197, 168, 128, 0.3)',
                    borderRadius: '8px',
                    color: '#F5F1E8'
                  }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#C5A880" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
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
                    <td style={{ fontWeight: 600, color: 'var(--accent-gold, #C5A880)' }}>
                      {order.orderNumber || order.id}
                    </td>
                    <td>{order.fullName || order.customer || (order.user ? `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim() : 'Collector')}</td>
                    <td>{order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-GB') : (order.date || 'Today')}</td>
                    <td style={{ fontWeight: 600 }}>{order.grandTotal ? `৳ ${Number(order.grandTotal).toLocaleString()}` : (order.total || '৳ 0')}</td>
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
            {topProducts && topProducts.length > 0 ? (
              topProducts.map((p: any, idx: number) => {
                const prodName = p.name || p.productName || p.product?.name || 'Rose Noir';
                const prodSize = p.size || p.selectedSize || '30ml';
                const prodSales = p.sales ?? p.count ?? p.quantity ?? 1;
                const unitPrice = p.unitPrice || p.price || (p.rawRevenue && prodSales ? p.rawRevenue / prodSales : 900);
                const revenueDisplay = p.revenue || (unitPrice ? `৳ ${(unitPrice * prodSales).toLocaleString()}` : (p.totalPrice ? `৳ ${Number(p.totalPrice).toLocaleString()}` : '৳ 900'));

                return (
                  <li key={p.id || idx} className={styles.productItem}>
                    <div className={styles.productInfo}>
                      <div className={styles.productName}>{prodName}</div>
                      <div className={styles.productMeta}>
                        <span className={styles.sizeTag}>{prodSize}</span>
                        <span className={styles.bullet}>•</span>
                        <span className={styles.productSales}>{prodSales} {prodSales === 1 ? 'sale' : 'sales'}</span>
                        {unitPrice ? (
                          <>
                            <span className={styles.bullet}>•</span>
                            <span className={styles.unitCost}>৳{Number(unitPrice).toLocaleString()}</span>
                          </>
                        ) : null}
                      </div>
                    </div>
                    <div className={styles.productRevenue}>{revenueDisplay}</div>
                  </li>
                );
              })
            ) : (
              <li style={{ color: '#888', textAlign: 'center', padding: '1.5rem' }}>No product sales records yet.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
