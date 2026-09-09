import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  X,
  Sparkles,
  Layers,
  Tag,
  DollarSign,
  Flame,
  Image as ImageIcon,
  Plus,
  Trash2,
  Star,
  Upload,
  Link as LinkIcon
} from 'lucide-react';
import { apiClient } from '../../api/client';
import { useToast } from '../../hooks/useToast';
import styles from './ProductForm.module.css';

interface SizeRow {
  size: string;
  price: number;
  originalPrice: number;
  stock: number;
}

interface AccordItem {
  id: string;
  name: string;
  percentage: number;
  color: string;
}

const FAMILIES = ['CITRUS', 'FRESH', 'WOODY', 'ORIENTAL', 'FLORAL', 'AQUATIC', 'GOURMAND', 'SPICY'];
const GENDERS = ['UNISEX', 'MEN', 'WOMEN'];
const OCCASIONS = ['Everyday', 'Office', 'Date Night', 'Party', 'Formal Event', 'Special Occasion', 'Casual'];
const METERS = ['INTIMATE', 'MODERATE', 'LONG_LASTING', 'BEAST_MODE'];

const REGULAR_SIZES: SizeRow[] = [
  { size: '6ml', price: 300, originalPrice: 400, stock: 50 },
  { size: '10ml', price: 500, originalPrice: 650, stock: 50 },
  { size: '30ml', price: 900, originalPrice: 1100, stock: 35 },
  { size: '50ml', price: 1500, originalPrice: 1900, stock: 25 },
];

const EXCLUSIVE_SIZES: SizeRow[] = [
  { size: '6ml', price: 300, originalPrice: 400, stock: 50 },
  { size: '10ml', price: 500, originalPrice: 650, stock: 50 },
  { size: '30ml', price: 1500, originalPrice: 1900, stock: 35 },
  { size: '50ml', price: 2500, originalPrice: 3200, stock: 25 },
];

const DEFAULT_SIZES: SizeRow[] = REGULAR_SIZES;

const DEFAULT_ACCORDS: AccordItem[] = [
  { id: '1', name: 'Woody', percentage: 85, color: '#A38258' },
  { id: '2', name: 'Citrus', percentage: 60, color: '#F59E0B' },
  { id: '3', name: 'Warm Spicy', percentage: 45, color: '#820011' },
];

