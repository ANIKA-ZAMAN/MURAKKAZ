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

const STATUS_THEMES: Record<string, { label: string; color: string; bg: string }> = {
  DELIVERED: { label: 'Delivered', color: '#10B981', bg: 'rgba(16, 185, 129, 0.15)' },
  SHIPPED: { label: 'Shipped', color: '#A855F7', bg: 'rgba(168, 85, 247, 0.15)' },
  PROCESSING: { label: 'Processing', color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.15)' },
  CONFIRMED: { label: 'Confirmed', color: '#06B6D4', bg: 'rgba(6, 182, 212, 0.15)' },
  PENDING: { label: 'Pending', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.15)' },
  CANCELLED: { label: 'Cancelled', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.15)' },
  REFUNDED: { label: 'Refunded', color: '#9CA3AF', bg: 'rgba(156, 163, 175, 0.15)' },
};

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
  const ordersByStatus = data?.ordersByStatus || [];
  const totalOrdersCount = data?.totalOrders ?? ordersByStatus.reduce((acc, s) => acc + (s.value || 0), 0);

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

      {/* Analytics Charts */}
      <div className={styles.chartsSection}>
        {/* Revenue Analytics */}
        <div className={styles.chartCard}>
          <div className={styles.cardHeader}>
            <h2 className={styles.sectionTitle}>Revenue Analytics</h2>
            <span className={styles.chartSubtitle}>Monthly Sales Progression</span>
          </div>
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={280}>
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

        {/* Enhanced Orders by Status with Readable Legend & Percentages */}
        <div className={styles.chartCard}>
          <div className={styles.cardHeader}>
            <h2 className={styles.sectionTitle}>Orders by Status</h2>
            <span className={styles.chartSubtitle}>{totalOrdersCount} Total {totalOrdersCount === 1 ? 'Order' : 'Orders'}</span>
          </div>

          <div className={styles.statusChartContainer}>
            {/* Donut Chart with Centered Total */}
            <div className={styles.donutWrapper}>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={ordersByStatus.length > 0 ? ordersByStatus : [{ name: 'None', value: 1 }]}
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={70}
                    paddingAngle={ordersByStatus.length > 1 ? 4 : 0}
                    dataKey="value"
                  >
                    {ordersByStatus.map((item, index) => {
                      const theme = STATUS_THEMES[item.name.toUpperCase()] || { color: '#C5A880' };
                      return <Cell key={`cell-${index}`} fill={theme.color} stroke="transparent" />;
                    })}
                    {ordersByStatus.length === 0 && <Cell fill="rgba(197, 168, 128, 0.2)" stroke="transparent" />}
                  </Pie>
                  <Tooltip
                    formatter={(val: any, name: any) => {
                      const count = Number(val);
                      const pct = totalOrdersCount > 0 ? Math.round((count / totalOrdersCount) * 100) : 0;
                      return [`${count} ${count === 1 ? 'Order' : 'Orders'} (${pct}%)`, name];
                    }}
                    contentStyle={{
                      backgroundColor: '#1C1C1F',
                      border: '1px solid rgba(197, 168, 128, 0.3)',
                      borderRadius: '8px',
                      color: '#F5F1E8',
                      fontSize: '0.85rem'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className={styles.donutCenterLabel}>
                <span className={styles.donutCenterValue}>{totalOrdersCount}</span>
                <span className={styles.donutCenterText}>{totalOrdersCount === 1 ? 'Order' : 'Orders'}</span>
              </div>
            </div>

            {/* Clear Status Breakdown List */}
            <div className={styles.statusLegendList}>
              {ordersByStatus.length > 0 ? (
                ordersByStatus.map((item) => {
                  const statusKey = item.name.toUpperCase();
                  const theme = STATUS_THEMES[statusKey] || { label: item.name, color: '#C5A880', bg: 'rgba(197,168,128,0.1)' };
                  const percentage = totalOrdersCount > 0 ? Math.round((item.value / totalOrdersCount) * 100) : 0;

                  return (
                    <div key={item.name} className={styles.statusLegendItem}>
                      <div className={styles.statusLegendHeader}>
                        <div className={styles.statusLabelWrap}>
                          <span className={styles.statusIndicator} style={{ backgroundColor: theme.color }} />
                          <span className={styles.statusLabelName}>{theme.label}</span>
                        </div>
                        <div className={styles.statusValues}>
                          <span className={styles.statusCount}>{item.value} {item.value === 1 ? 'order' : 'orders'}</span>
                          <span className={styles.statusPercent}>{percentage}%</span>
                        </div>
                      </div>
                      <div className={styles.statusBarBg}>
                        <div
                          className={styles.statusBarFill}
                          style={{ width: `${percentage}%`, backgroundColor: theme.color }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className={styles.noStatusOrders}>No orders recorded yet.</div>
              )}
            </div>
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
