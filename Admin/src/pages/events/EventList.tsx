import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Plus, 
  Search, 
  MapPin, 
  Bell, 
  Eye, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Clock,
  Sparkles,
  Users,
  Loader2
} from 'lucide-react';
import { apiClient } from '../../api/client';
import { useToast } from '../../hooks/useToast';
import styles from './Events.module.css';

interface EventItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  day: string;
  month: string;
  time: string;
  location: string;
  category: string;
  remindersCount: number;
  isUpcoming: boolean;
  image: string;
}

const EventList: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const { showToast } = useToast();

  const fetchEvents = async () => {
    setLoading(true);
    try {
      // Try admin endpoint first, fallback to public
      const res = await apiClient.get<{ data: any[] }>('/admin/events').catch(() => null);
      let raw = res?.data || res;

      if (!raw || !Array.isArray(raw)) {
        const publicRes = await fetch('/api/events').then(r => r.json()).catch(() => null);
        raw = publicRes?.data || publicRes;
      }

      if (Array.isArray(raw)) {
        const mapped: EventItem[] = raw.map((item: any) => ({
          id: item.id || item.slug,
          slug: item.slug || item.id,
          title: item.title,
          description: item.description || '',
          day: item.day || '15',
          month: item.month || 'AUG',
          time: item.time || '5:00 PM',
          location: item.location || 'Dhaka Flagship Atelier',
          category: item.category || 'Exhibition',
          remindersCount: item._count?.reminders ?? item.remindersCount ?? 0,
          isUpcoming: item.isUpcoming ?? true,
          image: item.image || '/images/events/sadid.jpg'
        }));
        setEvents(mapped);
      } else {
        setEvents([]);
      }
    } catch (err) {
      console.error('Failed to load events:', err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete the event "${title}"?`)) {
      try {
        await apiClient.delete(`/admin/events/${id}`);
        setEvents((prev) => prev.filter((e) => e.id !== id && e.slug !== id));
        showToast('success', 'Event deleted successfully');
      } catch (err: any) {
        console.error('Delete error:', err);
        showToast('error', err.message || 'Failed to delete event');
      }
    }
  };

  const filteredEvents = events.filter((evt) => {
    const matchesSearch =
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || evt.category === selectedCategory;
    const matchesStatus =
      selectedStatus === 'All' ||
      (selectedStatus === 'Upcoming' && evt.isUpcoming) ||
      (selectedStatus === 'Past' && !evt.isUpcoming);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const upcomingCount = events.filter((e) => e.isUpcoming).length;
  const pastCount = events.filter((e) => !e.isUpcoming).length;
  const totalReminders = events.reduce((sum, e) => sum + e.remindersCount, 0);

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h1>Olfactory Events & Masterclasses</h1>
          <p>Schedule, manage and track reservations for Murakkaz exhibitions.</p>
        </div>

        <Link to="/events/new" className={styles.createBtn}>
          <Plus size={18} /> Create New Event
        </Link>
      </div>

      {/* Metrics Summary Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ color: 'var(--brand-maroon, #820011)', background: 'rgba(130, 0, 17, 0.08)' }}>
            <Calendar size={22} />
          </div>
          <div className={styles.statInfo}>
            <h4>Total Events</h4>
            <p>{events.length}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ color: '#059669', background: 'rgba(5, 150, 105, 0.08)' }}>
            <Sparkles size={22} />
          </div>
          <div className={styles.statInfo}>
            <h4>Upcoming</h4>
            <p>{upcomingCount}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ color: '#D97706', background: 'rgba(217, 119, 6, 0.08)' }}>
            <Clock size={22} />
          </div>
          <div className={styles.statInfo}>
            <h4>Past / Archive</h4>
            <p>{pastCount}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ color: 'var(--brand-maroon, #820011)', background: 'rgba(197, 168, 128, 0.08)' }}>
            <Bell size={22} />
          </div>
          <div className={styles.statInfo}>
            <h4>Reminder RSVPs</h4>
            <p>{totalReminders}</p>
          </div>
        </div>
      </div>

      {/* Controls Bar: Search & Filters */}
      <div className={styles.controlsBar}>
        <div className={styles.searchGroup}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by event title, location, description..."
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
            <option value="Masterclass">Masterclass</option>
            <option value="Exhibition">Exhibition</option>
            <option value="Private Gala">Private Gala</option>
            <option value="Showcase">Showcase</option>
            <option value="Store Opening">Store Opening</option>
            <option value="Scent Discovery">Scent Discovery</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className={styles.selectInput}
          >
            <option value="All">All Statuses</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Past">Past</option>
          </select>
        </div>
      </div>

      {/* Main Events Table */}
      <div className={styles.tableCard}>
        <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table className={styles.table} style={{ width: '100%', minWidth: '700px' }}>
            <thead>
              <tr>
                <th>Date & Event</th>
                <th>Category</th>
                <th>Time & Schedule</th>
                <th>Reminder Subscriptions</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary, #9A9A9C)' }}>
                    <Loader2 size={24} className="animate-spin" style={{ margin: '0 auto 8px', color: 'var(--brand-maroon, #820011)' }} />
                    Loading events...
                  </td>
                </tr>
              ) : filteredEvents.length > 0 ? (
                filteredEvents.map((evt) => (
                  <tr key={evt.id}>
                    <td>
                      <div className={styles.eventCell}>
                        <div className={styles.dateBadge}>
                          <span className={styles.dateDay}>{evt.day}</span>
                          <span className={styles.dateMonth}>{evt.month}</span>
                        </div>
                        <div>
                          <div className={styles.eventTitle}>{evt.title}</div>
                          <div className={styles.eventLocation}>
                            <MapPin size={12} style={{ color: 'var(--brand-maroon, #820011)' }} /> {evt.location}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={styles.categoryBadge}>{evt.category}</span>
                    </td>
                    <td>{evt.time}</td>
                    <td>
                      <span className={styles.reminderBadge}>
                        <Bell size={12} /> {evt.remindersCount} RSVPs
                      </span>
                    </td>
                    <td>
                      {evt.isUpcoming ? (
                        <span className={styles.statusUpcoming}>
                          <CheckCircle2 size={12} /> Upcoming
                        </span>
                      ) : (
                        <span className={styles.statusPast}>
                          <Clock size={12} /> Past
                        </span>
                      )}
                    </td>
                    <td>
                      <div className={styles.actions} style={{ justifyContent: 'flex-end' }}>
                        <a
                          href="/events"
                          target="_blank"
                          rel="noreferrer"
                          className={styles.actionBtn}
                          title="View Live Events Page"
                        >
                          <Eye size={15} />
                        </a>
                        <Link
                          to={`/events/${evt.id}/edit`}
                          className={styles.actionBtn}
                          title="Edit Event"
                        >
                          <Edit3 size={15} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(evt.id, evt.title)}
                          className={`${styles.actionBtn} ${styles.deleteBtn}`}
                          title="Delete Event"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary, #9A9A9C)' }}>
                    No events found. Click "+ Create New Event" above to schedule an exhibition!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EventList;
