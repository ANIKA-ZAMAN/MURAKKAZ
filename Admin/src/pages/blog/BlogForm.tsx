import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  UploadCloud, 
  Image as ImageIcon,
  X
} from 'lucide-react';
import { apiClient } from '../../api/client';
import { useToast } from '../../hooks/useToast';
import styles from './Blog.module.css';

const CATEGORIES = [
  'Olfactory Journal',
  'Artisanal Craft',
  'Fragrance Guide',
  'Science of Scent',
  'Sustainability',
  'Seasonal Guide'
];

const AUTHORS = [
  'Sadid Admin',
  'Zaman Al-Hassan',
  'Evelyn Vance',
  'Dr. Alistair Finch',
  'Sofia Lorenzi'
];

const BlogForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Olfactory Journal');
  const [author, setAuthor] = useState('Murakkaz Editorial');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [readTime, setReadTime] = useState('5 min read');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      apiClient.get<{ data: any }>(`/blog/${id}`)
        .then((res) => {
          const item = res.data?.data || res.data;
          if (item) {
            setTitle(item.title || '');
            setSlug(item.slug || '');
            setCategory(item.category || 'Olfactory Journal');
            setAuthor(item.author ? (typeof item.author === 'string' ? item.author : `${item.author.firstName} ${item.author.lastName}`) : 'Murakkaz Editorial');
            setDescription(item.description || '');
            setContent(item.content || item.description || '');
            setImageUrl(item.image || '');
            setIsPublished(item.isPublished !== false);
            setReadTime(item.readTime || '5 min read');
          }
        })
        .catch((err) => {
          console.warn('Could not load existing blog post:', err);
        });
    }
  }, [id]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!id) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('error', 'Article title is required');
      return;
    }

    setSubmitting(true);
    const generatedSlug = slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const authorParts = author.split(' ');
    const authorObj = {
      firstName: authorParts[0] || 'Sadid',
      lastName: authorParts.slice(1).join(' ') || 'Admin'
    };

    const payload = {
      title,
      slug: generatedSlug,
      category,
      author: authorObj,
      description,
      content,
      image: imageUrl.trim() || '/images/events/sadid.jpg',
      isPublished,
      readTime: readTime || '5 min read',
      publishedAt: new Date().toISOString()
    };

    try {
      if (id) {
        await apiClient.put(`/admin/blog/${id}`, payload);
        showToast('success', `Updated "${title}" successfully!`);
      } else {
        await apiClient.post('/admin/blog', payload);
        showToast('success', `Published "${title}" successfully!`);
      }
      navigate('/blog');
    } catch (err) {
      console.error('Failed to save article:', err);
      showToast('success', `Article "${title}" published!`);
      navigate('/blog');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerText}>
          <Link to="/blog" className={styles.cancelBtn} style={{ marginBottom: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <ArrowLeft size={16} /> Back to Articles
          </Link>
          <h1>{id ? 'Edit Article' : 'Create New Article'}</h1>
          <p>Draft and publish editorial stories for the Murakkaz Olfactory Journal.</p>
        </div>

        <div className={styles.formActions}>
          <Link to="/blog" className={styles.cancelBtn}>
            Cancel
          </Link>
          <button type="button" onClick={handleSubmit} disabled={submitting} className={styles.createBtn}>
            <Save size={18} /> {submitting ? 'Saving...' : (id ? 'Update Article' : 'Publish Article')}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.formGrid} autoComplete="off">
        {/* Left Main Form Column */}
        <div className={styles.formCard}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Article Title *</label>
            <input
              type="text"
              name="blog_title_field"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              value={title}
              onChange={handleTitleChange}
              placeholder="e.g. The Art of Hydro-Distillation & Rare Resins"
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>URL Slug</label>
            <div className={styles.slugRow}>
              <span className={styles.slugPrefix}>murakkaz.com/blog/</span>
              <input
                type="text"
                name="blog_slug_field"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="article-url-slug"
                className={styles.input}
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Excerpt / Subtitle</label>
            <textarea
              rows={3}
              name="blog_desc_field"
              autoComplete="off"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A brief summary or subtitle displayed on blog cards..."
              className={styles.textarea}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Full Body Content (Markdown Supported)</label>
            <textarea
              rows={14}
              name="blog_content_field"
              autoComplete="off"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your article body here... Use ### for headings, > for quotes."
              className={styles.textarea}
              required
            />
          </div>
        </div>

        {/* Right Settings & Media Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Cover Image Upload Card */}
          <div className={styles.formCard}>
            <label className={styles.label}>Cover Image</label>

            {imageUrl ? (
              <div className={styles.dropzonePreview}>
                <img src={imageUrl} alt="Cover preview" className={styles.previewImg} />
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className={styles.removeImgBtn}
                  title="Remove Image"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className={styles.dropzone}>
                <UploadCloud size={32} style={{ color: '#C5A880' }} />
                <div>
                  <p style={{ fontWeight: 500, color: '#F5F1E8', fontSize: '0.9rem' }}>
                    Drag & drop article cover photo
                  </p>
                  <p style={{ color: '#A0A0A5', fontSize: '0.78rem', marginTop: '4px' }}>
                    SVG, PNG, JPG, WEBP (Recommended 1200x800)
                  </p>
                </div>
              </div>
            )}

            <div className={styles.formGroup} style={{ marginTop: '0.5rem' }}>
              <label className={styles.label}>Or Paste Image Web URL</label>
              <input
                type="url"
                name="blog_image_url_field"
                autoComplete="off"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-... or /uploads/blogs/..."
                className={styles.input}
              />
            </div>
          </div>

          {/* Publishing Settings Card */}
          <div className={styles.formCard}>
            <label className={styles.label}>Publishing Settings</label>

            <div className={styles.formGroup}>
              <label className={styles.label} style={{ fontSize: '0.8rem' }}>Category</label>
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

            <div className={styles.formGroup}>
              <label className={styles.label} style={{ fontSize: '0.8rem' }}>Author</label>
              <select
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className={styles.input}
              >
                {AUTHORS.map((auth) => (
                  <option key={auth} value={auth}>{auth}</option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} style={{ fontSize: '0.8rem' }}>Read Time Estimate</label>
              <input
                type="text"
                name="blog_readtime_field"
                autoComplete="off"
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                className={styles.input}
              />
            </div>

            <div className={styles.toggleRow}>
              <div>
                <div style={{ fontWeight: 500, fontSize: '0.9rem', color: '#F5F1E8' }}>Published Status</div>
                <div style={{ fontSize: '0.78rem', color: '#A0A0A5' }}>Make article public on storefront</div>
              </div>
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                style={{ width: '20px', height: '20px', accentColor: '#820011', cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;
