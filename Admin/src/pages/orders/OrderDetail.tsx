import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../api/client';
import styles from './OrderDetail.module.css';

interface OrderDetailData {
  id: string;
  orderNumber: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  address: string;
  notes?: string;
  status: string;
  trackingNumber?: string;
  deliveryCharge: number;
  subtotal: number;
  grandTotal: number;
  createdAt: string;
  items: Array<{
    id: string;
    productName: string;
    productImage?: string;
    selectedSize: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  payment?: {
    method: string;
    status: string;
    amount: number;
    walletProvider?: string;
    walletNumber?: string;
    transactionId?: string;
    cardLast4?: string;
    cardBrand?: string;
  };
}

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('PENDING');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const fetchOrder = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await api.get<{ data: OrderDetailData }>(`/admin/orders/${id}`);
      if (res && res.data) {
        setOrder(res.data);
        setStatus(res.data.status);
        setTrackingNumber(res.data.trackingNumber || '');
      }
    } catch (err) {
      console.error('Failed to load order details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleUpdateStatus = async () => {
    if (!id || saving) return;
    setSaving(true);
    setMessage(null);
    try {
      await api.put(`/admin/orders/${id}/status`, { status, trackingNumber });
      setMessage('Order status updated successfully!');
      fetchOrder();
    } catch (err) {
      console.error('Failed to update status:', err);
      setMessage('Failed to update status.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className={styles.container} style={{ padding: '3rem', textAlign: 'center' }}>Loading order details...</div>;
  }

  if (!order) {
    return (
      <div className={styles.container} style={{ padding: '3rem', textAlign: 'center' }}>
        <h3>Order not found</h3>
        <Link to="/orders" className={styles.actionLink}>Back to Orders</Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div style={{ marginBottom: '1rem' }}>
        <Link to="/orders" style={{ color: '#820011', textDecoration: 'none', fontSize: '14px' }}>
          ← Back to Orders List
        </Link>
      </div>

      <header className={styles.header}>
        <h2>Order #{order.orderNumber}</h2>
        <span className={styles.statusBadge}>{order.status}</span>
      </header>

      {message && (
        <div style={{ padding: '10px 16px', background: '#e6f7ff', border: '1px solid #91d5ff', borderRadius: '6px', marginBottom: '1rem', color: '#0050b3' }}>
          {message}
        </div>
      )}

      <div className={styles.actions}>
        <select 
          className={styles.select} 
          value={status} 
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="PENDING">PENDING</option>
          <option value="CONFIRMED">CONFIRMED</option>
          <option value="PROCESSING">PROCESSING</option>
          <option value="SHIPPED">SHIPPED</option>
          <option value="DELIVERED">DELIVERED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>
        <button 
          className={styles.updateBtn} 
          onClick={handleUpdateStatus} 
          disabled={saving}
        >
          {saving ? 'Updating...' : 'Update Status'}
        </button>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <h3>Customer & Delivery Details</h3>
          <p><strong>Name:</strong> {order.fullName}</p>
          <p><strong>Email:</strong> {order.email}</p>
          <p><strong>Phone:</strong> {order.phone}</p>
          <p><strong>Area:</strong> {order.location === 'inside-dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'}</p>
          <p><strong>Full Address:</strong> {order.address}</p>
          {order.notes && <p><strong>Delivery Notes:</strong> {order.notes}</p>}
        </div>

        <div className={styles.card}>
          <h3>Payment Details</h3>
          <p><strong>Method:</strong> {order.payment?.method || 'COD'}</p>
          {order.payment?.walletNumber && <p><strong>Wallet Number:</strong> {order.payment.walletNumber}</p>}
          {order.payment?.transactionId && <p><strong>Transaction ID:</strong> {order.payment.transactionId}</p>}
          {order.payment?.cardLast4 && <p><strong>Card Last 4:</strong> •••• {order.payment.cardLast4}</p>}
          <p><strong>Payment Status:</strong> <span className={styles.statusBadge}>{order.payment?.status || 'PENDING'}</span></p>
          <p><strong>Amount:</strong> {order.grandTotal?.toLocaleString()}tk</p>
        </div>
      </div>

      <div className={styles.itemsSection}>
        <h3>Ordered Fragrances</h3>
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
            {order.items.map((item) => (
              <tr key={item.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {item.productImage && (
                      <img 
                        src={item.productImage} 
                        alt={item.productName} 
                        style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '4px' }} 
                      />
                    )}
                    <strong>{item.productName}</strong>
                  </div>
                </td>
                <td>{item.selectedSize}</td>
                <td>{item.quantity}</td>
                <td>{item.unitPrice?.toLocaleString()}tk</td>
                <td><strong>{item.totalPrice?.toLocaleString()}tk</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.summary}>
        <p>Subtotal: {order.subtotal?.toLocaleString()}tk</p>
        <p>Delivery Charge: {order.deliveryCharge}tk</p>
        <h3>Grand Total: {order.grandTotal?.toLocaleString()}tk</h3>
      </div>
      
      <div className={styles.trackingSection}>
        <h3>Tracking Information</h3>
        <input 
          type="text" 
          placeholder="e.g. STEADFAST-123456 or REDX-7890" 
          value={trackingNumber} 
          onChange={(e) => setTrackingNumber(e.target.value)} 
          className={styles.input} 
        />
        <button 
          className={styles.updateBtn} 
          onClick={handleUpdateStatus} 
          disabled={saving}
        >
          Save Tracking
        </button>
      </div>
    </div>
  );
};

export default OrderDetail;
