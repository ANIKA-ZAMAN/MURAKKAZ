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
import { api } from '../api/client';
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
