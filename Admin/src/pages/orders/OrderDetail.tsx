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
    return <div className={styles.container} style={{ padding: '3rem', textAlign: 'center', color: '#9A9A9C' }}>Loading order details...</div>;
  }

  if (!order) {
    return (
      <div className={styles.container} style={{ padding: '3rem', textAlign: 'center' }}>
        <h3>Order not found</h3>
        <Link to="/orders" className={styles.backLink}>Back to Orders</Link>
      </div>
    );
  }

  const getStatusBadgeStyle = (st: string) => {
    switch (st.toUpperCase()) {
      case 'PENDING': return { background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', border: '1px solid rgba(245, 158, 11, 0.3)' };
      case 'PROCESSING': return { background: 'rgba(59, 130, 246, 0.15)', color: '#60A5FA', border: '1px solid rgba(59, 130, 246, 0.3)' };
      case 'SHIPPED': return { background: 'rgba(168, 85, 247, 0.15)', color: '#C084FC', border: '1px solid rgba(168, 85, 247, 0.3)' };
      case 'DELIVERED': return { background: 'rgba(16, 185, 129, 0.15)', color: '#34D399', border: '1px solid rgba(16, 185, 129, 0.3)' };
      case 'CANCELLED': return { background: 'rgba(239, 68, 68, 0.15)', color: '#F87171', border: '1px solid rgba(239, 68, 68, 0.3)' };
      default: return { background: 'rgba(197, 168, 128, 0.15)', color: '#C5A880', border: '1px solid rgba(197, 168, 128, 0.3)' };
    }
  };

  return (
    <div className={styles.container}>
      <Link to="/orders" className={styles.backLink}>
        ← Back to Orders List
      </Link>

      <header className={styles.header}>
        <h2 className={styles.orderTitle}>Order #{order.orderNumber}</h2>
        <span className={styles.statusBadge} style={getStatusBadgeStyle(order.status)}>
          {order.status}
        </span>
      </header>

      {message && (
        <div className={styles.alertBox}>
          {message}
        </div>
      )}

      <div className={styles.actions}>
        <select 
          className={styles.select} 
          value={status} 
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="PENDING">PENDING (Order Placed)</option>
          <option value="CONFIRMED">CONFIRMED (Order Approved)</option>
          <option value="PROCESSING">PROCESSING (Scent Lab Formulation)</option>
          <option value="SHIPPED">SHIPPED (Out with Courier)</option>
          <option value="DELIVERED">DELIVERED (Fulfilled)</option>
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
          <h3 className={styles.cardTitle}>Customer & Delivery</h3>
          <p className={styles.detailRow}><strong>Name:</strong> {order.fullName}</p>
          <p className={styles.detailRow}><strong>Email:</strong> {order.email}</p>
          <p className={styles.detailRow}><strong>Phone:</strong> {order.phone}</p>
          <p className={styles.detailRow}><strong>Area:</strong> {order.location === 'inside-dhaka' ? 'Inside Dhaka (80tk)' : 'Outside Dhaka (150tk)'}</p>
          <p className={styles.detailRow}><strong>Full Address:</strong> {order.address}</p>
          {order.notes && <p className={styles.detailRow}><strong>Delivery Notes:</strong> {order.notes}</p>}
        </div>

        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Payment Details</h3>
          <p className={styles.detailRow}><strong>Method:</strong> {order.payment?.method || 'COD'}</p>
          {order.payment?.walletNumber && <p className={styles.detailRow}><strong>Wallet Number:</strong> {order.payment.walletNumber}</p>}
          {order.payment?.transactionId && <p className={styles.detailRow}><strong>Transaction ID:</strong> {order.payment.transactionId}</p>}
          {order.payment?.cardLast4 && <p className={styles.detailRow}><strong>Card Last 4:</strong> •••• {order.payment.cardLast4}</p>}
          <p className={styles.detailRow}>
            <strong>Payment Status:</strong>{' '}
            <span className={styles.statusBadge} style={getStatusBadgeStyle(order.payment?.status || 'PENDING')}>
              {order.payment?.status || 'PENDING'}
            </span>
          </p>
          <p className={styles.detailRow}><strong>Grand Total:</strong> {order.grandTotal?.toLocaleString()}tk</p>
        </div>
      </div>

      <div className={styles.itemsSection}>
        <h3 className={styles.cardTitle}>Ordered Fragrances</h3>
        <div className={styles.tableWrapper}>
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
                          style={{ width: '38px', height: '38px', objectFit: 'cover', borderRadius: '4px', border: '1px solid rgba(197, 168, 128, 0.2)' }} 
                        />
                      )}
                      <strong>{item.productName}</strong>
                    </div>
                  </td>
                  <td>{item.selectedSize}</td>
                  <td>{item.quantity}</td>
                  <td>{item.unitPrice?.toLocaleString()}tk</td>
                  <td><strong style={{ color: '#C5A880' }}>{item.totalPrice?.toLocaleString()}tk</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={styles.summary}>
        <p>Subtotal: {order.subtotal?.toLocaleString()}tk</p>
        <p>Delivery Charge: {order.deliveryCharge}tk</p>
        <h3 className={styles.summaryTotal}>Grand Total: {order.grandTotal?.toLocaleString()}tk</h3>
      </div>
      
      <div className={styles.trackingSection}>
        <h3 className={styles.trackingTitle}>Courier Tracking ID</h3>
        <input 
          type="text" 
          placeholder="e.g. STDF-892104-BD or REDX-7890" 
          value={trackingNumber} 
          onChange={(e) => setTrackingNumber(e.target.value)} 
          className={styles.input} 
        />
        <button 
          className={styles.updateBtn} 
          onClick={handleUpdateStatus} 
          disabled={saving}
        >
          Save Tracking Number
        </button>
      </div>
    </div>
  );
};

export default OrderDetail;
