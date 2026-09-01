import React, { useState, useEffect } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  Activity, Users, Eye, ShoppingCart, TrendingUp,
  Globe, Smartphone, DollarSign, Package, Compass,
  Layers, MapPin, RefreshCw, Clock, Award
} from 'lucide-react';
import { api } from '../../api/client';
import styles from './Analytics.module.css';

const CHART_COLORS = ['#820011', '#C5A880', '#2563eb', '#16a34a', '#d97706', '#9333ea', '#0891b2'];

const tooltipStyle = {
  backgroundColor: '#1C1C1F',
  borderColor: 'rgba(197, 168, 128, 0.35)',
  color: '#F5F1E8',
  borderRadius: '8px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
  fontSize: '0.85rem'
};

export default function Analytics() {
  const [period, setPeriod] = useState<string>('7d');
  const [activeTab, setActiveTab] = useState<'traffic' | 'orders' | 'customers' | 'products'>('traffic');
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Analytics states
  const [overview, setOverview] = useState<any>(null);
  const [traffic, setTraffic] = useState<any>(null);
  const [pages, setPages] = useState<any[]>([]);
  const [orders, setOrders] = useState<any>(null);
  const [customers, setCustomers] = useState<any>(null);
  const [products, setProducts] = useState<any>(null);
  const [realtime, setRealtime] = useState<any>(null);

  const fetchAllAnalytics = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const [
        overviewRes,
        trafficRes,
        pagesRes,
        ordersRes,
        customersRes,
        productsRes,
        realtimeRes
      ] = await Promise.all([
        api.get<any>(`/admin/analytics/overview?period=${period}`),
        api.get<any>(`/admin/analytics/traffic?period=${period}`),
        api.get<any>(`/admin/analytics/pages?period=${period}`),
        api.get<any>(`/admin/analytics/orders?period=${period}`),
        api.get<any>(`/admin/analytics/customers?period=${period}`),
        api.get<any>(`/admin/analytics/products?period=${period}`),
        api.get<any>('/admin/analytics/realtime')
      ]);

      if (overviewRes?.data) setOverview(overviewRes.data);
      if (trafficRes?.data) setTraffic(trafficRes.data);
      if (pagesRes?.data) setPages(pagesRes.data);
      if (ordersRes?.data) setOrders(ordersRes.data);
      if (customersRes?.data) setCustomers(customersRes.data);
      if (productsRes?.data) setProducts(productsRes.data);
      if (realtimeRes?.data) setRealtime(realtimeRes.data);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAllAnalytics();
    const interval = setInterval(() => {
      api.get<any>('/admin/analytics/realtime').then(res => {
        if (res?.data) setRealtime(res.data);
      }).catch(() => {});
    }, 15000);
    return () => clearInterval(interval);
  }, [period]);

  if (loading && !overview) {
    return (
      <div className={styles.loadingBox}>
        <div className={styles.spinner} />
        <p>Loading 360° Murakkaz Analytics...</p>
      </div>
    );
  }

  const liveActiveCount = realtime?.activeUsersCount || overview?.liveActiveVisitors || 0;

  return (
    <div className={styles.container}>
      {/* Header & Date Range Controls */}
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>360° Business & Traffic Analytics</h1>
          <p className={styles.subtitle}>Real-time store traffic, page journeys, customer retention & revenue intelligence.</p>
        </div>

        <div className={styles.controls}>
          <div className={styles.periodButtons}>
            {[
              { id: 'today', label: 'Today' },
              { id: 'yesterday', label: 'Yesterday' },
              { id: '7d', label: 'Last 7 Days' },
              { id: '30d', label: 'Last 30 Days' },
              { id: 'month', label: 'This Month' },
              { id: 'all', label: 'All Time' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setPeriod(p.id)}
                className={`${styles.periodBtn} ${period === p.id ? styles.periodBtnActive : ''}`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => fetchAllAnalytics(true)}
            className={styles.refreshBtn}
            disabled={refreshing}
            aria-label="Refresh data"
          >
            <RefreshCw size={15} className={refreshing ? styles.spinner : ''} />
            {refreshing ? 'Updating...' : 'Refresh'}
          </button>
        </div>
      </header>

      {/* Top Level Executive Summary Cards */}
      <div className={styles.kpiGrid}>
        {/* Live Pulse */}
        <div className={styles.kpiCard} style={{ borderLeft: '4px solid #22c55e' }}>
          <div className={styles.kpiTop}>
            <span className={styles.kpiTitle}>Live On-Site</span>
            <span className={styles.liveBadge}>
              <span className={styles.liveDot} /> LIVE
            </span>
          </div>
          <div className={styles.kpiValue}>{liveActiveCount}</div>
          <div className={styles.kpiSubtext}>Active in last 5 minutes</div>
        </div>

        {/* Total Unique Visitors */}
        <div className={styles.kpiCard}>
          <div className={styles.kpiTop}>
            <span className={styles.kpiTitle}>Unique Visitors</span>
            <div className={styles.kpiIconWrap}><Users size={18} /></div>
          </div>
          <div className={styles.kpiValue}>{(overview?.uniqueVisitors || 0).toLocaleString()}</div>
          <div className={styles.kpiSubtext}>{(overview?.totalSessions || 0).toLocaleString()} total sessions</div>
        </div>

        {/* Total Pageviews */}
        <div className={styles.kpiCard}>
          <div className={styles.kpiTop}>
            <span className={styles.kpiTitle}>Total Pageviews</span>
            <div className={styles.kpiIconWrap}><Eye size={18} /></div>
          </div>
          <div className={styles.kpiValue}>{(overview?.totalPageviews || 0).toLocaleString()}</div>
          <div className={styles.kpiSubtext}>{overview?.avgPagesPerSession || 1} pages / visit avg</div>
        </div>

        {/* Bounce Rate */}
        <div className={styles.kpiCard}>
          <div className={styles.kpiTop}>
            <span className={styles.kpiTitle}>Bounce Rate</span>
            <div className={styles.kpiIconWrap}><Compass size={18} /></div>
          </div>
          <div className={styles.kpiValue}>{overview?.bounceRate || 0}%</div>
          <div className={styles.kpiSubtext}>Single page exits</div>
        </div>

        {/* Gross Revenue */}
        <div className={styles.kpiCard}>
          <div className={styles.kpiTop}>
            <span className={styles.kpiTitle}>Gross Revenue</span>
            <div className={styles.kpiIconWrap}><DollarSign size={18} /></div>
          </div>
          <div className={styles.kpiValue}>৳{(overview?.totalRevenue || 0).toLocaleString()}</div>
          <div className={styles.kpiSubtext}>৳{(overview?.deliveredRevenue || 0).toLocaleString()} collected</div>
        </div>

        {/* Conversion Rate */}
        <div className={styles.kpiCard}>
          <div className={styles.kpiTop}>
            <span className={styles.kpiTitle}>Conversion Rate</span>
            <div className={styles.kpiIconWrap}><TrendingUp size={18} /></div>
          </div>
          <div className={styles.kpiValue}>{overview?.conversionRate || 0}%</div>
          <div className={styles.kpiSubtext}>{overview?.totalOrders || 0} orders placed</div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className={styles.tabsBar}>
        <button
          className={`${styles.tabBtn} ${activeTab === 'traffic' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('traffic')}
        >
          <Globe size={18} /> Traffic & Browsing
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'orders' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          <ShoppingCart size={18} /> Orders & Revenue
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'customers' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('customers')}
        >
          <Users size={18} /> Customers & Retention
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'products' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('products')}
        >
          <Package size={18} /> Fragrances & Sizes
        </button>
      </div>

      {/* TAB 1: TRAFFIC & BROWSING */}
      {activeTab === 'traffic' && (
        <>
          {/* Real-time active visitors live feed if any */}
          {realtime?.activeVisitors && realtime.activeVisitors.length > 0 && (
            <div className={styles.card} style={{ marginBottom: '1.5rem', border: '1px solid rgba(34, 197, 94, 0.4)' }}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>
                  <Activity size={20} color="#22c55e" /> Active Shoppers Right Now ({realtime.activeVisitors.length})
                </h3>
              </div>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Location</th>
                      <th>Device & Browser</th>
                      <th>Active Page</th>
                      <th>Traffic Source</th>
                      <th>Views</th>
                    </tr>
                  </thead>
                  <tbody>
                    {realtime.activeVisitors.map((v: any, idx: number) => (
                      <tr key={idx}>
                        <td><strong>{v.city}</strong>, {v.country}</td>
                        <td>{v.device} • {v.browser}</td>
                        <td><code style={{ background: 'var(--bg-elevated, #2A2A2D)', color: 'var(--accent-gold, #C5A880)', padding: '3px 8px', borderRadius: '4px', border: '1px solid var(--border-subtle, rgba(197, 168, 128, 0.15))' }}>{v.exitPage || v.landingPage}</code></td>
                        <td><span className={styles.badgeTag}>{v.referrerSource}</span></td>
                        <td>{v.pageviewCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className={styles.gridTwo}>
            {/* Traffic Sources Acquisition */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}><Globe size={18} /> Traffic Sources & Acquisition</h3>
              </div>
              <div className={styles.chartContainer}>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={traffic?.sources || []}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      innerRadius={55}
                      paddingAngle={4}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {(traffic?.sources || []).map((_: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Geographic Breakdown */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}><MapPin size={18} /> Top Visitor Cities</h3>
              </div>
              <div className={styles.chartContainer}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={traffic?.cities || []}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#820011" radius={[6, 6, 0, 0]} name="Visitors" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className={styles.gridTwo}>
            {/* Top Visited Pages */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}><Eye size={18} /> Most Visited Pages & Fragrances</h3>
              </div>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Page Path</th>
                      <th>Views</th>
                      <th>Uniques</th>
                      <th>Avg Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pages.map((p, idx) => (
                      <tr key={idx}>
                        <td><strong>{p.path}</strong></td>
                        <td>{p.pageviews}</td>
                        <td>{p.uniqueVisitors}</td>
                        <td>{p.avgTimeOnPage > 0 ? `${Math.floor(p.avgTimeOnPage / 60)}m ${p.avgTimeOnPage % 60}s` : '< 10s'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Devices & Hardware */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}><Smartphone size={18} /> Devices & Operating Systems</h3>
              </div>
              <div className={styles.chartContainer}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={traffic?.devices || []} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#eee" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={80} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#C5A880" radius={[0, 6, 6, 0]} name="Sessions" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}

      {/* TAB 2: ORDERS & REVENUE */}
      {activeTab === 'orders' && (
        <>
          {/* Revenue Trend Over Time */}
          <div className={styles.card} style={{ marginBottom: '1.5rem' }}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}><TrendingUp size={18} /> Daily Revenue Trend</h3>
            </div>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={orders?.revenueTrend || []}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#820011" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#820011" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => `৳${Number(value).toLocaleString()}`} />
                  <Area type="monotone" dataKey="revenue" stroke="#820011" fillOpacity={1} fill="url(#colorRev)" name="Revenue (৳)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={styles.gridThree}>
            {/* Order Status Distribution */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}><Package size={18} /> Order Status</h3>
              </div>
              <div className={styles.chartContainer}>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={orders?.statusBreakdown || []}
                      dataKey="count"
                      nameKey="status"
                      cx="50%"
                      cy="50%"
                      outerRadius={85}
                      label={({ status, count }) => `${status}: ${count}`}
                    >
                      {(orders?.statusBreakdown || []).map((_: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Payment Methods */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}><DollarSign size={18} /> Payment Methods</h3>
              </div>
              <div className={styles.chartContainer}>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={orders?.paymentMethods || []}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                    <XAxis dataKey="method" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#C5A880" radius={[6, 6, 0, 0]} name="Orders" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Delivery Zones */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}><MapPin size={18} /> Delivery Zone Split</h3>
              </div>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Zone</th>
                      <th>Orders</th>
                      <th>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(orders?.locationBreakdown || []).map((loc: any, idx: number) => (
                      <tr key={idx}>
                        <td><strong>{loc.name}</strong></td>
                        <td>{loc.count}</td>
                        <td>৳{loc.revenue.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Peak Shopping Hours Heatmap */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}><Clock size={18} /> Peak Shopping Hours Heatmap</h3>
            </div>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={orders?.hourlyHeatmap || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#820011" radius={[4, 4, 0, 0]} name="Orders Placed" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {/* TAB 3: CUSTOMERS & RETENTION */}
      {activeTab === 'customers' && (
        <>
          <div className={styles.gridTwo}>
            {/* E-Commerce Funnel */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}><TrendingUp size={18} /> E-Commerce Conversion Funnel</h3>
              </div>
              <div className={styles.funnelList}>
                {(customers?.conversionFunnel || []).map((stage: any, idx: number) => (
                  <div key={idx} className={styles.funnelItem}>
                    <div className={styles.funnelHeader}>
                      <span>{stage.stage}</span>
                      <span><strong>{stage.count.toLocaleString()}</strong> ({stage.pct}%)</span>
                    </div>
                    <div className={styles.funnelBarBg}>
                      <div className={styles.funnelBarFill} style={{ width: `${Math.max(4, stage.pct)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Retention Metrics */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}><Users size={18} /> Customer Retention Metrics</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginTop: '1rem' }}>
                <div style={{ padding: '1.2rem', background: 'var(--bg-elevated, #2A2A2D)', border: '1px solid var(--border-subtle, rgba(197, 168, 128, 0.15))', borderRadius: '12px' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary, #9A9A9C)' }}>Repeat Purchase Rate</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--brand-maroon, #820011)' }}>
                    {customers?.repeatPurchaseRate || 0}%
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary, #9A9A9C)' }}>
                    {customers?.repeatCustomersCount || 0} repeat customers
                  </div>
                </div>

                <div style={{ padding: '1.2rem', background: 'var(--bg-elevated, #2A2A2D)', border: '1px solid var(--border-subtle, rgba(197, 168, 128, 0.15))', borderRadius: '12px' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary, #9A9A9C)' }}>Customer Lifetime Value</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--accent-gold, #C5A880)' }}>
                    ৳{(customers?.averageCustomerLifetimeValue || 0).toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary, #9A9A9C)' }}>Average spend per customer</div>
                </div>
              </div>
            </div>
          </div>

          {/* VIP Customers Spenders Leaderboard */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}><Award size={18} /> VIP Collectors Leaderboard</h3>
            </div>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Customer Name</th>
                    <th>Email / Phone</th>
                    <th>Orders Placed</th>
                    <th>Total Spent</th>
                    <th>Favorite Fragrance</th>
                    <th>Collector Since</th>
                  </tr>
                </thead>
                <tbody>
                  {(customers?.vipLeaderboard || []).map((vip: any, idx: number) => (
                    <tr key={idx}>
                      <td><strong>{vip.fullName}</strong></td>
                      <td>{vip.phone !== 'N/A' ? vip.phone : vip.email}</td>
                      <td>{vip.orderCount}</td>
                      <td><span className={styles.badgeTag}>৳{vip.totalSpent.toLocaleString()}</span></td>
                      <td>{vip.favoritePerfume}</td>
                      <td>{vip.firstOrder}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* TAB 4: FRAGRANCES & SIZES */}
      {activeTab === 'products' && (
        <>
          <div className={styles.gridTwo}>
            {/* Top Selling Fragrances */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}><Package size={18} /> Best-Selling Fragrances</h3>
              </div>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Fragrance Name</th>
                      <th>Category</th>
                      <th>Units Sold</th>
                      <th>Total Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(products?.topSellingProducts || []).map((p: any, idx: number) => (
                      <tr key={idx}>
                        <td><strong>{p.name}</strong></td>
                        <td><span className={styles.badgeTag}>{p.category}</span></td>
                        <td>{p.unitsSold}</td>
                        <td>৳{p.revenue.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottle Size Popularity */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}><Layers size={18} /> Bottle Size Distribution (Units Sold)</h3>
              </div>
              <div className={styles.chartContainer}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={products?.sizeDistribution || []}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                    <XAxis dataKey="size" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="units" fill="#820011" radius={[6, 6, 0, 0]} name="Units Sold" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
