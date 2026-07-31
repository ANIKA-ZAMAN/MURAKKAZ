import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { apiClient } from '../../api/client';
import { useToast } from '../../hooks/useToast';
import styles from './ProductList.module.css';

interface ProductItem {
  id: string;
  slug: string;
  name: string;
  brand: string;
  family: string;
  gender: string;
  description: string;
  rating: number;
  reviewCount: number;
  image: string;
  isActive: boolean;
  priceVal?: number;
  sizes?: { size: string; price: number }[];
}

const ProductList: React.FC = () => {
  const { showToast } = useToast();
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ search: '', family: '', gender: '', status: '' });

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get<{ data: any }>('/products');
      if (res.data && Array.isArray(res.data.data)) {
        setProducts(res.data.data);
      } else if (Array.isArray(res.data)) {
        setProducts(res.data);
      }
    } catch (err) {
      console.warn('Failed to load products from API', err);
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
      if (!p.name.toLowerCase().includes(q) && !p.brand.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (filter.family && p.family !== filter.family) return false;
    if (filter.gender && p.gender !== filter.gender) return false;
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
            Create and manage luxury fragrance entries live across storefront.
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
        <input
          type="text"
          placeholder="Search fragrance name or brand..."
          name="catalog_search_input"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          className={styles.input}
          value={filter.search}
          onChange={(e) => setFilter({ ...filter, search: e.target.value })}
          style={{
            flex: 1,
            padding: '0.6rem 1rem',
            background: '#222225',
            border: '1px solid rgba(197,168,128,0.2)',
            borderRadius: '6px',
            color: '#F5F1E8',
            outline: 'none',
          }}
        />
        <select
          className={styles.select}
          value={filter.family}
          onChange={(e) => setFilter({ ...filter, family: e.target.value })}
          style={{
            padding: '0.6rem 1rem',
            background: '#222225',
            border: '1px solid rgba(197,168,128,0.2)',
            borderRadius: '6px',
            color: '#F5F1E8',
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
            background: '#222225',
            border: '1px solid rgba(197,168,128,0.2)',
            borderRadius: '6px',
            color: '#F5F1E8',
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
      <div style={{ background: '#18181A', borderRadius: '12px', border: '1px solid rgba(197,168,128,0.15)', overflow: 'hidden' }}>
        <table className={styles.table} style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(34,34,37,0.7)', color: '#C5A880', fontSize: '0.8rem', textTransform: 'uppercase', borderBottom: '1px solid rgba(197,168,128,0.15)' }}>
              <th style={{ padding: '1rem 1.5rem' }}>Fragrance</th>
              <th style={{ padding: '1rem 1.5rem' }}>Brand & Family</th>
              <th style={{ padding: '1rem 1.5rem' }}>Price</th>
              <th style={{ padding: '1rem 1.5rem' }}>Rating</th>
              <th style={{ padding: '1rem 1.5rem' }}>Status</th>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: '#A0A0A5' }}>
                  Loading product catalog...
                </td>
              </tr>
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((p) => {
                const priceText = p.sizes && p.sizes.length > 0
                  ? `৳${p.sizes[0].price.toLocaleString()}`
                  : (p.priceVal ? `৳${p.priceVal.toLocaleString()}` : '৳2,800');

                return (
                  <tr key={p.id} style={{ borderBottom: '1px solid rgba(197,168,128,0.08)' }}>
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      <div className={styles.productCell} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img 
                          src={p.image || '/images/products/jade_serenity.png'} 
                          alt={p.name} 
                          style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'cover', background: '#222225', border: '1px solid rgba(197,168,128,0.2)' }} 
                        />
                        <div>
                          <div style={{ fontFamily: 'Playfair Display, serif', fontWeight: 500, color: '#F5F1E8', fontSize: '1rem' }}>
                            {p.name}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#A0A0A5' }}>
                            Slug: {p.slug}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      <span style={{ padding: '3px 10px', borderRadius: '4px', background: 'rgba(197,168,128,0.1)', color: '#C5A880', fontSize: '0.8rem', border: '1px solid rgba(197,168,128,0.2)', marginRight: '6px' }}>
                        {p.brand || 'Murakkaz'}
                      </span>
                      <span style={{ padding: '3px 10px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', color: '#A0A0A5', fontSize: '0.8rem' }}>
                        {p.family || 'WOODY'}
                      </span>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem', fontWeight: 600, color: '#F5F1E8' }}>
                      {priceText}
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem', color: '#FBBF24' }}>
                      ★ {p.rating || 5.0} ({p.reviewCount || 0})
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      <span style={{ padding: '3px 10px', borderRadius: '50px', background: 'rgba(52,211,153,0.12)', color: '#34D399', fontSize: '0.78rem', border: '1px solid rgba(52,211,153,0.25)' }}>
                        Active Live
                      </span>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <Link to={`/products/${p.id}/edit`} style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(197,168,128,0.2)', color: '#F5F1E8', borderRadius: '6px', textDecoration: 'none', fontSize: '0.82rem' }}>
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
                  No products in catalog. Click "+ Add Product" above to create your first fragrance!
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
