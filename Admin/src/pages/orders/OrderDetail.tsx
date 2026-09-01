import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Printer, Send, ExternalLink, ArrowLeft, CheckCircle2, Truck, Package, Clock, ShieldAlert } from 'lucide-react';
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
  const [dispatching, setDispatching] = useState(false);
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

  const handleDispatchCourier = async () => {
    if (!id || dispatching) return;
    setDispatching(true);
    setMessage(null);
    try {
      const res = await api.post<{ status: string; data: any }>(`/admin/orders/${id}/dispatch-courier`);
      if (res && res.data) {
        const tracking = res.data.tracking_code;
        setTrackingNumber(tracking);
        setStatus('SHIPPED');
        setMessage(`🚀 Order successfully dispatched to Steadfast Courier! Consignment Tracking Code: ${tracking}`);
        fetchOrder();
      }
    } catch (err: any) {
      console.error('Failed to dispatch courier:', err);
      setMessage('Failed to dispatch order to courier.');
    } finally {
      setDispatching(false);
    }
  };

  const handlePrintSlip = () => {
    window.print();
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
      case 'CONFIRMED': return { background: 'rgba(59, 130, 246, 0.15)', color: '#60A5FA', border: '1px solid rgba(59, 130, 246, 0.3)' };
      case 'PROCESSING': return { background: 'rgba(168, 85, 247, 0.15)', color: '#C084FC', border: '1px solid rgba(168, 85, 247, 0.3)' };
      case 'SHIPPED': return { background: 'rgba(14, 165, 233, 0.15)', color: '#38BDF8', border: '1px solid rgba(14, 165, 233, 0.3)' };
      case 'DELIVERED': return { background: 'rgba(16, 185, 129, 0.15)', color: '#34D399', border: '1px solid rgba(16, 185, 129, 0.3)' };
      case 'CANCELLED': return { background: 'rgba(239, 68, 68, 0.15)', color: '#F87171', border: '1px solid rgba(239, 68, 68, 0.3)' };
      default: return { background: 'rgba(197, 168, 128, 0.15)', color: '#C5A880', border: '1px solid rgba(197, 168, 128, 0.3)' };
    }
  };

  const isPrepaid = order.payment?.status === 'VERIFIED';
  const collectibleCod = isPrepaid ? 0 : order.grandTotal;

  return (
    <div className={styles.container}>
      {/* Screen View */}
      <div className="no-print">
        <Link to="/orders" className={styles.backLink}>
          <ArrowLeft size={16} /> Back to Orders List
        </Link>

        <header className={styles.header}>
          <div>
            <h2 className={styles.orderTitle}>Order #{order.orderNumber}</h2>
            <div style={{ fontSize: '13px', color: '#9A9A9C', marginTop: '4px' }}>
              Placed on {order.createdAt ? new Date(order.createdAt).toLocaleString('en-GB') : '—'}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span className={styles.statusBadge} style={getStatusBadgeStyle(order.status)}>
              ● {order.status}
            </span>

            <button
              onClick={handlePrintSlip}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#222225',
                color: '#F5F1E8',
                border: '1px solid rgba(197,168,128,0.3)',
                borderRadius: '6px',
                padding: '8px 14px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 600,
              }}
            >
              <Printer size={15} /> Print Packing Slip
            </button>

            {order.status !== 'SHIPPED' && order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
              <button
                onClick={handleDispatchCourier}
                disabled={dispatching}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
                  color: '#fff',
                  border: '1px solid rgba(147, 197, 253, 0.4)',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(30, 58, 138, 0.4)'
                }}
              >
                <Send size={14} />
                {dispatching ? 'Dispatching...' : '⚡ Send to Steadfast'}
              </button>
            )}
          </div>
        </header>

        {message && (
          <div className={styles.alertBox}>
            {message}
          </div>
        )}

        {/* Quick Status Control Bar */}
        <div className={styles.actions}>
          <select 
            className={styles.select} 
            value={status} 
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="PENDING">PENDING (Order Placed)</option>
            <option value="CONFIRMED">CONFIRMED (Verified & Approved)</option>
            <option value="PROCESSING">PROCESSING (Packaging & Lab Audit)</option>
            <option value="SHIPPED">SHIPPED (With Steadfast Courier)</option>
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

        {/* Customer & Payment Columns */}
        <div className={styles.grid}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Customer & Delivery Address</h3>
            <p className={styles.detailRow}><strong>Name:</strong> {order.fullName}</p>
            <p className={styles.detailRow}><strong>Email:</strong> {order.email}</p>
            <p className={styles.detailRow}><strong>Phone:</strong> {order.phone}</p>
            <p className={styles.detailRow}><strong>Delivery Zone:</strong> {order.location === 'inside-dhaka' ? 'Inside Dhaka (80tk)' : 'Outside Dhaka (150tk)'}</p>
            <p className={styles.detailRow}><strong>Full Address:</strong> {order.address}</p>
            {order.notes && <p className={styles.detailRow}><strong>Customer Note:</strong> {order.notes}</p>}
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Payment Breakdown</h3>
            <p className={styles.detailRow}><strong>Payment Method:</strong> {order.payment?.method || 'COD'}</p>
            {order.payment?.walletNumber && <p className={styles.detailRow}><strong>Wallet Number:</strong> {order.payment.walletNumber}</p>}
            {order.payment?.transactionId && <p className={styles.detailRow}><strong>Transaction ID:</strong> {order.payment.transactionId}</p>}
            {order.payment?.cardLast4 && <p className={styles.detailRow}><strong>Card Last 4:</strong> •••• {order.payment.cardLast4}</p>}
            <p className={styles.detailRow}>
              <strong>Payment Status:</strong>{' '}
              <span className={styles.statusBadge} style={getStatusBadgeStyle(order.payment?.status || 'PENDING')}>
                {order.payment?.status || 'PENDING'}
              </span>
            </p>
            <p className={styles.detailRow}>
              <strong>Payable via Courier (COD):</strong>{' '}
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: collectibleCod > 0 ? '#34D399' : '#9CA3AF' }}>
                {collectibleCod > 0 ? `৳${collectibleCod.toLocaleString()}` : '৳0 (Prepaid)'}
              </span>
            </p>
          </div>
        </div>

        {/* Ordered Fragrances Table */}
        <div className={styles.itemsSection}>
          <h3 className={styles.cardTitle}>Ordered Fragrances ({order.items.length})</h3>
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
                            style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px', border: '1px solid rgba(197, 168, 128, 0.2)' }} 
                          />
                        )}
                        <div>
                          <strong>{item.productName}</strong>
                        </div>
                      </div>
                    </td>
                    <td><span style={{ padding: '2px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', fontSize: '12px' }}>{item.selectedSize}</span></td>
                    <td>{item.quantity}</td>
                    <td>৳{item.unitPrice?.toLocaleString()}</td>
                    <td><strong style={{ color: '#C5A880' }}>৳{item.totalPrice?.toLocaleString()}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Footer */}
        <div className={styles.summary}>
          <p>Subtotal: ৳{order.subtotal?.toLocaleString()}</p>
          <p>Delivery Fee: ৳{order.deliveryCharge}</p>
          <h3 className={styles.summaryTotal}>Grand Total: ৳{order.grandTotal?.toLocaleString()}</h3>
        </div>
        
        {/* Steadfast Courier Tracking Box */}
        <div className={styles.trackingSection}>
          <h3 className={styles.trackingTitle}>
            <Truck size={18} style={{ color: '#C5A880' }} /> Steadfast Courier Tracking
          </h3>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <input 
              type="text" 
              placeholder="e.g. SF84920194BD or Consignment ID" 
              value={trackingNumber} 
              onChange={(e) => setTrackingNumber(e.target.value)} 
              className={styles.input} 
              style={{ minWidth: '280px' }}
            />
            <button 
              className={styles.updateBtn} 
              onClick={handleUpdateStatus} 
              disabled={saving}
            >
              Save Tracking Number
            </button>
            {trackingNumber && (
              <a
                href={`https://steadfast.com.bd/t/${trackingNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '13px',
                  color: '#60A5FA',
                  textDecoration: 'underline',
                  padding: '6px 0'
                }}
              >
                Track on Steadfast Portal <ExternalLink size={13} />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Printable Invoice & Packing Slip (Shows only when printed) */}
      <div className="print-only" style={{ display: 'none', padding: '20px', fontFamily: 'Arial, sans-serif', color: '#000', background: '#fff' }}>
        <style dangerouslySetInnerHTML={{ __html: `
          @media print {
            body { background: #fff !important; color: #000 !important; }
            .no-print { display: none !important; }
            .print-only { display: block !important; }
          }
        ` }} />

        <div style={{ borderBottom: '2px solid #000', paddingBottom: '12px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ margin: '0 0 4px', fontSize: '24px', letterSpacing: '2px', textTransform: 'uppercase' }}>MURAKKAZ</h1>
            <div style={{ fontSize: '11px', color: '#555' }}>House of Rare Scents · Banani, Dhaka · murakkaz.com</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '16px', fontWeight: 'bold' }}>PACKING SLIP / INVOICE</div>
            <div style={{ fontSize: '13px', fontWeight: 'bold', marginTop: '2px' }}>#{order.orderNumber}</div>
            <div style={{ fontSize: '11px', color: '#555' }}>{new Date(order.createdAt).toLocaleDateString('en-GB')}</div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '12px', lineHeight: '1.5' }}>
          <div style={{ width: '48%', border: '1px solid #ccc', padding: '10px', borderRadius: '4px' }}>
            <strong>DELIVER TO:</strong><br />
            <strong>{order.fullName}</strong><br />
            Phone: {order.phone}<br />
            Address: {order.address}<br />
            Zone: {order.location === 'inside-dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'}
          </div>
          <div style={{ width: '48%', border: '1px solid #ccc', padding: '10px', borderRadius: '4px' }}>
            <strong>COURIER DISPATCH:</strong><br />
            Courier: <strong>Steadfast Courier</strong><br />
            Tracking Code: <strong>{order.trackingNumber || 'PENDING'}</strong><br />
            Payment Method: <strong>{order.payment?.method || 'COD'}</strong><br />
            <span style={{ fontSize: '14px', color: '#000', fontWeight: 'bold' }}>
              COLLECTIBLE COD: {collectibleCod > 0 ? `৳${collectibleCod.toLocaleString()}` : '৳0 (PAID)'}
            </span>
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '16px', fontSize: '12px' }}>
          <thead>
            <tr style={{ background: '#f0f0f0', borderBottom: '1px solid #000' }}>
              <th style={{ padding: '8px', textAlign: 'left' }}>Item Description</th>
              <th style={{ padding: '8px', textAlign: 'center' }}>Size</th>
              <th style={{ padding: '8px', textAlign: 'center' }}>Qty</th>
              <th style={{ padding: '8px', textAlign: 'right' }}>Unit Price</th>
              <th style={{ padding: '8px', textAlign: 'right' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '8px' }}><strong>{item.productName}</strong></td>
                <td style={{ padding: '8px', textAlign: 'center' }}>{item.selectedSize}</td>
                <td style={{ padding: '8px', textAlign: 'center' }}>{item.quantity}</td>
                <td style={{ padding: '8px', textAlign: 'right' }}>৳{item.unitPrice?.toLocaleString()}</td>
                <td style={{ padding: '8px', textAlign: 'right' }}>৳{item.totalPrice?.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ width: '55%', fontSize: '11px', border: '1px dashed #999', padding: '8px', borderRadius: '4px' }}>
            <strong>Special Courier Instructions:</strong><br />
            Fragile luxury perfume glass bottles. Handle with utmost care. Do not invert or crush.
          </div>
          <div style={{ width: '38%', fontSize: '12px', textAlign: 'right' }}>
            <div>Subtotal: ৳{order.subtotal?.toLocaleString()}</div>
            <div>Delivery Fee: ৳{order.deliveryCharge}</div>
            <div style={{ fontSize: '15px', fontWeight: 'bold', borderTop: '1px solid #000', marginTop: '4px', paddingTop: '4px' }}>
              Grand Total: ৳{order.grandTotal?.toLocaleString()}
            </div>
          </div>
        </div>

        <div style={{ marginTop: '24px', paddingTop: '8px', borderTop: '1px solid #ccc', textAlign: 'center', fontSize: '10px', color: '#666' }}>
          Thank you for choosing Murakkaz. For support: info@murakkaz.com · Hotline: +880 1700-000000
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
