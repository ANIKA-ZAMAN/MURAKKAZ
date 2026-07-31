import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './OrderList.module.css';

const OrderList = () => {
  const [activeTab, setActiveTab] = useState('All');
  const tabs = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  return (
    <div className={styles.container}>
      <h2>Orders</h2>
      
      <div className={styles.tabs}>
        {tabs.map(tab => (
          <button 
            key={tab} 
            className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className={styles.searchBar}>
        <input type="text" placeholder="Search by order # or customer..." className={styles.input} />
      </div>

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
          <tr>
            <td>MRK-123456</td>
            <td>John Doe</td>
            <td>2023-10-25</td>
            <td>$120.00</td>
            <td>Card</td>
            <td><span className={styles.badge}>Pending</span></td>
            <td><Link to="/orders/1" className={styles.actionLink}>View Details</Link></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default OrderList;
