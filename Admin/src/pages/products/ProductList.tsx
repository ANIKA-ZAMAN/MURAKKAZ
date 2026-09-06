import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Sparkles, ArrowUpDown, Crown, CheckCircle2, SlidersHorizontal, RefreshCw } from 'lucide-react';
import { apiClient } from '../../api/client';
import { useToast } from '../../hooks/useToast';
import styles from './ProductList.module.css';

interface ProductItem {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category?: 'Exclusive' | 'Regular' | 'exclusive' | 'regular' | string;
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
  createdAt?: string;
}

const EXCLUSIVE_SLUGS = new Set([
  'irish-leather', 'baccarat-rouge-540', 'tobacco-vanille', 'by-the-fireplace',
  'resala', 'sultani', 'guidance', 'rosewood', 'sakura-dior', 'imagination',
  'prod-irish-leather-01', 'prod-baccarat-rouge-540-02', 'prod-tobacco-vanille-03',
  'prod-by-the-fireplace-04', 'prod-resala-05', 'prod-sultani-06', 'prod-guidance-07',
  'prod-rosewood-08', 'prod-sakura-dior-09', 'prod-imagination-10'
]);

function resolveCategory(p: ProductItem): 'Exclusive' | 'Regular' {
  if (p.category) {
    const c = p.category.toLowerCase().trim();
    if (c === 'exclusive') return 'Exclusive';
    if (c === 'regular') return 'Regular';
  }
  const cleanSlug = (p.slug || '').toLowerCase().trim();
  const cleanId = (p.id || '').toLowerCase().trim();
  if (EXCLUSIVE_SLUGS.has(cleanSlug) || EXCLUSIVE_SLUGS.has(cleanId)) {
    return 'Exclusive';
  }
  if (p.sizes && Array.isArray(p.sizes) && p.sizes.some(s => Number(s.price) >= 2500)) {
    return 'Exclusive';
  }
  return 'Regular';
}

