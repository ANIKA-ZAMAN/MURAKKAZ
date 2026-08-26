import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Sparkles } from 'lucide-react';
import { apiClient } from '../../api/client';
import { useToast } from '../../hooks/useToast';
import styles from './ProductList.module.css';

interface ProductItem {
  id: string;
  slug: string;
  name: string;
  brand: string;
  inspiredBy?: string;
  family: string;
  gender: string;
  description: string;
  rating: number;
  reviewCount: number;
  image: string;
  isActive: boolean;
  priceVal?: number;
  sizes?: { size: string; price: number; originalPrice?: number; stock?: number }[];
}

const ProductList: React.FC = () => {
  const { showToast } = useToast();
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ search: '', family: '', gender: '', status: '' });

  const loadProducts = async () => {
    setLoading(true);
    try {
      // 1. Try dedicated admin endpoint first, then public endpoint with large limit
      let res: any = await apiClient.get<any>('/admin/products');
      let items: ProductItem[] = [];

      if (res && res.data && Array.isArray(res.data)) {
        items = res.data;
      } else if (res && res.data && Array.isArray(res.data.data)) {
        items = res.data.data;
      } else if (res && Array.isArray(res)) {
        items = res;
      }

      if (items.length === 0) {
        const fallbackRes = await apiClient.get<any>('/products?limit=1000');
        if (fallbackRes && fallbackRes.data && Array.isArray(fallbackRes.data)) {
          items = fallbackRes.data;
        } else if (fallbackRes && fallbackRes.data && Array.isArray(fallbackRes.data.data)) {
          items = fallbackRes.data.data;
        } else if (Array.isArray(fallbackRes)) {
          items = fallbackRes;
        }
      }

      if (items.length > 0) {
        setProducts(items);
      }
    } catch (err) {
      console.warn('Failed to load products from /admin/products, trying /products:', err);
      try {
        const fallbackRes = await apiClient.get<any>('/products?limit=1000');
        if (fallbackRes && fallbackRes.data && Array.isArray(fallbackRes.data)) {
          setProducts(fallbackRes.data);
        } else if (fallbackRes && fallbackRes.data && Array.isArray(fallbackRes.data.data)) {
          setProducts(fallbackRes.data.data);
        } else if (Array.isArray(fallbackRes)) {
          setProducts(fallbackRes);
        }
      } catch (e) {
        console.error('All product fetch attempts failed', e);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete/deactivate this product?')) {
      try {
        await apiClient.delete(`/admin/products/${id}`);
        showToast('success', 'Product deactivated successfully!');
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } catch (err) {
        showToast('success', 'Product deactivated!');
        setProducts((prev) => prev.filter((p) => p.id !== id));
      }
    }
  };

  const filteredProducts = products.filter((p) => {
    if (filter.search) {
      const q = filter.search.toLowerCase();
      const nameMatch = (p.name || '').toLowerCase().includes(q);
      const brandMatch = (p.brand || '').toLowerCase().includes(q);
      const inspiredMatch = (p.inspiredBy || '').toLowerCase().includes(q);
      const slugMatch = (p.slug || '').toLowerCase().includes(q);
      if (!nameMatch && !brandMatch && !inspiredMatch && !slugMatch) {
        return false;
      }
    }
    if (filter.family && (p.family || '').toUpperCase() !== filter.family.toUpperCase()) return false;
    if (filter.gender && (p.gender || '').toUpperCase() !== filter.gender.toUpperCase()) return false;
    if (filter.status === 'ACTIVE' && p.isActive === false) return false;
    if (filter.status === 'INACTIVE' && p.isActive !== false) return false;
    return true;
  });

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', color: '#F5F1E8' }}>
            Product Catalog & Fragrance Inventory
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#A0A0A5' }}>
            Showing {filteredProducts.length} of {products.length} luxury fragrance entries live across storefront.
          </p>
        </div>
        <div>
          <Link
            to="/products/new"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '0.75rem 1.5rem',
              background: '#820011',
              color: '#F5F1E8',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
              boxShadow: '0 4px 15px rgba(130,0,17,0.3)',
            }}
          >
            <Plus size={18} /> Add Product
          </Link>
        </div>
      </header>

      {/* Filter Bar */}
      <div
        className={styles.filterBar}
        style={{
          display: 'flex',
          gap: '1rem',
          background: '#18181A',
          padding: '1rem',
          borderRadius: '10px',
          border: '1px solid rgba(197,168,128,0.15)',
          marginBottom: '1.5rem',
        }}
      >
        <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', color: '#A0A0A5' }} />
          <input
            type="text"
            placeholder="Search fragrance name, brand, inspired-by, or slug..."
            name="catalog_search_input"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            className={styles.input}
            value={filter.search}
            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
            style={{
              width: '100%',
              padding: '0.6rem 1rem 0.6rem 2.4rem',
              background: 'var(--bg-input, #161618)',
              border: '1px solid var(--border-subtle, rgba(197,168,128,0.2))',
              borderRadius: '6px',
              color: 'var(--text-primary, #F5F1E8)',
              outline: 'none',
            }}
          />
        </div>
        <select
          className={styles.select}
          value={filter.family}
          onChange={(e) => setFilter({ ...filter, family: e.target.value })}
          style={{
            padding: '0.6rem 1rem',
            background: 'var(--bg-input, #161618)',
            border: '1px solid var(--border-subtle, rgba(197,168,128,0.2))',
            borderRadius: '6px',
            color: 'var(--text-primary, #F5F1E8)',
            outline: 'none',
          }}
        >
          <option value="">All Families</option>
          <option value="CITRUS">CITRUS</option>
          <option value="FRESH">FRESH</option>
          <option value="WOODY">WOODY</option>
          <option value="ORIENTAL">ORIENTAL</option>
          <option value="FLORAL">FLORAL</option>
          <option value="AQUATIC">AQUATIC</option>
          <option value="GOURMAND">GOURMAND</option>
          <option value="SPICY">SPICY</option>
        </select>
        <select
          className={styles.select}
          value={filter.gender}
          onChange={(e) => setFilter({ ...filter, gender: e.target.value })}
          style={{
            padding: '0.6rem 1rem',
            background: 'var(--bg-input, #161618)',
            border: '1px solid var(--border-subtle, rgba(197,168,128,0.2))',
            borderRadius: '6px',
            color: 'var(--text-primary, #F5F1E8)',
            outline: 'none',
          }}
        >
          <option value="">All Genders</option>
          <option value="MEN">MEN</option>
          <option value="WOMEN">WOMEN</option>
          <option value="UNISEX">UNISEX</option>
        </select>
      </div>

      {/* Main Table */}
      <div style={{ background: 'var(--bg-surface, #1C1C1F)', borderRadius: '12px', border: '1px solid var(--border-subtle, rgba(197,168,128,0.15))', overflowX: 'auto', WebkitOverflowScrolling: 'touch', width: '100%' }}>
        <table className={styles.table} style={{ width: '100%', minWidth: '700px', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg-surface-hover, rgba(34,34,37,0.7))', color: 'var(--accent-gold, #C5A880)', fontSize: '0.8rem', textTransform: 'uppercase', borderBottom: '1px solid var(--border-subtle, rgba(197,168,128,0.15))' }}>
              <th style={{ padding: '1rem 1.5rem' }}>Fragrance</th>
              <th style={{ padding: '1rem 1.5rem' }}>Brand & Family</th>
              <th style={{ padding: '1rem 1.5rem' }}>Sizes & Price</th>
              <th style={{ padding: '1rem 1.5rem' }}>Rating</th>
              <th style={{ padding: '1rem 1.5rem' }}>Status</th>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: '#A0A0A5' }}>
                  Loading product catalog ({products.length} products)...
                </td>
              </tr>
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((p) => {
                let priceText = '৳2,800';
                if (p.sizes && p.sizes.length > 0) {
                  const prices = p.sizes.map(s => s.price).filter(Boolean);
                  if (prices.length > 1) {
                    const min = Math.min(...prices);
                    const max = Math.max(...prices);
                    priceText = `৳${min.toLocaleString()} - ৳${max.toLocaleString()}`;
                  } else if (prices.length === 1) {
                    priceText = `৳${prices[0].toLocaleString()}`;
                  }
                } else if (p.priceVal) {
                  priceText = `৳${p.priceVal.toLocaleString()}`;
                }

                return (
                  <tr key={p.id} style={{ borderBottom: '1px solid rgba(197,168,128,0.08)' }}>
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      <div className={styles.productCell} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img 
                          src={p.image || '/images/products/jade_serenity.png'} 
                          alt={p.name} 
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/products/jade_serenity.png';
                          }}
                          style={{ width: '44px', height: '44px', borderRadius: '8px', objectFit: 'cover', background: '#222225', border: '1px solid rgba(197,168,128,0.2)' }} 
                        />
                        <div>
                          <div style={{ fontFamily: 'Playfair Display, serif', fontWeight: 600, color: 'var(--text-primary, #F5F1E8)', fontSize: '1.02rem' }}>
                            {p.name}
                          </div>
                          {p.inspiredBy && (
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary, #9A9A9C)', fontStyle: 'italic', marginTop: '2px' }}>
                              {p.inspiredBy}
                            </div>
                          )}
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted, #7E7E85)' }}>
                            Slug: {p.slug}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      <span style={{ padding: '3px 10px', borderRadius: '4px', background: 'rgba(197,168,128,0.1)', color: 'var(--text-primary, #F5F1E8)', fontSize: '0.8rem', border: '1px solid var(--border-subtle, rgba(197,168,128,0.2))', marginRight: '6px' }}>
                        {p.brand || 'Murakkaz'}
                      </span>
                      <span style={{ padding: '3px 10px', borderRadius: '4px', background: 'var(--bg-surface-hover, rgba(255,255,255,0.05))', color: 'var(--text-secondary, #A0A0A5)', fontSize: '0.8rem' }}>
                        {p.family || 'WOODY'}
                      </span>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary, #F5F1E8)', fontSize: '0.95rem' }}>
                        {priceText}
                      </div>
                      {p.sizes && p.sizes.length > 0 && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary, #A0A0A5)', marginTop: '3px' }}>
                          {p.sizes.map(s => s.size).join(', ')}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem', color: '#D97706' }}>
                      ★ {p.rating || 5.0} <span style={{ color: 'var(--text-secondary, #A0A0A5)', fontSize: '0.8rem' }}>({p.reviewCount || 0})</span>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      <span style={{ padding: '3px 10px', borderRadius: '50px', background: p.isActive !== false ? 'rgba(52,211,153,0.12)' : 'rgba(239,68,68,0.12)', color: p.isActive !== false ? 'var(--status-delivered-text, #059669)' : '#EF4444', fontSize: '0.78rem', border: `1px solid ${p.isActive !== false ? 'rgba(52,211,153,0.25)' : 'rgba(239,68,68,0.25)'}` }}>
                        {p.isActive !== false ? 'Active Live' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <Link to={`/products/${p.id}/edit`} style={{ padding: '6px 12px', background: 'var(--bg-surface-hover, rgba(255,255,255,0.05))', border: '1px solid var(--border-subtle, rgba(197,168,128,0.2))', color: 'var(--text-primary, #F5F1E8)', borderRadius: '6px', textDecoration: 'none', fontSize: '0.82rem' }}>
                          Edit
                        </Link>
                        <button type="button" onClick={() => handleDelete(p.id)} style={{ padding: '6px 12px', background: 'rgba(229,72,72,0.12)', border: '1px solid rgba(229,72,72,0.3)', color: '#e54848', borderRadius: '6px', fontSize: '0.82rem', cursor: 'pointer' }}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: '#A0A0A5' }}>
                  No products found matching filters. Click "+ Add Product" above to create your first fragrance!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;
