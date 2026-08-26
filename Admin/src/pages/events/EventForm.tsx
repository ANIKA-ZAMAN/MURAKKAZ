import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  UploadCloud, 
  MapPin, 
  Calendar, 
  Clock, 
  X,
  Sparkles,
  Loader2
} from 'lucide-react';
import { apiClient } from '../../api/client';
import { useToast } from '../../hooks/useToast';
import styles from './Events.module.css';

const CATEGORIES = [
  'Masterclass',
  'Exhibition',
  'Private Gala',
  'Showcase',
  'Store Opening',
  'Scent Discovery'
];

const PRESET_BANNERS = [
  { label: 'Exhibition Masterclass', url: '/images/events/sadid.jpg' },
  { label: 'Oud Distillation', url: '/images/events/event_gallery_1.jpg' },
  { label: 'Atelier Showcase', url: '/images/events/event_gallery_3.jpg' },
  { label: 'Collector Gala', url: '/images/events/event_gallery_5.jpg' },
];

const EventForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEdit = Boolean(id);
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [autoSlug, setAutoSlug] = useState(!isEdit);
  const [category, setCategory] = useState('Masterclass');
  const [day, setDay] = useState('15');
  const [month, setMonth] = useState('AUG');
  const [time, setTime] = useState('4:00 PM - 7:00 PM');
  const [dateInput, setDateInput] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('/images/events/sadid.jpg');
  const [isUpcoming, setIsUpcoming] = useState(true);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Load existing event data if editing
  useEffect(() => {
    if (isEdit && id) {
      setLoading(true);
      apiClient.get<{ data: any }>(`/admin/events/${id}`)
        .then((res) => {
          const evt = res.data || res;
          if (evt) {
            setTitle(evt.title || '');
            setSlug(evt.slug || '');
            setCategory(evt.category || 'Masterclass');
            setDay(evt.day || '15');
            setMonth(evt.month || 'AUG');
            setTime(evt.time || '4:00 PM - 7:00 PM');
            setLocation(evt.location || '');
            setDescription(evt.description || '');
            setImageUrl(evt.image || '/images/events/sadid.jpg');
            setIsUpcoming(evt.isUpcoming ?? true);
            if (evt.eventDate) {
              const d = new Date(evt.eventDate);
              if (!isNaN(d.getTime())) {
                setDateInput(d.toISOString().slice(0, 10));
              }
            }
          }
        })
        .catch((err) => {
          console.error('Error fetching event:', err);
          showToast('error', 'Failed to load event details');
        })
        .finally(() => setLoading(false));
    } else {
      // Default to 14 days from now
      const future = new Date();
      future.setDate(future.getDate() + 14);
      setDateInput(future.toISOString().slice(0, 10));
      setDay(String(future.getDate()).padStart(2, '0'));
      setMonth(future.toLocaleString('en-US', { month: 'short' }).toUpperCase());
    }
  }, [id, isEdit]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (autoSlug) {
      setSlug(val.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDateInput(val);
    if (val) {
      const d = new Date(val);
      if (!isNaN(d.getTime())) {
        setDay(String(d.getDate()).padStart(2, '0'));
        setMonth(d.toLocaleString('en-US', { month: 'short' }).toUpperCase());
      }
    }
  };

  // Handle local file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    try {
      const token = localStorage.getItem('murakkaz_admin_access_token');
      const res = await fetch('/api/admin/events/upload', {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: formData,
      });

      const json = await res.json();
      if (res.ok && json.data?.url) {
        setImageUrl(json.data.url);
        showToast('success', 'Event banner uploaded successfully');
      } else {
        throw new Error(json.message || 'Image upload failed');
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      showToast('error', err.message || 'Failed to upload event image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('error', 'Please enter an event title');
      return;
    }
    if (!description.trim()) {
      showToast('error', 'Please enter an event description');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        slug: slug.trim(),
        category,
        day,
        month,
        time,
        location: location.trim() || 'Dhaka Flagship Atelier',
        description: description.trim(),
        image: imageUrl || '/images/events/sadid.jpg',
        isUpcoming,
        eventDate: dateInput ? new Date(dateInput).toISOString() : new Date().toISOString()
      };

      if (isEdit && id) {
        await apiClient.put(`/admin/events/${id}`, payload);
        showToast('success', 'Event updated successfully');
      } else {
        await apiClient.post('/admin/events', payload);
        showToast('success', 'New event published successfully');
      }

      navigate('/events');
    } catch (err: any) {
      console.error('Save error:', err);
      showToast('error', err.message || 'Failed to save event');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container} style={{ textAlign: 'center', padding: '60px 20px' }}>
        <Loader2 className="animate-spin" size={36} style={{ margin: '0 auto 16px', color: 'var(--brand-maroon, #820011)' }} />
        <p style={{ color: 'var(--text-secondary, #9A9A9C)' }}>Loading event details...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerText}>
          <Link to="/events" className={styles.cancelBtn} style={{ marginBottom: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <ArrowLeft size={16} /> Back to Events
          </Link>
          <h1>{isEdit ? 'Edit Exhibition Event' : 'Create New Event'}</h1>
          <p>Schedule masterclasses, private galas, and olfactory exhibitions.</p>
        </div>

        <div className={styles.formActions}>
          <Link to="/events" className={styles.cancelBtn}>
            Cancel
          </Link>
          <button 
            type="button" 
            onClick={handleSubmit} 
            disabled={saving || uploading}
            className={styles.createBtn}
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {isEdit ? (saving ? 'Updating...' : 'Update Event') : (saving ? 'Publishing...' : 'Publish Event')}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.formGrid}>
        {/* Left Column: Core Info */}
        <div className={styles.formCard}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Event Title *</label>
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="e.g. Summer Perfumery & Olfactory Masterclass"
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>URL Slug *</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setAutoSlug(false);
              }}
              placeholder="e.g. summer-perfumery-masterclass"
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Venue & Location Address *</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Dhaka Flagship Atelier, House 14, Road 53, Gulshan 2"
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Event Description *</label>
            <textarea
              rows={7}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Full details about what attendees will experience, featured perfume notes, guest perfumers, and exclusive gifts..."
              className={styles.textarea}
              required
            />
          </div>
        </div>

        {/* Right Column: Media, Schedule & Settings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Cover Photo Card */}
          <div className={styles.formCard}>
            <label className={styles.label}>Event Cover Banner</label>

            {imageUrl ? (
              <div className={styles.dropzonePreview}>
                <img 
                  src={imageUrl} 
                  alt="Cover preview" 
                  className={styles.previewImg} 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/events/sadid.jpg';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className={styles.removeImgBtn}
                  title="Remove Banner"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label className={styles.dropzone} style={{ cursor: 'pointer' }}>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileUpload} 
                  style={{ display: 'none' }} 
                />
                <UploadCloud size={32} style={{ color: 'var(--brand-maroon, #820011)' }} />
                <div>
                  <p style={{ fontWeight: 600, color: 'var(--text-primary, #111114)', fontSize: '0.92rem' }}>
                    {uploading ? 'Uploading banner...' : 'Click to Upload Event Banner'}
                  </p>
                  <p style={{ color: 'var(--text-secondary, #9A9A9C)', fontSize: '0.78rem', marginTop: '4px' }}>
                    PNG, JPG, WEBP (Recommended 1200x600)
                  </p>
                </div>
              </label>
            )}

            {/* Quick Upload Button */}
            <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
              <label 
                style={{ 
                  flex: 1, 
                  textAlign: 'center', 
                  padding: '8px 12px', 
                  background: 'var(--bg-surface-hover, #252528)', 
                  border: '1px solid var(--border-subtle, rgba(197, 168, 128, 0.2))', 
                  borderRadius: '6px', 
                  cursor: 'pointer', 
                  fontSize: '12.5px',
                  fontWeight: 500,
                  color: 'var(--text-primary, #F5F1E8)'
                }}
              >
                <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
                {uploading ? 'Uploading File...' : '📁 Upload Local File'}
              </label>
            </div>

            <div className={styles.formGroup} style={{ marginTop: '12px' }}>
              <label className={styles.label} style={{ fontSize: '0.78rem' }}>Or Banner Image URL</label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="/images/events/sadid.jpg or https://..."
                className={styles.input}
              />
            </div>

            {/* Preset Banners */}
            <div style={{ marginTop: '10px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted, #7E7E85)', textTransform: 'uppercase', fontWeight: 600 }}>
                Quick Presets:
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                {PRESET_BANNERS.map((preset) => (
                  <button
                    key={preset.url}
                    type="button"
                    onClick={() => setImageUrl(preset.url)}
                    style={{
                      fontSize: '11px',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      background: imageUrl === preset.url ? 'var(--brand-maroon, #820011)' : 'var(--bg-surface-hover, #252528)',
                      color: imageUrl === preset.url ? '#fff' : 'var(--text-secondary, #9A9A9C)',
                      border: '1px solid var(--border-subtle, rgba(197, 168, 128, 0.2))',
                      cursor: 'pointer'
                    }}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Schedule & Category Card */}
          <div className={styles.formCard}>
            <label className={styles.label}>Schedule & Classification</label>

            <div className={styles.formGroup}>
              <label className={styles.label} style={{ fontSize: '0.78rem' }}>Event Calendar Date *</label>
              <input
                type="date"
                value={dateInput}
                onChange={handleDateChange}
                className={styles.input}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div className={styles.formGroup}>
                <label className={styles.label} style={{ fontSize: '0.78rem' }}>Day Badge (01-31)</label>
                <input
                  type="text"
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  placeholder="15"
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} style={{ fontSize: '0.78rem' }}>Month Badge (e.g. AUG)</label>
                <input
                  type="text"
                  value={month}
                  onChange={(e) => setMonth(e.target.value.toUpperCase())}
                  placeholder="AUG"
                  className={styles.input}
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} style={{ fontSize: '0.78rem' }}>Time Range *</label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="4:00 PM - 7:00 PM"
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} style={{ fontSize: '0.78rem' }}>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={styles.input}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className={styles.toggleRow}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary, #F5F1E8)' }}>
                  Upcoming Status
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary, #9A9A9C)' }}>
                  Active under upcoming exhibitions & masterclasses
                </div>
              </div>
              <input
                type="checkbox"
                checked={isUpcoming}
                onChange={(e) => setIsUpcoming(e.target.checked)}
                style={{ width: '20px', height: '20px', accentColor: 'var(--brand-maroon, #820011)', cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
