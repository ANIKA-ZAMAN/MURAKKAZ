import React from 'react';
import styles from './OrderDetail.module.css';

const OrderDetail = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2>Order #MRK-123456</h2>
        <span className={styles.statusBadge}>PENDING</span>
      </header>

      <div className={styles.actions}>
        <select className={styles.select}>
          <option>PENDING</option>
          <option>CONFIRMED</option>
          <option>PROCESSING</option>
          <option>SHIPPED</option>
          <option>DELIVERED</option>
          <option>CANCELLED</option>
        </select>
        <button className={styles.updateBtn}>Update Status</button>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <h3>Customer Details</h3>
          <p><strong>Name:</strong> John Doe</p>
          <p><strong>Email:</strong> john@example.com</p>
          <p><strong>Phone:</strong> +1234567890</p>
          <p><strong>Address:</strong> 123 Perfume St, Scent City, SC 12345</p>
        </div>

        <div className={styles.card}>
          <h3>Payment Verification</h3>
          <p><strong>Method:</strong> bKash</p>
          <p><strong>Transaction ID:</strong> TRXA123B45</p>
          <p><strong>Status:</strong> <span className={styles.pendingText}>PENDING</span></p>
          <button className={styles.verifyBtn}>Verify Payment</button>
        </div>
      </div>

      <div className={styles.itemsSection}>
        <h3>Items</h3>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Item</th>
              <th>Size</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Oud Ispahan</td>
              <td>55ml</td>
              <td>2</td>
              <td>$50.00</td>
              <td>$100.00</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className={styles.summary}>
        <p>Subtotal: $100.00</p>
        <p>Delivery: $10.00</p>
        <h3>Grand Total: $110.00</h3>
      </div>
      
      <div className={styles.trackingSection}>
        <h3>Tracking Information</h3>
        <input type="text" placeholder="Tracking Number" className={styles.input} />
        <button className={styles.updateBtn}>Update Tracking</button>
      </div>
    </div>
  );
};

export default OrderDetail;
