import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  UploadCloud, 
  MapPin, 
  Calendar, 
  Clock, 
  X
} from 'lucide-react';
import styles from './Events.module.css';

const CATEGORIES = [
  'Masterclass',
  'Exhibition',
  'Private Gala',
  'Showcase',
  'Store Opening'
];

const EventForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();

  const [title, setTitle] = useState(id ? 'Summer Perfumery & Olfactory Masterclass' : '');
  const [slug, setSlug] = useState(id ? 'summer-fragrance-masterclass' : '');
  const [category, setCategory] = useState('Masterclass');
  const [day, setDay] = useState(id ? '15' : '15');
  const [month, setMonth] = useState(id ? 'AUG' : 'AUG');
  const [time, setTime] = useState(id ? '4:00 PM - 7:00 PM' : '4:00 PM - 7:00 PM');
  const [location, setLocation] = useState(id ? 'Dhaka Flagship Atelier, Gulshan 2' : '');
  const [description, setDescription] = useState(id ? 'An exclusive hands-on session blending rare citrus accords with aged Indian Sandalwood.' : '');
  const [imageUrl, setImageUrl] = useState(id ? '/images/events/sadid.jpg' : '');
  const [isUpcoming, setIsUpcoming] = useState(true);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!id) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Event ${id ? 'updated' : 'created'} successfully!`);
    navigate('/events');
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerText}>
          <Link to="/events" className={styles.cancelBtn} style={{ marginBottom: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <ArrowLeft size={16} /> Back to Events
          </Link>
          <h1>{id ? 'Edit Exhibition Event' : 'Create New Event'}</h1>
          <p>Schedule masterclasses, private galas, and olfactory exhibitions.</p>
        </div>

        <div className={styles.formActions}>
          <Link to="/events" className={styles.cancelBtn}>
            Cancel
          </Link>
          <button type="button" onClick={handleSubmit} className={styles.createBtn}>
            <Save size={18} /> {id ? 'Update Event' : 'Publish Event'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.formGrid}>
        {/* Left Column */}
        <div className={styles.formCard}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Event Title</label>
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
            <label className={styles.label}>URL Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="event-url-slug"
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Venue & Location Address</label>
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
            <label className={styles.label}>Event Description</label>
            <textarea
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Full details about what attendees will experience, featured perfume notes, and hosts..."
              className={styles.textarea}
              required
            />
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Cover Photo Card */}
          <div className={styles.formCard}>
            <label className={styles.label}>Event Cover Banner</label>

            {imageUrl ? (
              <div className={styles.dropzonePreview}>
                <img src={imageUrl} alt="Cover preview" className={styles.previewImg} />
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
              <div className={styles.dropzone}>
                <UploadCloud size={32} style={{ color: '#C5A880' }} />
                <div>
                  <p style={{ fontWeight: 500, color: '#F5F1E8', fontSize: '0.9rem' }}>
                    Upload Event Banner
                  </p>
                  <p style={{ color: '#A0A0A5', fontSize: '0.78rem', marginTop: '4px' }}>
                    SVG, PNG, JPG (Recommended 1200x600)
                  </p>
                </div>
              </div>
            )}

            <div className={styles.formGroup} style={{ marginTop: '0.5rem' }}>
              <label className={styles.label}>Or Image URL</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className={styles.input}
              />
            </div>
          </div>

          {/* Schedule Settings Card */}
          <div className={styles.formCard}>
            <label className={styles.label}>Schedule & Category</label>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div className={styles.formGroup}>
                <label className={styles.label} style={{ fontSize: '0.78rem' }}>Day (01-31)</label>
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
                <label className={styles.label} style={{ fontSize: '0.78rem' }}>Month (e.g. AUG)</label>
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
              <label className={styles.label} style={{ fontSize: '0.78rem' }}>Time Range</label>
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
                <div style={{ fontWeight: 500, fontSize: '0.9rem', color: '#F5F1E8' }}>Upcoming Status</div>
                <div style={{ fontSize: '0.78rem', color: '#A0A0A5' }}>Display under upcoming events</div>
              </div>
              <input
                type="checkbox"
                checked={isUpcoming}
                onChange={(e) => setIsUpcoming(e.target.checked)}
                style={{ width: '20px', height: '20px', accentColor: '#820011', cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