const ProductForm: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'general' | 'classifications' | 'pricing' | 'notes' | 'suitability' | 'gallery'>('general');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [autoSlug, setAutoSlug] = useState(true);
  const [brand, setBrand] = useState('Murakkaz');
  const [inspiredBy, setInspiredBy] = useState('');
  const [description, setDescription] = useState('');
  const [ourTake, setOurTake] = useState('');

  // Classifications
  const [families, setFamilies] = useState<string[]>(['WOODY']);
  const [gender, setGender] = useState('UNISEX');
  const [occasions, setOccasions] = useState<string[]>(['Date Night']);
  const [meter, setMeter] = useState('BEAST_MODE');

  // Quick Note Selector for Classifications Tab
  const [quickNoteTier, setQuickNoteTier] = useState<'TOP' | 'MIDDLE' | 'BASE'>('TOP');
  const [quickNoteInput, setQuickNoteInput] = useState('');

  // Pricing & Sizes
  const [sizes, setSizes] = useState<SizeRow[]>(DEFAULT_SIZES);

  // Notes
  const [topNotes, setTopNotes] = useState<string[]>(['Bergamot', 'Lemon']);
  const [topInput, setTopInput] = useState('');

  const [middleNotes, setMiddleNotes] = useState<string[]>(['Jasmine', 'Rose']);
  const [middleInput, setMiddleInput] = useState('');

  const [baseNotes, setBaseNotes] = useState<string[]>(['Oud', 'Amber', 'Vetiver']);
  const [baseInput, setBaseInput] = useState('');

  // Accords
  const [accords, setAccords] = useState<AccordItem[]>(DEFAULT_ACCORDS);

  // Suitability Sliders
  const [bestForSeasons, setBestForSeasons] = useState({
    Spring: 70,
    Summer: 40,
    Autumn: 85,
    Winter: 95,
  });

  const [bestForTime, setBestForTime] = useState({
    Day: 60,
    Night: 95,
  });

  // Media (Start with clean empty state so no broken image icons appear!)
  const [mainImageUrl, setMainImageUrl] = useState<string>('');
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState<string>('');
  const [imageError, setImageError] = useState<boolean>(false);

  // Handle Name Change with Auto Slug
  const handleNameChange = (val: string) => {
    setName(val);
    if (autoSlug) {
      const generatedSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      setSlug(generatedSlug);
      if (generatedSlug.includes('talisman') || val.toLowerCase().includes('talisman')) {
        setMainImageUrl('/images/products/blue_talisman.jpg');
        setImageError(false);
        setGalleryUrls(['/images/products/blue_talisman.jpg']);
      }
    }
  };

  // Add Tag Helper
  const handleAddTag = (
    value: string,
    setValue: (val: string) => void,
    tags: string[],
    setTags: (tags: string[]) => void
  ) => {
    const trimmed = value.trim().replace(/,/g, '');
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setValue('');
    }
  };

  const handleRemoveTag = (tagToRemove: string, tags: string[], setTags: (t: string[]) => void) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  // Toggle Family helper (Multi-select)
  const handleToggleFamily = (fam: string) => {
    setFamilies(prev => {
      if (prev.includes(fam)) {
        if (prev.length === 1) return prev; // Preserve at least one selected
        return prev.filter(f => f !== fam);
      } else {
        return [...prev, fam];
      }
    });
  };

  // Toggle Occasion helper (Multi-select)
  const handleToggleOccasion = (occ: string) => {
    setOccasions(prev => {
      if (prev.includes(occ)) {
        if (prev.length === 1) return prev; // Preserve at least one selected
        return prev.filter(o => o !== occ);
      } else {
        return [...prev, occ];
      }
    });
  };

  // Update Size Row
  const handleSizeChange = (index: number, field: keyof SizeRow, val: number) => {
    const updated = [...sizes];
    updated[index] = { ...updated[index], [field]: val };
    setSizes(updated);
  };

  // Update Accord
  const handleAccordChange = (id: string, field: 'percentage' | 'color' | 'name', val: any) => {
    setAccords(accords.map(a => a.id === id ? { ...a, [field]: val } : a));
  };

  const handleAddAccord = () => {
    const newAccord: AccordItem = {
      id: Date.now().toString(),
      name: 'New Accord',
      percentage: 50,
      color: '#C5A880',
    };
    setAccords([...accords, newAccord]);
  };

  const handleRemoveAccord = (id: string) => {
    setAccords(accords.filter(a => a.id !== id));
  };

  // Image Upload via File
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        if (result) {
          setMainImageUrl(result);
          setImageError(false);
          setGalleryUrls(prev => [result, ...prev.filter(u => u !== result)]);
          showToast('success', 'Image uploaded and set as cover photo!');
        }
      };
      reader.readAsDataURL(files[0]);
    }
  };

  // Image Add via Direct URL
  const handleAddImageUrl = () => {
    const url = imageUrlInput.trim();
    if (!url) return;
    setMainImageUrl(url);
    setImageError(false);
    setGalleryUrls(prev => [url, ...prev.filter(u => u !== url)]);
    setImageUrlInput('');
    showToast('success', 'Image URL set as cover photo!');
  };

  // Load Existing Product if Editing
  useEffect(() => {
    if (isEdit && id) {
      setLoading(true);
      apiClient.get<{ data: any }>(`/products/${id}`)
        .then(res => {
          const p = res.data;
          setName(p.name || '');
          setSlug(p.slug || '');
          setBrand(p.brand || 'Murakkaz');
          setInspiredBy(p.inspiredBy || '');
          setDescription(p.description || '');
          setOurTake(p.ourTake || '');
          if (p.family) {
            const famList = p.family.split(',').map((f: string) => f.trim().toUpperCase()).filter(Boolean);
            if (famList.length > 0) setFamilies(famList);
          }
          setGender(p.gender || 'UNISEX');
          if (p.occasion) {
            const occList = p.occasion.split(',').map((o: string) => o.trim()).filter(Boolean);
            if (occList.length > 0) setOccasions(occList);
          }
          setMeter(p.meter || 'BEAST_MODE');

          const isBlueTalisman = (p.slug && p.slug.toLowerCase().includes('talisman')) ||
                                 (p.name && p.name.toLowerCase().includes('talisman')) ||
                                 (id && id.toLowerCase().includes('talisman')) ||
                                 id === 'prod-1788943481971' ||
                                 id === 'prod-blue-talisman-01';

          const resolvedImg = isBlueTalisman ? '/images/products/blue_talisman.jpg' : (p.image || '');
          if (resolvedImg) {
            setMainImageUrl(resolvedImg);
            setImageError(false);
          }
          const loadedGallery = (p.galleryImages && p.galleryImages.length > 0)
            ? p.galleryImages.map((g: any) => typeof g === 'string' ? g : g.url)
            : [];
          if (isBlueTalisman) {
            setGalleryUrls(['/images/products/blue_talisman.jpg']);
          } else if (p.image && !loadedGallery.includes(p.image)) {
            setGalleryUrls([p.image, ...loadedGallery]);
          } else {
            setGalleryUrls(loadedGallery);
          }
          if (p.notes && Array.isArray(p.notes) && p.notes.length > 0) {
            const top = p.notes.filter((n: any) => n.type === 'TOP').map((n: any) => n.name);
            const mid = p.notes.filter((n: any) => n.type === 'MIDDLE').map((n: any) => n.name);
            const base = p.notes.filter((n: any) => n.type === 'BASE').map((n: any) => n.name);
            if (top.length > 0) setTopNotes(top);
            if (mid.length > 0) setMiddleNotes(mid);
            if (base.length > 0) setBaseNotes(base);
          }
          if (p.accords && Array.isArray(p.accords) && p.accords.length > 0) {
            setAccords(p.accords.map((a: any, idx: number) => ({
              id: a.id || String(idx + 1),
              name: a.name,
              percentage: a.percentage || a.pct || 50,
              color: a.color || '#C5A880',
            })));
          }
        })
        .catch(err => {
          console.warn('Failed to load product detail', err);
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('error', 'Product name is required');
      return;
    }

    setSaving(true);
    const isTalismanSubmit = slug.toLowerCase().includes('talisman') || name.toLowerCase().includes('talisman');
    const finalImage = isTalismanSubmit ? '/images/products/blue_talisman.jpg' : (mainImageUrl.trim() || '/images/products/jade_serenity.png');

    const payload = {
      name,
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      brand,
      inspiredBy,
      description,
      ourTake,
      family: families.join(', '),
      gender,
      occasion: occasions.join(', '),
      meter,
      // NOTE: priceVal intentionally omitted — not in Prisma Product model.
      // Price is stored on ProductSize records, not on the Product itself.
      image: finalImage,
      isActive: true,
      sizes,
      notes: [
        ...topNotes.map(n => ({ name: n, type: 'TOP' })),
        ...middleNotes.map(n => ({ name: n, type: 'MIDDLE' })),
        ...baseNotes.map(n => ({ name: n, type: 'BASE' })),
      ],
      // Strip frontend-only 'id' from accords — Prisma auto-generates IDs
      accords: accords.map(({ name, percentage, color }) => ({ name, percentage, color })),
      bestFor: [
        ...Object.entries(bestForSeasons).map(([n, pct]) => ({ name: n, percentage: pct })),
        ...Object.entries(bestForTime).map(([n, pct]) => ({ name: n, percentage: pct })),
      ],
      galleryImages: galleryUrls.map((url, idx) => ({ url, sortOrder: idx })),
    };

    try {
      if (isEdit && id) {
        await apiClient.put(`/admin/products/${id}`, payload);
        showToast('success', 'Product updated successfully!');
      } else {
        await apiClient.post('/admin/products', payload);
        showToast('success', 'New luxury product created!');
      }
      navigate('/products');
    } catch (err: any) {
      console.error('Product save failed:', err);
      const errorMsg = err?.message || 'Failed to save product. Check backend connection.';
      showToast('error', `Save failed: ${errorMsg}`);
    } finally {
      setSaving(false);
    }
  };

  const minPrice = sizes.length > 0 ? Math.min(...sizes.map(s => s.price)) : 500;
  const maxPrice = sizes.length > 0 ? Math.max(...sizes.map(s => s.price)) : 2800;

  const isBlueTalisman = Boolean(
    slug?.toLowerCase().includes('talisman') ||
    name?.toLowerCase().includes('talisman') ||
    (id && id.toLowerCase().includes('talisman')) ||
    id === 'prod-1788943481971' ||
    id === 'prod-blue-talisman-01'
  );

  const displayCover = isBlueTalisman ? '/images/products/blue_talisman.jpg' : mainImageUrl;

  return (
    <div className={styles.container}>
      {/* Header Bar */}
      <button onClick={() => navigate('/products')} className={styles.backBtn}>
        <ArrowLeft size={16} /> Back to Products
      </button>
      <div className={styles.headerBar}>
        <div>
          <h1 className={styles.title}>{isEdit ? 'Edit Fragrance Entry' : 'Create New Fragrance'}</h1>
          <p className={styles.subtitle}>Configure luxury catalog presentation, scent pyramid, sizes & media</p>
        </div>
        <div className={styles.actions}>
          <button type="button" onClick={() => navigate('/products')} className={styles.cancelBtn}>
            Cancel
          </button>
          <button type="button" onClick={handleSubmit} disabled={saving} className={styles.saveBtn}>
            <Save size={16} /> {saving ? 'Saving...' : 'Save Fragrance'}
          </button>
        </div>
      </div>

      {/* Form Master Layout */}
      <div className={styles.formLayout}>
        {/* Left Column: Form Sections & Tabs */}
        <div className={styles.mainPanel}>
          {/* Tabs Navigation */}
          <div className={styles.tabsBar}>
            <button
              type="button"
              className={`${styles.tabBtn} ${activeTab === 'general' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('general')}
            >
              <Sparkles size={16} /> 1. General Details
            </button>
            <button
              type="button"
              className={`${styles.tabBtn} ${activeTab === 'classifications' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('classifications')}
            >
              <Tag size={16} /> 2. Classifications
            </button>
            <button
              type="button"
              className={`${styles.tabBtn} ${activeTab === 'pricing' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('pricing')}
            >
              <DollarSign size={16} /> 3. Sizes & Pricing
            </button>
            <button
              type="button"
              className={`${styles.tabBtn} ${activeTab === 'notes' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('notes')}
            >
              <Layers size={16} /> 4. Notes & Accords
            </button>
            <button
              type="button"
              className={`${styles.tabBtn} ${activeTab === 'suitability' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('suitability')}
            >
              <Flame size={16} /> 5. Suitability
            </button>
            <button
              type="button"
              className={`${styles.tabBtn} ${activeTab === 'gallery' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('gallery')}
            >
              <ImageIcon size={16} /> 6. Gallery
            </button>
          </div>

          {/* TAB 1: General Details */}
          {activeTab === 'general' && (
            <div className={styles.cardSection}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Basic Information</h2>
                <p className={styles.sectionDesc}>Product title, brand identity, inspiration & storytelling copy</p>
              </div>

              <div className={styles.gridTwo}>
                <div className={styles.formGroup}>
                  <label className={styles.formGroupLabel}>Fragrance Name *</label>
                  <input
                    type="text"
                    name="fragrance_title_input"
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck={false}
                    placeholder="e.g. Amber Royale"
                    value={name}
                    onChange={e => handleNameChange(e.target.value)}
                    className={styles.inputField}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formGroupLabel}>URL Slug</label>
                  <input
                    type="text"
                    name="fragrance_slug_input"
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck={false}
                    placeholder="e.g. amber-royale"
                    value={slug}
                    onChange={e => { setSlug(e.target.value); setAutoSlug(false); }}
                    className={styles.inputField}
                  />
                </div>
              </div>

              <div className={styles.gridTwo}>
                <div className={styles.formGroup}>
                  <label className={styles.formGroupLabel}>Brand</label>
                  <input
                    type="text"
                    name="fragrance_brand_input"
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck={false}
                    placeholder="e.g. Murakkaz"
                    value={brand}
                    onChange={e => setBrand(e.target.value)}
                    className={styles.inputField}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formGroupLabel}>Inspired By Tagline</label>
                  <input
                    type="text"
                    name="fragrance_inspired_input"
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck={false}
                    placeholder="e.g. Inspired by Baccarat Rouge 540"
                    value={inspiredBy}
                    onChange={e => setInspiredBy(e.target.value)}
                    className={styles.inputField}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formGroupLabel}>Product Description</label>
                <textarea
                  placeholder="Enter main fragrance sensory description..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className={styles.textareaField}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formGroupLabel}>Founder's "Our Take"</label>
                <textarea
                  placeholder="Enter personal review quote or perfumer's take..."
                  value={ourTake}
                  onChange={e => setOurTake(e.target.value)}
                  className={styles.textareaField}
                />
              </div>

              {/* Main Fragrance Image Upload Option */}
              <div className={styles.formGroup} style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px dashed rgba(197,168,128,0.2)' }}>
                <label className={styles.formGroupLabel} style={{ fontSize: '0.95rem', color: '#C5A880', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ImageIcon size={18} /> Primary Fragrance Image *
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: '1rem', alignItems: 'center' }}>
                  <div>
                    <label 
                      className={styles.dropzone} 
                      style={{ 
                        padding: '1.2rem', 
                        cursor: 'pointer', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        gap: '12px',
                        background: '#222225',
                        border: '1.5px dashed rgba(197,168,128,0.3)',
                        borderRadius: '10px'
                      }}
                    >
                      <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                      <Upload size={22} color="#C5A880" />
                      <div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#F5F1E8' }}>Click to Choose Image File</div>
                        <div style={{ fontSize: '0.75rem', color: '#A0A0A5' }}>Supports PNG, JPG, WEBP</div>
                      </div>
                    </label>
                  </div>
                  {mainImageUrl ? (
                    <div style={{ position: 'relative', width: '100px', height: '100px', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(197,168,128,0.3)' }}>
                      <img src={mainImageUrl} alt="Product preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ) : (
                    <div style={{ width: '100px', height: '100px', borderRadius: '10px', background: '#222225', border: '1px dashed rgba(197,168,128,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A0A0A5', fontSize: '0.75rem', textAlign: 'center', padding: '4px' }}>
                      No Image Chosen
                    </div>
                  )}
                </div>

                <div style={{ marginTop: '1rem' }}>
                  <label className={styles.formGroupLabel} style={{ fontSize: '0.8rem', color: '#A0A0A5' }}>Or enter Image Web URL directly:</label>
                  <div className={styles.urlInputRow}>
                    <input
                      type="url"
                      name="fragrance_image_url_input"
                      autoComplete="off"
                      placeholder="https://example.com/perfume.png or /images/products/jade_serenity.png"
                      value={mainImageUrl}
                      onChange={e => {
                        setMainImageUrl(e.target.value);
                        setImageError(false);
                      }}
                      className={styles.inputField}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Classifications */}
          {activeTab === 'classifications' && (
            <div className={styles.cardSection}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Fragrance Classification</h2>
                <p className={styles.sectionDesc}>Filter categories, target gender, performance meter & occasion</p>
              </div>

              {/* Fragrance Family (Multi-Select) */}
              <div className={styles.formGroup}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label className={styles.formGroupLabel} style={{ marginBottom: 0 }}>
                    Fragrance Family / Scent Profile <span style={{ fontSize: '0.8rem', color: '#C5A880', fontWeight: 'normal', marginLeft: '6px' }}>(Select one or multiple)</span>
                  </label>
                  <span style={{ fontSize: '0.78rem', color: '#A0A0A5' }}>
                    {families.length} {families.length === 1 ? 'family' : 'families'} selected
                  </span>
                </div>
                <div className={styles.pillGroup}>
                  {FAMILIES.map(fam => {
                    const isSelected = families.includes(fam);
                    return (
                      <button
                        key={fam}
                        type="button"
                        className={`${styles.pillBtn} ${isSelected ? styles.selectedPill : ''}`}
                        onClick={() => handleToggleFamily(fam)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      >
                        {isSelected && <span style={{ fontSize: '11px', lineHeight: 1 }}>✓</span>}
                        {fam}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Gender */}
              <div className={styles.formGroup}>
                <label className={styles.formGroupLabel}>Target Gender</label>
                <div className={styles.pillGroup}>
                  {GENDERS.map(g => (
                    <button
                      key={g}
                      type="button"
                      className={`${styles.pillBtn} ${gender === g ? styles.selectedPill : ''}`}
                      onClick={() => setGender(g)}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Occasion (Multi-Select) */}
              <div className={styles.formGroup}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label className={styles.formGroupLabel} style={{ marginBottom: 0 }}>
                    Best Occasion <span style={{ fontSize: '0.8rem', color: '#C5A880', fontWeight: 'normal', marginLeft: '6px' }}>(Select one or multiple)</span>
                  </label>
                  <span style={{ fontSize: '0.78rem', color: '#A0A0A5' }}>
                    {occasions.length} {occasions.length === 1 ? 'occasion' : 'occasions'} selected
                  </span>
                </div>
                <div className={styles.pillGroup}>
                  {OCCASIONS.map(occ => {
                    const isSelected = occasions.includes(occ);
                    return (
                      <button
                        key={occ}
                        type="button"
                        className={`${styles.pillBtn} ${isSelected ? styles.selectedPill : ''}`}
                        onClick={() => handleToggleOccasion(occ)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      >
                        {isSelected && <span style={{ fontSize: '11px', lineHeight: 1 }}>✓</span>}
                        {occ}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Performance Meter */}
              <div className={styles.formGroup}>
                <label className={styles.formGroupLabel}>Performance Meter</label>
                <div className={styles.pillGroup}>
                  {METERS.map(m => (
                    <button
                      key={m}
                      type="button"
                      className={`${styles.pillBtn} ${meter === m ? styles.selectedPill : ''}`}
                      onClick={() => setMeter(m)}
                    >
                      {m.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Key Scent Notes (Quick Selector right in this section) */}
              <div className={styles.formGroup} style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px dashed rgba(197,168,128,0.25)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <label className={styles.formGroupLabel} style={{ marginBottom: 2, display: 'flex', alignItems: 'center', gap: '8px', color: '#C5A880' }}>
                      <Sparkles size={15} /> Scent Notes ({topNotes.length + middleNotes.length + baseNotes.length} notes selected)
                    </label>
                    <span style={{ fontSize: '0.75rem', color: '#A0A0A5' }}>
                      Choose or type multiple notes directly in this section
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('notes')}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#C5A880',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    View Full Scent Pyramid & Accords (Tab 4) →
                  </button>
                </div>

                {/* Selected Notes Tags Container */}
                <div className={styles.tagContainer} style={{ minHeight: '44px', marginBottom: '12px' }}>
                  {topNotes.map(n => (
                    <span key={`top-${n}`} className={styles.tagChip} style={{ borderLeft: '3px solid #60A5FA' }} title="Top Note">
                      <span style={{ fontSize: '10px', opacity: 0.7, marginRight: '4px' }}>[Top]</span>
                      {n}
                      <button type="button" onClick={() => handleRemoveTag(n, topNotes, setTopNotes)} className={styles.tagRemoveBtn}>
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                  {middleNotes.map(n => (
                    <span key={`mid-${n}`} className={styles.tagChip} style={{ borderLeft: '3px solid #F472B6' }} title="Heart Note">
                      <span style={{ fontSize: '10px', opacity: 0.7, marginRight: '4px' }}>[Heart]</span>
                      {n}
                      <button type="button" onClick={() => handleRemoveTag(n, middleNotes, setMiddleNotes)} className={styles.tagRemoveBtn}>
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                  {baseNotes.map(n => (
                    <span key={`base-${n}`} className={styles.tagChip} style={{ borderLeft: '3px solid #F59E0B' }} title="Base Note">
                      <span style={{ fontSize: '10px', opacity: 0.7, marginRight: '4px' }}>[Base]</span>
                      {n}
                      <button type="button" onClick={() => handleRemoveTag(n, baseNotes, setBaseNotes)} className={styles.tagRemoveBtn}>
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                  {topNotes.length === 0 && middleNotes.length === 0 && baseNotes.length === 0 && (
                    <span style={{ color: '#777', fontSize: '0.82rem', padding: '4px 8px' }}>No notes selected yet</span>
                  )}
                </div>

                {/* Quick Add Custom Note Input with Tier Selector */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
                  <select
                    value={quickNoteTier}
                    onChange={(e) => setQuickNoteTier(e.target.value as any)}
                    style={{
                      padding: '8px 12px',
                      background: '#1A1A1D',
                      border: '1px solid rgba(197,168,128,0.3)',
                      borderRadius: '6px',
                      color: '#F5F1E8',
                      fontSize: '0.82rem',
                      outline: 'none'
                    }}
                  >
                    <option value="TOP">Top Note (Opening)</option>
                    <option value="MIDDLE">Heart Note (Heart)</option>
                    <option value="BASE">Base Note (Dry-down)</option>
                  </select>
                  <div style={{ display: 'flex', flex: '1 1 220px', gap: '6px' }}>
                    <input
                      type="text"
                      placeholder="Type note name & press Enter (e.g. Cardamom, Saffron)..."
                      value={quickNoteInput}
                      onChange={e => setQuickNoteInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' || e.key === ',') {
                          e.preventDefault();
                          if (quickNoteTier === 'TOP') handleAddTag(quickNoteInput, setQuickNoteInput, topNotes, setTopNotes);
                          else if (quickNoteTier === 'MIDDLE') handleAddTag(quickNoteInput, setQuickNoteInput, middleNotes, setMiddleNotes);
                          else handleAddTag(quickNoteInput, setQuickNoteInput, baseNotes, setBaseNotes);
                        }
                      }}
                      className={styles.inputField}
                      style={{ flex: 1, padding: '8px 12px', fontSize: '0.85rem' }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (quickNoteTier === 'TOP') handleAddTag(quickNoteInput, setQuickNoteInput, topNotes, setTopNotes);
                        else if (quickNoteTier === 'MIDDLE') handleAddTag(quickNoteInput, setQuickNoteInput, middleNotes, setMiddleNotes);
                        else handleAddTag(quickNoteInput, setQuickNoteInput, baseNotes, setBaseNotes);
                      }}
                      style={{
                        padding: '8px 14px',
                        background: 'rgba(197,168,128,0.2)',
                        border: '1px solid #C5A880',
                        color: '#F5F1E8',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.82rem',
                        fontWeight: 600
                      }}
                    >
                      Add Note
                    </button>
                  </div>
                </div>

                {/* Popular Note Suggestions */}
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#A0A0A5', marginBottom: '6px' }}>Popular Perfume Notes (Click to toggle/add):</div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {[
                      { name: 'Bergamot', tier: 'TOP' },
                      { name: 'Peach', tier: 'TOP' },
                      { name: 'Pink Pepper', tier: 'TOP' },
                      { name: 'Lemon', tier: 'TOP' },
                      { name: 'Rose', tier: 'MIDDLE' },
                      { name: 'Jasmine', tier: 'MIDDLE' },
                      { name: 'Lavender', tier: 'MIDDLE' },
                      { name: 'Saffron', tier: 'MIDDLE' },
                      { name: 'Tuberose', tier: 'MIDDLE' },
                      { name: 'Oud', tier: 'BASE' },
                      { name: 'Amber', tier: 'BASE' },
                      { name: 'Vanilla', tier: 'BASE' },
                      { name: 'Sandalwood', tier: 'BASE' },
                      { name: 'Vetiver', tier: 'BASE' },
                      { name: 'Musk', tier: 'BASE' },
                      { name: 'Patchouli', tier: 'BASE' },
                    ].map(item => {
                      const allCurrent = [...topNotes, ...middleNotes, ...baseNotes];
                      const isAdded = allCurrent.includes(item.name);
                      return (
                        <button
                          key={item.name}
                          type="button"
                          onClick={() => {
                            if (isAdded) {
                              if (topNotes.includes(item.name)) handleRemoveTag(item.name, topNotes, setTopNotes);
                              if (middleNotes.includes(item.name)) handleRemoveTag(item.name, middleNotes, setMiddleNotes);
                              if (baseNotes.includes(item.name)) handleRemoveTag(item.name, baseNotes, setBaseNotes);
                            } else {
                              if (item.tier === 'TOP') handleAddTag(item.name, () => {}, topNotes, setTopNotes);
                              else if (item.tier === 'MIDDLE') handleAddTag(item.name, () => {}, middleNotes, setMiddleNotes);
                              else handleAddTag(item.name, () => {}, baseNotes, setBaseNotes);
                            }
                          }}
                          style={{
                            background: isAdded ? 'rgba(197,168,128,0.2)' : '#1C1C24',
                            border: isAdded ? '1px solid #C5A880' : '1px solid #2D2D3D',
                            color: isAdded ? '#C5A880' : '#A0A0B0',
                            borderRadius: '12px',
                            padding: '3px 10px',
                            fontSize: '11px',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            fontWeight: isAdded ? 600 : 400
                          }}
                        >
                          {isAdded ? `✓ ${item.name}` : `+ ${item.name}`}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Sizes & Pricing */}
          {activeTab === 'pricing' && (
            <div className={styles.cardSection}>
              <div className={styles.sectionHeader}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', width: '100%' }}>
                  <div>
                    <h2 className={styles.sectionTitle}>Size Variants & Pricing Matrix</h2>
                    <p className={styles.sectionDesc}>Set prices in BDT (৳) and stock per size tier</p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => setSizes(REGULAR_SIZES)}
                      style={{
                        padding: '0.45rem 0.85rem',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        borderRadius: '6px',
                        background: '#ECE6DA',
                        border: '1px solid #D5CBB9',
                        color: '#313134',
                        cursor: 'pointer'
                      }}
                    >
                      🌿 Preset: Regular Tier (300/500/1500/2500)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSizes(EXCLUSIVE_SIZES)}
                      style={{
                        padding: '0.45rem 0.85rem',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        borderRadius: '6px',
                        background: '#820011',
                        border: 'none',
                        color: '#FFFFFF',
                        cursor: 'pointer'
                      }}
                    >
                      💎 Preset: Exclusive Tier (300/500/1500/2500)
                    </button>
                  </div>
                </div>
              </div>

              <table className={styles.pricingTable}>
                <thead>
                  <tr>
                    <th>Bottle Size</th>
                    <th>Price (BDT ৳)</th>
                    <th>Strikethrough Price</th>
                    <th>Savings %</th>
                    <th>Stock Units</th>
                  </tr>
                </thead>
                <tbody>
                  {sizes.map((row, idx) => {
                    const discount = row.originalPrice > row.price
                      ? Math.round(((row.originalPrice - row.price) / row.originalPrice) * 100)
                      : 0;

                    return (
                      <tr key={row.size}>
                        <td className={styles.sizeBadge}>{row.size}</td>
                        <td>
                          <input
                            type="number"
                            value={row.price}
                            onChange={e => handleSizeChange(idx, 'price', Number(e.target.value))}
                            className={styles.tableInput}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={row.originalPrice || ''}
                            onChange={e => handleSizeChange(idx, 'originalPrice', Number(e.target.value))}
                            className={styles.tableInput}
                          />
                        </td>
                        <td>
                          {discount > 0 ? (
                            <span className={styles.discountBadge}>{discount}% OFF</span>
                          ) : (
                            <span style={{ color: '#6E6E70', fontSize: '12px' }}>—</span>
                          )}
                        </td>
                        <td>
                          <input
                            type="number"
                            value={row.stock}
                            onChange={e => handleSizeChange(idx, 'stock', Number(e.target.value))}
                            className={styles.tableInput}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 4: Notes & Accords */}
          {activeTab === 'notes' && (
            <div className={styles.cardSection}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Scent Pyramid & Main Accords</h2>
                <p className={styles.sectionDesc}>Configure Top, Middle, Base notes and visual accord breakdown bars</p>
              </div>

              {/* Top Notes */}
              <div className={styles.formGroup}>
                <label className={styles.formGroupLabel}>Top Notes (Opening Sensation)</label>
                <div className={styles.tagContainer}>
                  {topNotes.map(n => (
                    <span key={n} className={styles.tagChip}>
                      {n}
                      <button type="button" onClick={() => handleRemoveTag(n, topNotes, setTopNotes)} className={styles.tagRemoveBtn}>
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    placeholder="Type note and press Enter..."
                    value={topInput}
                    onChange={e => setTopInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ',') {
                        e.preventDefault();
                        handleAddTag(topInput, setTopInput, topNotes, setTopNotes);
                      }
                    }}
                    className={styles.tagInput}
                  />
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                  {['Bergamot', 'Peach', 'Neroli', 'Mandarin', 'Osmanthus', 'Pink Pepper', 'Cardamom', 'Lemon'].map(sugg => (
                    !topNotes.includes(sugg) && (
                      <button
                        key={sugg}
                        type="button"
                        onClick={() => handleAddTag(sugg, setTopInput, topNotes, setTopNotes)}
                        style={{ background: '#1c1c24', border: '1px solid #2d2d3d', color: '#a0a0b0', borderRadius: '12px', padding: '2px 8px', fontSize: '11px', cursor: 'pointer' }}
                      >
                        + {sugg}
                      </button>
                    )
                  ))}
                </div>
              </div>

              {/* Middle Notes */}
              <div className={styles.formGroup}>
                <label className={styles.formGroupLabel}>Middle Notes (Heart Scent)</label>
                <div className={styles.tagContainer}>
                  {middleNotes.map(n => (
                    <span key={n} className={styles.tagChip}>
                      {n}
                      <button type="button" onClick={() => handleRemoveTag(n, middleNotes, setMiddleNotes)} className={styles.tagRemoveBtn}>
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    placeholder="Type note and press Enter..."
                    value={middleInput}
                    onChange={e => setMiddleInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ',') {
                        e.preventDefault();
                        handleAddTag(middleInput, setMiddleInput, middleNotes, setMiddleNotes);
                      }
                    }}
                    className={styles.tagInput}
                  />
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                  {['Jasmine', 'Tuberose', 'Damask Rose', 'May Rose', 'Saffron', 'Lavender', 'Orange Blossom', 'Iris'].map(sugg => (
                    !middleNotes.includes(sugg) && (
                      <button
                        key={sugg}
                        type="button"
                        onClick={() => handleAddTag(sugg, setMiddleInput, middleNotes, setMiddleNotes)}
                        style={{ background: '#1c1c24', border: '1px solid #2d2d3d', color: '#a0a0b0', borderRadius: '12px', padding: '2px 8px', fontSize: '11px', cursor: 'pointer' }}
                      >
                        + {sugg}
                      </button>
                    )
                  ))}
                </div>
              </div>

              {/* Base Notes */}
              <div className={styles.formGroup}>
                <label className={styles.formGroupLabel}>Base Notes (Dry Down Anchor)</label>
                <div className={styles.tagContainer}>
                  {baseNotes.map(n => (
                    <span key={n} className={styles.tagChip}>
                      {n}
                      <button type="button" onClick={() => handleRemoveTag(n, baseNotes, setBaseNotes)} className={styles.tagRemoveBtn}>
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    placeholder="Type note and press Enter..."
                    value={baseInput}
                    onChange={e => setBaseInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ',') {
                        e.preventDefault();
                        handleAddTag(baseInput, setBaseInput, baseNotes, setBaseNotes);
                      }
                    }}
                    className={styles.tagInput}
                  />
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                  {['Oud', 'Amber', 'Cedarwood', 'Vanilla', 'Sandalwood', 'Patchouli', 'Vetiver', 'Musk', 'Tonka Bean'].map(sugg => (
                    !baseNotes.includes(sugg) && (
                      <button
                        key={sugg}
                        type="button"
                        onClick={() => handleAddTag(sugg, setBaseInput, baseNotes, setBaseNotes)}
                        style={{ background: '#1c1c24', border: '1px solid #2d2d3d', color: '#a0a0b0', borderRadius: '12px', padding: '2px 8px', fontSize: '11px', cursor: 'pointer' }}
                      >
                        + {sugg}
                      </button>
                    )
                  ))}
                </div>
              </div>

              {/* Accords */}
              <div className={styles.formGroup} style={{ marginTop: '28px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <label className={styles.formGroupLabel}>Main Accords Breakdown</label>
                  <button type="button" onClick={handleAddAccord} className={styles.cancelBtn} style={{ padding: '4px 12px', fontSize: '12px' }}>
                    <Plus size={14} /> Add Accord
                  </button>
                </div>

                {accords.map(a => (
                  <div key={a.id} className={styles.accordRow}>
                    <input
                      type="text"
                      value={a.name}
                      onChange={e => handleAccordChange(a.id, 'name', e.target.value)}
                      className={styles.inputField}
                      style={{ width: '130px', padding: '6px 10px' }}
                    />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={a.percentage}
                      onChange={e => handleAccordChange(a.id, 'percentage', Number(e.target.value))}
                      className={styles.accordSlider}
                    />
                    <span className={styles.accordPct}>{a.percentage}%</span>
                    <input
                      type="color"
                      value={a.color}
                      onChange={e => handleAccordChange(a.id, 'color', e.target.value)}
                      className={styles.colorPickerInput}
                    />
                    <button type="button" onClick={() => handleRemoveAccord(a.id)} className={styles.tagRemoveBtn}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: Suitability */}
          {activeTab === 'suitability' && (
            <div className={styles.cardSection}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Seasonal & Time Suitability</h2>
                <p className={styles.sectionDesc}>Adjust suitability percentages for customer consultation analytics</p>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formGroupLabel}>Season Suitability</label>
                {Object.entries(bestForSeasons).map(([season, val]) => (
                  <div key={season} className={styles.accordRow}>
                    <span className={styles.accordName}>{season}</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={val}
                      onChange={e => setBestForSeasons({ ...bestForSeasons, [season]: Number(e.target.value) })}
                      className={styles.accordSlider}
                    />
                    <span className={styles.accordPct}>{val}%</span>
                  </div>
                ))}
              </div>

              <div className={styles.formGroup} style={{ marginTop: '24px' }}>
                <label className={styles.formGroupLabel}>Time of Day Suitability</label>
                {Object.entries(bestForTime).map(([time, val]) => (
                  <div key={time} className={styles.accordRow}>
                    <span className={styles.accordName}>{time}</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={val}
                      onChange={e => setBestForTime({ ...bestForTime, [time]: Number(e.target.value) })}
                      className={styles.accordSlider}
                    />
                    <span className={styles.accordPct}>{val}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: Gallery */}
          {activeTab === 'gallery' && (
            <div className={styles.cardSection}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Product Media & Image Gallery</h2>
                <p className={styles.sectionDesc}>Upload photos via File Dropzone, paste Direct Image URLs, or manage cover photo</p>
              </div>

              {/* Active Cover Photo Banner */}
              {displayCover && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '16px',
                  background: 'rgba(28, 28, 31, 0.9)',
                  border: '1px solid rgba(197, 168, 128, 0.35)',
                  borderRadius: '10px',
                  marginBottom: '24px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                }}>
                  <div style={{ position: 'relative', width: '70px', height: '70px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #C5A880', flexShrink: 0 }}>
                    <img src={displayCover} alt="Current Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '11px', color: '#111112', background: '#C5A880', padding: '2px 8px', borderRadius: '4px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Active Cover Photo
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#9A9A9C', marginTop: '4px' }}>
                      This image is displayed in the live storefront preview and catalog cards.
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const oldUrl = mainImageUrl;
                      setMainImageUrl('');
                      setGalleryUrls(prev => prev.filter(u => u !== oldUrl));
                      showToast('info', 'Cover photo removed. Upload a new photo below.');
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 14px',
                      background: '#820011',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      flexShrink: 0,
                      transition: 'background 0.2s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#A00015')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = '#820011')}
                  >
                    <Trash2 size={14} /> Remove Cover Photo
                  </button>
                </div>
              )}

              {/* Option A: Direct URL Input */}
              <div className={styles.formGroup}>
                <label className={styles.formGroupLabel}>Add via Image Web URL</label>
                <div className={styles.urlInputRow}>
                  <input
                    type="url"
                    placeholder="https://example.com/perfume-photo.png"
                    value={imageUrlInput}
                    onChange={e => setImageUrlInput(e.target.value)}
                    className={styles.inputField}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddImageUrl();
                      }
                    }}
                  />
                  <button type="button" onClick={handleAddImageUrl} className={styles.urlAddBtn}>
                    <LinkIcon size={14} /> Set as Cover
                  </button>
                </div>
              </div>

              {/* Option B: File Dropzone */}
              <div className={styles.formGroup}>
                <label className={styles.formGroupLabel}>Or Upload Local Image Files</label>
                <label className={styles.dropzone}>
                  <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                  <Upload size={36} className={styles.dropzoneIcon} />
                  <div className={styles.dropzoneText}>Click or Drag & Drop new product image</div>
                  <div className={styles.dropzoneSubtext}>Uploaded image will automatically become the Cover Photo</div>
                </label>
              </div>

              {/* Gallery Grid */}
              {galleryUrls.length > 0 ? (
                <div>
                  <label className={styles.formGroupLabel} style={{ marginBottom: '12px', display: 'block' }}>
                    Uploaded Images ({galleryUrls.length})
                  </label>
                  <div className={styles.imageGrid}>
                    {galleryUrls.map((url, idx) => {
                      const isCover = mainImageUrl === url || (idx === 0 && !mainImageUrl);

                      return (
                        <div key={idx} className={styles.imagePreviewCard}>
                          <img
                            src={url}
                            alt={`Gallery item ${idx + 1}`}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%23C5A880" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>';
                            }}
                          />
                          {isCover ? (
                            <span className={styles.mainBadge}>Cover Photo</span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setMainImageUrl(url);
                                setImageError(false);
                                showToast('info', 'Set as Main Cover Image');
                              }}
                              className={styles.setCoverBtn}
                            >
                              Set Cover
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              const updated = galleryUrls.filter((_, i) => i !== idx);
                              setGalleryUrls(updated);
                              if (mainImageUrl === url) {
                                setMainImageUrl(updated[0] || '');
                              }
                              showToast('info', 'Image removed from gallery');
                            }}
                            className={styles.imageDeleteBtn}
                            title="Delete this image"
                            style={{ background: '#820011', border: '1px solid #FFFFFF' }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px', color: '#9A9A9C', fontSize: '13px' }}>
                  No gallery images added yet. Upload files or paste URLs above.
                </div>
              )}
            </div>
          )}

          {/* Bottom Action Footer */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            marginTop: '24px',
            paddingTop: '20px',
            borderTop: '1px solid rgba(197, 168, 128, 0.15)'
          }}>
            <button
              type="button"
              onClick={() => navigate('/products')}
              className={styles.cancelBtn}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className={styles.saveBtn}
            >
              <Save size={16} /> {saving ? 'Saving Fragrance...' : 'Save Fragrance'}
            </button>
          </div>
        </div>

        {/* Right Column: Live Sticky Product Preview Sidebar */}
        <div className={styles.previewSidebar}>
          <div className={styles.previewCard}>
            <div className={styles.previewHeader}>
              <span className={styles.previewTag}>Storefront Live Preview</span>
              <span className={styles.liveBadge}>
                <span className={styles.pulseDot} /> Realtime Sync
              </span>
            </div>

            <div className={styles.previewImageFrame}>
              {displayCover && !imageError ? (
                <img
                  src={displayCover}
                  alt={name || 'Fragrance preview'}
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className={styles.placeholderContainer}>
                  <Sparkles size={36} color="#C5A880" />
                  <div style={{ fontWeight: 500, color: '#F5F1E8' }}>No Cover Photo</div>
                  <div style={{ fontSize: '12px', color: '#9A9A9C' }}>Upload image in Gallery tab</div>
                </div>
              )}
            </div>

            <div className={styles.previewBrand}>{brand || 'MURAKKAZ'}</div>
            <h3 className={styles.previewName}>{name || 'Fragrance Title'}</h3>

            {inspiredBy && <div className={styles.previewInspired}>{inspiredBy}</div>}

            <div className={styles.pillGroup} style={{ marginBottom: '14px' }}>
              {families.map(f => (
                <span key={f} className={styles.tagChip} style={{ fontSize: '11px' }}>{f}</span>
              ))}
              <span className={styles.tagChip} style={{ fontSize: '11px' }}>{gender}</span>
              <span className={styles.tagChip} style={{ fontSize: '11px' }}>{meter.replace('_', ' ')}</span>
            </div>

            <div className={styles.previewMetaRow}>
              <div className={styles.previewPrice}>
                ৳ {minPrice.toLocaleString()} – ৳ {maxPrice.toLocaleString()}
              </div>
              <div className={styles.previewRating}>
                <Star size={14} fill="#F59E0B" /> 4.9 (New)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