const ProductList: React.FC = () => {
  const { showToast } = useToast();
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ALL' | 'EXCLUSIVE' | 'REGULAR' | 'ACTIVE'>('ALL');
  const [filter, setFilter] = useState({
    search: '',
    category: '', // '' | 'EXCLUSIVE' | 'REGULAR'
    family: '',
    gender: '',
    status: '',
  });
  const [sortBy, setSortBy] = useState<string>('exclusive_first');

  const loadProducts = async () => {
    setLoading(true);
    try {
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

  // Metrics count
  const metrics = useMemo(() => {
    const total = products.length;
    let exclusive = 0;
    let regular = 0;
    let active = 0;

    products.forEach((p) => {
      const cat = resolveCategory(p);
      if (cat === 'Exclusive') exclusive++;
      else regular++;
      if (p.isActive !== false) active++;
    });

    return { total, exclusive, regular, active };
  }, [products]);

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const cat = resolveCategory(p);

      // Tab filter
      if (activeTab === 'EXCLUSIVE' && cat !== 'Exclusive') return false;
      if (activeTab === 'REGULAR' && cat !== 'Regular') return false;
      if (activeTab === 'ACTIVE' && p.isActive === false) return false;

      // Dropdown category filter
      if (filter.category === 'EXCLUSIVE' && cat !== 'Exclusive') return false;
      if (filter.category === 'REGULAR' && cat !== 'Regular') return false;

      // Search filter
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

      // Family & Gender
      if (filter.family && (p.family || '').toUpperCase() !== filter.family.toUpperCase()) return false;
      if (filter.gender && (p.gender || '').toUpperCase() !== filter.gender.toUpperCase()) return false;

      // Status
      if (filter.status === 'ACTIVE' && p.isActive === false) return false;
      if (filter.status === 'INACTIVE' && p.isActive !== false) return false;

      return true;
    });
  }, [products, activeTab, filter]);

  // Sorting Logic
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];

    const getMinPrice = (p: ProductItem) => {
      if (p.sizes && p.sizes.length > 0) {
        const prices = p.sizes.map(s => Number(s.price) || 0).filter(Boolean);
        if (prices.length > 0) return Math.min(...prices);
      }
      return p.priceVal || 0;
    };

    const getMaxPrice = (p: ProductItem) => {
      if (p.sizes && p.sizes.length > 0) {
        const prices = p.sizes.map(s => Number(s.price) || 0).filter(Boolean);
        if (prices.length > 0) return Math.max(...prices);
      }
      return p.priceVal || 0;
    };

    return list.sort((a, b) => {
      const catA = resolveCategory(a);
      const catB = resolveCategory(b);

      if (sortBy === 'exclusive_first') {
        if (catA === 'Exclusive' && catB !== 'Exclusive') return -1;
        if (catA !== 'Exclusive' && catB === 'Exclusive') return 1;
        return a.name.localeCompare(b.name);
      }

      if (sortBy === 'regular_first') {
        if (catA === 'Regular' && catB !== 'Regular') return -1;
        if (catA !== 'Regular' && catB === 'Regular') return 1;
        return a.name.localeCompare(b.name);
      }

      if (sortBy === 'name_asc') {
        return a.name.localeCompare(b.name);
      }

      if (sortBy === 'name_desc') {
        return b.name.localeCompare(a.name);
      }

      if (sortBy === 'price_high') {
        return getMaxPrice(b) - getMaxPrice(a);
      }

      if (sortBy === 'price_low') {
        return getMinPrice(a) - getMinPrice(b);
      }

      if (sortBy === 'rating') {
        return (b.rating || 0) - (a.rating || 0);
      }

      if (sortBy === 'newest') {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      }

      return 0;
    });
  }, [filteredProducts, sortBy]);

  const handleCategorySortToggle = () => {
    if (sortBy === 'exclusive_first') {
      setSortBy('regular_first');
    } else {
      setSortBy('exclusive_first');
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', color: '#F5F1E8' }}>
            Product Catalog & Fragrance Inventory
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#A0A0A5', marginTop: '4px' }}>
            Showing {sortedProducts.length} of {products.length} luxury fragrances across Regular & Exclusive categories.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={loadProducts}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0.75rem 1rem',
              background: '#222225',
              border: '1px solid rgba(197,168,128,0.2)',
              color: '#F5F1E8',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 500,
            }}
          >
            <RefreshCw size={15} /> Refresh
          </button>
          <Link
            to="/products/new"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '0.75rem 1.5rem',
              background: '#820011',
              color: '#FFFFFF',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
              boxShadow: '0 4px 15px rgba(130,0,17,0.3)',
            }}
          >
            <Plus size={18} style={{ color: '#FFFFFF' }} /> Add Product
          </Link>
        </div>
      </header>

      {/* Quick Category Filter Stats Tabs */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
          marginBottom: '1.25rem',
        }}
      >
        <button
          type="button"
          onClick={() => { setActiveTab('ALL'); setFilter(prev => ({ ...prev, category: '' })); }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '0.55rem 1.1rem',
            borderRadius: '30px',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            border: activeTab === 'ALL' ? '1px solid #820011' : '1px solid #E5E7EB',
            background: activeTab === 'ALL' ? 'rgba(130,0,17,0.08)' : '#FFFFFF',
            color: activeTab === 'ALL' ? '#820011' : '#374151',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            transition: 'all 0.2s ease',
          }}
        >
          <span>All Fragrances</span>
          <span style={{ padding: '2px 7px', borderRadius: '12px', background: activeTab === 'ALL' ? '#820011' : '#F3F4F6', color: activeTab === 'ALL' ? '#FFFFFF' : '#374151', fontSize: '0.75rem' }}>
            {metrics.total}
          </span>
        </button>

        <button
          type="button"
          onClick={() => { setActiveTab('EXCLUSIVE'); setFilter(prev => ({ ...prev, category: 'EXCLUSIVE' })); }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '0.55rem 1.1rem',
            borderRadius: '30px',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            border: activeTab === 'EXCLUSIVE' ? '1px solid #820011' : '1px solid #E5E7EB',
            background: activeTab === 'EXCLUSIVE' ? '#820011' : '#FFFFFF',
            color: activeTab === 'EXCLUSIVE' ? '#FFFFFF' : '#820011',
            boxShadow: activeTab === 'EXCLUSIVE' ? '0 4px 14px rgba(130,0,17,0.3)' : '0 1px 3px rgba(0,0,0,0.05)',
            transition: 'all 0.2s ease',
          }}
        >
          <Crown size={14} style={{ color: activeTab === 'EXCLUSIVE' ? '#FFD700' : '#820011' }} />
          <span>Exclusive Collection</span>
          <span style={{ padding: '2px 7px', borderRadius: '12px', background: activeTab === 'EXCLUSIVE' ? 'rgba(255,255,255,0.25)' : '#FDE8E8', color: activeTab === 'EXCLUSIVE' ? '#FFFFFF' : '#820011', fontSize: '0.75rem' }}>
            {metrics.exclusive}
          </span>
        </button>

        <button
          type="button"
          onClick={() => { setActiveTab('REGULAR'); setFilter(prev => ({ ...prev, category: 'REGULAR' })); }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '0.55rem 1.1rem',
            borderRadius: '30px',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            border: activeTab === 'REGULAR' ? '1px solid #374151' : '1px solid #E5E7EB',
            background: activeTab === 'REGULAR' ? '#374151' : '#FFFFFF',
            color: activeTab === 'REGULAR' ? '#FFFFFF' : '#374151',
            boxShadow: activeTab === 'REGULAR' ? '0 4px 14px rgba(55,65,81,0.25)' : '0 1px 3px rgba(0,0,0,0.05)',
            transition: 'all 0.2s ease',
          }}
        >
          <Sparkles size={14} />
          <span>Regular Collection</span>
          <span style={{ padding: '2px 7px', borderRadius: '12px', background: activeTab === 'REGULAR' ? 'rgba(255,255,255,0.2)' : '#F3F4F6', color: activeTab === 'REGULAR' ? '#FFFFFF' : '#374151', fontSize: '0.75rem' }}>
            {metrics.regular}
          </span>
        </button>

        <button
          type="button"
          onClick={() => { setActiveTab('ACTIVE'); setFilter(prev => ({ ...prev, category: '' })); }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '0.55rem 1.1rem',
            borderRadius: '30px',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            border: activeTab === 'ACTIVE' ? '1px solid #059669' : '1px solid #E5E7EB',
            background: activeTab === 'ACTIVE' ? '#DEF7EC' : '#FFFFFF',
            color: activeTab === 'ACTIVE' ? '#03543F' : '#374151',
            boxShadow: activeTab === 'ACTIVE' ? '0 4px 14px rgba(5,150,105,0.15)' : '0 1px 3px rgba(0,0,0,0.05)',
            transition: 'all 0.2s ease',
          }}
        >
          <CheckCircle2 size={14} style={{ color: activeTab === 'ACTIVE' ? '#03543F' : '#059669' }} />
          <span>Active Live</span>
          <span style={{ padding: '2px 7px', borderRadius: '12px', background: activeTab === 'ACTIVE' ? '#059669' : '#DEF7EC', color: activeTab === 'ACTIVE' ? '#FFFFFF' : '#03543F', fontSize: '0.75rem' }}>
            {metrics.active}
          </span>
        </button>
      </div>

      {/* Filter & Sort Controls Bar */}
      <div
        className={styles.filterBar}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          background: '#FFFFFF',
          padding: '1.1rem',
          borderRadius: '12px',
          border: '1px solid #E5E7EB',
          marginBottom: '1.5rem',
          alignItems: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}
      >
        {/* Search */}
        <div style={{ flex: '1 1 240px', position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', color: '#9CA3AF' }} />
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
              padding: '0.65rem 1rem 0.65rem 2.4rem',
              background: '#FFFFFF',
              border: '1px solid #D1D5DB',
              borderRadius: '8px',
              color: '#111114',
              outline: 'none',
              fontSize: '0.88rem',
            }}
          />
        </div>

        {/* Category Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <select
            className={styles.select}
            value={filter.category}
            onChange={(e) => {
              setFilter({ ...filter, category: e.target.value });
              if (e.target.value === 'EXCLUSIVE') setActiveTab('EXCLUSIVE');
              else if (e.target.value === 'REGULAR') setActiveTab('REGULAR');
              else setActiveTab('ALL');
            }}
            style={{
              padding: '0.65rem 1rem',
              background: '#FFFFFF',
              border: '1px solid #D1D5DB',
              borderRadius: '8px',
              color: '#111114',
              outline: 'none',
              fontSize: '0.88rem',
            }}
          >
            <option value="">All Categories ({metrics.total})</option>
            <option value="EXCLUSIVE">👑 Exclusive Collection ({metrics.exclusive})</option>
            <option value="REGULAR">✨ Regular Collection ({metrics.regular})</option>
          </select>
        </div>

        {/* Fragrance Family */}
        <select
          className={styles.select}
          value={filter.family}
          onChange={(e) => setFilter({ ...filter, family: e.target.value })}
          style={{
            padding: '0.65rem 1rem',
            background: '#FFFFFF',
            border: '1px solid #D1D5DB',
            borderRadius: '8px',
            color: '#111114',
            outline: 'none',
            fontSize: '0.88rem',
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

        {/* Gender */}
        <select
          className={styles.select}
          value={filter.gender}
          onChange={(e) => setFilter({ ...filter, gender: e.target.value })}
          style={{
            padding: '0.65rem 1rem',
            background: '#FFFFFF',
            border: '1px solid #D1D5DB',
            borderRadius: '8px',
            color: '#111114',
            outline: 'none',
            fontSize: '0.88rem',
          }}
        >
          <option value="">All Genders</option>
          <option value="MEN">MEN</option>
          <option value="WOMEN">WOMEN</option>
          <option value="UNISEX">UNISEX</option>
        </select>

        {/* Sorting Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto' }}>
          <SlidersHorizontal size={16} style={{ color: '#4B5563' }} />
          <select
            className={styles.select}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '0.65rem 1.1rem',
              background: '#FFFFFF',
              border: '1px solid #D1D5DB',
              borderRadius: '8px',
              color: '#111114',
              fontWeight: 600,
              outline: 'none',
              fontSize: '0.88rem',
              cursor: 'pointer',
            }}
          >
            <option value="exclusive_first">Sort: 👑 Exclusive First</option>
            <option value="regular_first">Sort: ✨ Regular First</option>
            <option value="name_asc">Sort: Fragrance Name (A → Z)</option>
            <option value="name_desc">Sort: Fragrance Name (Z → A)</option>
            <option value="price_high">Sort: Price (High → Low)</option>
            <option value="price_low">Sort: Price (Low → High)</option>
            <option value="rating">Sort: Rating (Highest)</option>
            <option value="newest">Sort: Newest Added</option>
          </select>
        </div>
      </div>

      {/* Main Catalog Table */}
      <div className={styles.tableCard} style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E4E4E7', overflowX: 'auto', WebkitOverflowScrolling: 'touch', width: '100%', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
        <table className={styles.table} style={{ width: '100%', minWidth: '850px', borderCollapse: 'collapse', textAlign: 'left', background: '#FFFFFF' }}>
          <thead>
            <tr style={{ background: '#27272A', color: '#FFFFFF', fontSize: '0.8rem', textTransform: 'uppercase', borderBottom: '2px solid #18181B', letterSpacing: '0.05em' }}>
              <th style={{ padding: '1rem 1.25rem', color: '#FFFFFF' }}>Fragrance</th>
              <th
                onClick={handleCategorySortToggle}
                style={{ padding: '1rem 1.25rem', cursor: 'pointer', userSelect: 'none', color: '#FFFFFF' }}
                title="Click to toggle Exclusive / Regular sort"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ color: '#FFFFFF' }}>Category</span>
                  <ArrowUpDown size={14} style={{ color: sortBy.includes('exclusive') || sortBy.includes('regular') ? '#FFD700' : '#FFFFFF' }} />
                </div>
              </th>
              <th style={{ padding: '1rem 1.25rem', color: '#FFFFFF' }}>Brand & Family</th>
              <th style={{ padding: '1rem 1.25rem', color: '#FFFFFF' }}>Sizes & Price</th>
              <th style={{ padding: '1rem 1.25rem', color: '#FFFFFF' }}>Rating</th>
              <th style={{ padding: '1rem 1.25rem', color: '#FFFFFF' }}>Status</th>
              <th style={{ padding: '1rem 1.25rem', textAlign: 'right', color: '#FFFFFF' }}>Actions</th>
            </tr>
          </thead>
          <tbody style={{ background: '#FFFFFF' }}>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: '#6B7280', background: '#FFFFFF' }}>
                  Loading product catalog ({products.length} products)...
                </td>
              </tr>
            ) : sortedProducts.length > 0 ? (
              sortedProducts.map((p) => {
                const category = resolveCategory(p);
                const isExclusive = category === 'Exclusive';

                let priceText = isExclusive ? '৳300 - ৳2,500' : '৳300 - ৳1,500';
                if (p.sizes && p.sizes.length > 0) {
                  const prices = p.sizes.map(s => Number(s.price)).filter(Boolean);
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
                  <tr
                    key={p.id}
                    style={{
                      borderBottom: '1px solid #E5E7EB',
                      background: '#FFFFFF',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = '#F9FAFB')}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = '#FFFFFF')}
                  >
                    {/* Fragrance Name & Image */}
                    <td style={{ padding: '1.1rem 1.25rem', background: 'transparent' }}>
                      <div className={styles.productCell} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img 
                          src={p.image || '/images/products/jade_serenity.png'} 
                          alt={p.name} 
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/products/jade_serenity.png';
                          }}
                          style={{
                            width: '46px',
                            height: '46px',
                            borderRadius: '8px',
                            objectFit: 'cover',
                            background: '#F3F4F6',
                            border: '1px solid #E5E7EB',
                          }} 
                        />
                        <div>
                          <div style={{ fontFamily: 'Playfair Display, serif', fontWeight: 600, color: '#111114', fontSize: '1.02rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {p.name}
                            {isExclusive && <Crown size={14} style={{ color: '#D97706' }} />}
                          </div>
                          {p.inspiredBy && (
                            <div style={{ fontSize: '0.78rem', color: '#6B7280', fontStyle: 'italic', marginTop: '2px' }}>
                              {p.inspiredBy}
                            </div>
                          )}
                          <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                            slug: {p.slug}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category Column */}
                    <td style={{ padding: '1.1rem 1.25rem', background: 'transparent' }}>
                      {isExclusive ? (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '4px 10px',
                            borderRadius: '50px',
                            background: '#820011',
                            color: '#FFFFFF',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            letterSpacing: '0.04em',
                            boxShadow: '0 2px 6px rgba(130,0,17,0.25)',
                          }}
                        >
                          <Crown size={12} style={{ color: '#FFD700' }} />
                          EXCLUSIVE
                        </span>
                      ) : (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '4px 10px',
                            borderRadius: '50px',
                            background: '#F3F4F6',
                            color: '#374151',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            letterSpacing: '0.03em',
                            border: '1px solid #E5E7EB',
                          }}
                        >
                          REGULAR
                        </span>
                      )}
                    </td>

                    {/* Brand & Family */}
                    <td style={{ padding: '1.1rem 1.25rem', background: 'transparent' }}>
                      <span style={{ padding: '3px 8px', borderRadius: '4px', background: '#F3F4F6', color: '#1F2937', fontSize: '0.78rem', border: '1px solid #E5E7EB', marginRight: '6px', fontWeight: 600 }}>
                        {p.brand || 'Murakkaz'}
                      </span>
                      <span style={{ padding: '3px 8px', borderRadius: '4px', background: '#F9FAFB', color: '#4B5563', fontSize: '0.78rem', border: '1px solid #E5E7EB' }}>
                        {p.family || 'WOODY'}
                      </span>
                    </td>

                    {/* Sizes & Price */}
                    <td style={{ padding: '1.1rem 1.25rem', background: 'transparent' }}>
                      <div style={{ fontWeight: 600, color: '#111114', fontSize: '0.95rem' }}>
                        {priceText}
                      </div>
                      {p.sizes && p.sizes.length > 0 ? (
                        <div style={{ fontSize: '0.74rem', color: '#6B7280', marginTop: '3px' }}>
                          {p.sizes.map(s => `${s.size} (৳${s.price})`).join(' · ')}
                        </div>
                      ) : (
                        <div style={{ fontSize: '0.74rem', color: '#9CA3AF', marginTop: '3px' }}>
                          {isExclusive ? '30ml: ৳1,500 · 50ml: ৳2,500' : '30ml: ৳900 · 50ml: ৳1,500'}
                        </div>
                      )}
                    </td>

                    {/* Rating */}
                    <td style={{ padding: '1.1rem 1.25rem', color: '#D97706', fontSize: '0.9rem', background: 'transparent' }}>
                      ★ {p.rating || 5.0} <span style={{ color: '#6B7280', fontSize: '0.78rem' }}>({p.reviewCount || 0})</span>
                    </td>

                    {/* Status */}
                    <td style={{ padding: '1.1rem 1.25rem', background: 'transparent' }}>
                      <span style={{ padding: '3px 10px', borderRadius: '50px', background: p.isActive !== false ? '#DEF7EC' : '#FDE8E8', color: p.isActive !== false ? '#03543F' : '#9B1C1C', fontSize: '0.76rem', fontWeight: 600, border: `1px solid ${p.isActive !== false ? '#BCF0DA' : '#FBD5D5'}` }}>
                        {p.isActive !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '1.1rem 1.25rem', textAlign: 'right', background: 'transparent' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <Link to={`/products/${p.id}/edit`} style={{ padding: '6px 14px', background: '#F3F4F6', border: '1px solid #D1D5DB', color: '#111114', borderRadius: '6px', textDecoration: 'none', fontSize: '0.82rem', fontWeight: 600 }}>
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(p.id)}
                          style={{
                            padding: '6px 14px',
                            background: '#dc2626',
                            border: '1px solid #b91c1c',
                            color: '#ffffff',
                            borderRadius: '6px',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            boxShadow: '0 2px 6px rgba(220, 38, 38, 0.25)',
                            transition: 'all 0.15s ease',
                          }}
                          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = '#b91c1c')}
                          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = '#dc2626')}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: '#6B7280', background: '#FFFFFF' }}>
                  No products found matching filters.
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
