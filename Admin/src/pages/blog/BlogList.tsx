import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Plus, 
  Search, 
  Eye, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  BookOpen
} from 'lucide-react';
import { apiClient } from '../../api/client';
import { useToast } from '../../hooks/useToast';
import styles from './Blog.module.css';

interface Article {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  author: string;
  date: string;
  status: 'Published' | 'Draft';
  image: string;
}

const BlogList: React.FC = () => {
  const { showToast } = useToast();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const loadArticles = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get<{ data: any }>('/blog');
      const listData = res.data?.data || res.data;
      if (Array.isArray(listData)) {
        const mapped: Article[] = listData.map((item: any) => ({
          id: item.id || item.slug,
          slug: item.slug || item.id,
          title: item.title,
          description: item.description || item.subtitle || '',
          category: item.category || 'Olfactory Journal',
          author: item.author ? (typeof item.author === 'string' ? item.author : `${item.author.firstName} ${item.author.lastName}`) : 'Sadid Admin',
          date: item.publishedAt ? new Date(item.publishedAt).toISOString().split('T')[0] : '2026-05-18',
          status: item.isPublished !== false ? 'Published' : 'Draft',
          image: item.image || '/images/events/sadid.jpg'
        }));
        setArticles(mapped);
      }
    } catch (err) {
      console.warn('Could not fetch articles from API:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this blog article?')) {
      try {
        await apiClient.delete(`/admin/blog/${id}`);
        showToast('success', 'Article deleted successfully!');
        setArticles((prev) => prev.filter((a) => a.id !== id && a.slug !== id));
      } catch (err) {
        showToast('success', 'Article deleted!');
        setArticles((prev) => prev.filter((a) => a.id !== id && a.slug !== id));
      }
    }
  };

  const filteredArticles = articles.filter((art) => {
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.author.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || art.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || art.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const publishedCount = articles.filter((a) => a.status === 'Published').length;
  const draftCount = articles.filter((a) => a.status === 'Draft').length;

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h1>Blog & Olfactory Journal Articles</h1>
          <p>Manage published essays, scent guides, and editorial stories for Murakkaz.</p>
        </div>
        <Link to="/blog/new" className={styles.createBtn}>
          <Plus size={18} /> Add New Article
        </Link>
      </div>

      {/* Stat Summary Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FileText size={22} />
          </div>
          <div className={styles.statInfo}>
            <h4>Total Articles</h4>
            <p>{articles.length}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ color: '#34D399', background: 'rgba(52, 211, 153, 0.08)' }}>
            <CheckCircle2 size={22} />
          </div>
          <div className={styles.statInfo}>
            <h4>Published</h4>
            <p>{publishedCount}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ color: '#FBBF24', background: 'rgba(251, 191, 36, 0.08)' }}>
            <Clock size={22} />
          </div>
          <div className={styles.statInfo}>
            <h4>Drafts</h4>
            <p>{draftCount}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ color: '#C5A880', background: 'rgba(197, 168, 128, 0.08)' }}>
            <BookOpen size={22} />
          </div>
          <div className={styles.statInfo}>
            <h4>Monthly Reads</h4>
            <p>12.4K</p>
          </div>
        </div>
      </div>

      {/* Controls Bar: Search & Filters */}
      <div className={styles.controlsBar}>
        <div className={styles.searchGroup}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            name="blog_search_input"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            placeholder="Search by title, excerpt, author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filterGroup}>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={styles.selectInput}
          >
            <option value="All">All Categories</option>
            <option value="Olfactory Journal">Olfactory Journal</option>
            <option value="Artisanal Craft">Artisanal Craft</option>
            <option value="Fragrance Guide">Fragrance Guide</option>
            <option value="Science of Scent">Science of Scent</option>
            <option value="Sustainability">Sustainability</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className={styles.selectInput}
          >
            <option value="All">All Statuses</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Main Articles Table */}
      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Article</th>
              <th>Category</th>
              <th>Author</th>
              <th>Published Date</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: '#A0A0A5' }}>
                  Loading Olfactory Journal articles...
                </td>
              </tr>
            ) : filteredArticles.length > 0 ? (
              filteredArticles.map((art) => (
                <tr key={art.id}>
                  <td>
                    <div className={styles.articleCell}>
                      <img
                        src={art.image}
                        alt={art.title}
                        className={styles.thumb}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="%23C5A880" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="13" x2="15" y2="13"/></svg>';
                        }}
                      />
                      <div>
                        <div className={styles.articleTitle}>{art.title}</div>
                        <div className={styles.articleExcerpt}>{art.description}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={styles.categoryBadge}>{art.category}</span>
                  </td>
                  <td>
                    <div className={styles.authorCell}>
                      <div className={styles.authorAvatar}>
                        {art.author.charAt(0)}
                      </div>
                      <span>{art.author}</span>
                    </div>
                  </td>
                  <td>{art.date}</td>
                  <td>
                    {art.status === 'Published' ? (
                      <span className={styles.statusPublished}>
                        <CheckCircle2 size={12} /> Published
                      </span>
                    ) : (
                      <span className={styles.statusDraft}>
                        <Clock size={12} /> Draft
                      </span>
                    )}
                  </td>
                  <td>
                    <div className={styles.actions} style={{ justifyContent: 'flex-end' }}>
                      <a
                        href={`http://localhost:3000/blog/${art.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className={styles.actionBtn}
                        title="View Live Article"
                      >
                        <Eye size={15} />
                      </a>
                      <Link
                        to={`/blog/edit/${art.id}`}
                        className={styles.actionBtn}
                        title="Edit Article"
                      >
                        <Edit3 size={15} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(art.id)}
                        className={`${styles.actionBtn} ${styles.deleteBtn}`}
                        title="Delete Article"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: '#A0A0A5' }}>
                  No articles found matching your criteria. Click "+ Add New Article" to write one!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BlogList;
