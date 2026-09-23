import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import styles from './OrderList.module.css';

interface OrderItem {
  id: string;
  orderNumber: string;
  fullName: string;
  email: string;
  phone: string;
  grandTotal: number;
  status: string;
  createdAt: string;
  payment?: {
    method: string;
    status: string;
    amount: number;
  };
}

interface OrdersApiResponse {
  status: string;
  data: OrderItem[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const OrderList = () => {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState('25'); // '10', '25', '50', '100', 'all'
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const tabs = ['All', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

  const fetchOrders = async (
    page = currentPage,
    limit = pageSize,
    tab = activeTab,
    search = searchQuery
  ) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', String(limit));
      if (tab !== 'All') params.set('status', tab);
      if (search.trim()) params.set('search', search.trim());

      const res = await api.get<OrdersApiResponse>(`/admin/orders?${params.toString()}`);
      if (res && res.data) {
        setOrders(res.data);
        if (res.meta) {
          setTotalCount(res.meta.total);
          setTotalPages(res.meta.totalPages);
        }
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage, pageSize, activeTab, searchQuery);
  }, [currentPage, pageSize, activeTab]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchOrders(1, pageSize, activeTab, searchQuery);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (newSize: string) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const getStatusClass = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING': return styles.badgePending;
      case 'PROCESSING': return styles.badgeProcessing;
      case 'SHIPPED': return styles.badgeShipped;
      case 'DELIVERED': return styles.badgeDelivered;
      case 'CANCELLED': return styles.badgeCancelled;
      default: return styles.badgePending;
    }
  };

  const startRecord = pageSize === 'all' ? 1 : Math.min((currentPage - 1) * Number(pageSize) + 1, totalCount);
  const endRecord = pageSize === 'all' ? totalCount : Math.min(currentPage * Number(pageSize), totalCount);

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h2 className={styles.pageTitle}>Customer Orders</h2>
        <button onClick={() => fetchOrders(currentPage, pageSize, activeTab, searchQuery)} className={styles.refreshBtn}>
          Refresh Orders
        </button>
      </div>
      
      <div className={styles.tabsWrapper}>
        <div className={styles.tabs}>
          {tabs.map(tab => (
            <button 
              key={tab} 
              className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ''}`}
              onClick={() => handleTabChange(tab)}
            >
              {tab === 'All' ? 'All Orders' : tab}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.searchBar}>
        <input 
          type="text" 
          placeholder="Search by order #, customer name, or phone..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.input} 
        />
      </div>

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#9A9A9C' }}>Loading orders...</div>
      ) : orders.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#9A9A9C', background: '#1C1C1F', borderRadius: '10px', border: '1px dashed rgba(197, 168, 128, 0.2)' }}>
          No orders found matching your criteria.
        </div>
      ) : (
        <div className={styles.tableCard}>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => {
                  const formattedDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-GB') : '-';
                  return (
                    <tr key={order.id}>
                      <td><strong style={{ color: '#C5A880' }}>{order.orderNumber}</strong></td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{order.fullName}</div>
                        <div style={{ fontSize: '12px', color: '#9A9A9C' }}>{order.phone}</div>
                      </td>
                      <td>{formattedDate}</td>
                      <td><strong>{order.grandTotal?.toLocaleString()}tk</strong></td>
                      <td>{order.payment?.method || 'COD'}</td>
                      <td>
                        <span className={`${styles.badge} ${getStatusClass(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <Link to={`/orders/${order.id}`} className={styles.actionLink}>
                          View Details →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className={styles.pagination}>
            <div className={styles.pageInfo}>
              Showing <strong>{totalCount === 0 ? 0 : startRecord}</strong> to{' '}
              <strong>{endRecord}</strong> of <strong>{totalCount}</strong> orders
            </div>
            <div className={styles.pageControls}>
              <div className={styles.limitSelector}>
                <span>Show:</span>
                <select
                  className={styles.select}
                  value={pageSize}
                  onChange={(e) => handlePageSizeChange(e.target.value)}
                >
                  <option value="10">10 per page</option>
                  <option value="25">25 per page</option>
                  <option value="50">50 per page</option>
                  <option value="100">100 per page</option>
                  <option value="all">All (Show All)</option>
                </select>
              </div>

              {pageSize !== 'all' && totalPages > 1 && (
                <div className={styles.pageNav}>
                  <button
                    className={styles.pageBtn}
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  >
                    ← Prev
                  </button>
                  <span className={styles.pageIndicator}>
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    className={styles.pageBtn}
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                  >
                    Next →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderList;
