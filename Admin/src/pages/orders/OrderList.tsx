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

const OrderList = () => {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const tabs = ['All', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get<{ data: OrderItem[] }>('/admin/orders');
      if (res && res.data) {
        setOrders(res.data);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesTab = activeTab === 'All' || order.status.toUpperCase() === activeTab.toUpperCase();
    const matchesSearch =
      searchQuery === '' ||
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.phone.includes(searchQuery);
    return matchesTab && matchesSearch;
  });

  return (
    <div className={styles.container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Customer Orders</h2>
        <button
          onClick={fetchOrders}
          style={{
            background: '#820011',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            padding: '8px 16px',
            cursor: 'pointer',
            fontSize: '13px'
          }}
        >
          Refresh Orders
        </button>
      </div>
      
      <div className={styles.tabs}>
        {tabs.map(tab => (
          <button 
            key={tab} 
            className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'All' ? 'All Orders' : tab}
          </button>
        ))}
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
        <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>Loading orders...</div>
      ) : filteredOrders.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#888', background: '#fafafa', borderRadius: '8px', border: '1px dashed #ddd' }}>
          No orders found matching your criteria.
        </div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Order #</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Total</th>
              <th>Payment Method</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => {
              const formattedDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-GB') : '-';
              return (
                <tr key={order.id}>
                  <td><strong>{order.orderNumber}</strong></td>
                  <td>
                    <div>{order.fullName}</div>
                    <div style={{ fontSize: '12px', color: '#777' }}>{order.phone}</div>
                  </td>
                  <td>{formattedDate}</td>
                  <td><strong>{order.grandTotal?.toLocaleString()}tk</strong></td>
                  <td>{order.payment?.method || 'COD'}</td>
                  <td>
                    <span className={`${styles.badge} ${styles[order.status.toLowerCase()] || ''}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <Link to={`/orders/${order.id}`} className={styles.actionLink}>
                      View Details
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderList;
