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
  Users
} from 'lucide-react';
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

const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'evt-1',
    slug: 'summer-fragrance-masterclass',
    title: 'Summer Perfumery & Olfactory Masterclass',
    description: 'An exclusive hands-on session blending rare citrus accords with aged Indian Sandalwood.',
    day: '15',
    month: 'AUG',
    time: '4:00 PM - 7:00 PM',
    location: 'Dhaka Flagship Atelier, Gulshan 2',
    category: 'Masterclass',
    remindersCount: 45,
    isUpcoming: true,
    image: '/images/events/sadid.jpg'
  },
  {
    id: 'evt-2',
    slug: 'heritage-oud-exhibition-2026',
    title: 'Heritage Oud & Resin Exhibition',
    description: 'Exhibition of rare wild Cambodian & Assam agarwood specimens collected across 3 decades.',
    day: '28',
    month: 'SEP',
    time: '2:00 PM - 8:00 PM',
    location: 'Lakeside Pavilion, Banani',
    category: 'Exhibition',
    remindersCount: 68,
    isUpcoming: true,
    image: '/images/events/sadid.jpg'
  },
  {
    id: 'evt-3',
    slug: 'private-collector-gala-2026',
    title: 'Private Collector Circle Gala',
    description: 'Annual invitation-only dinner revealing our annual Extrait de Parfum private Reserve.',
    day: '12',
    month: 'MAY',
    time: '7:30 PM - 11:00 PM',
    location: 'Grand Ballroom, Westin Dhaka',
    category: 'Private Gala',
    remindersCount: 24,
    isUpcoming: false,
    image: '/images/events/sadid.jpg'
  },
  {
    id: 'evt-4',
    slug: 'artisanal-rose-distillation-showcase',
    title: 'Artisanal Taif Rose Distillation Showcase',
    description: 'Live demonstration of copper alembic hydro-distillation of fresh morning roses.',
    day: '04',
    month: 'APR',
    time: '11:00 AM - 3:00 PM',
    location: 'Chittagong Heritage Lounge',
    category: 'Showcase',
    remindersCount: 11,
    isUpcoming: false,
    image: '/images/events/sadid.jpg'
  }
];

const EventList: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Fetch events from backend API
  useEffect(() => {
    fetch('/api/events')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('API not available');
      })
      .then((data) => {
        const raw = data.data || data;
        if (Array.isArray(raw)) {
          const mapped: EventItem[] = raw.map((item: any) => ({
            id: item.id || item.slug,
            slug: item.slug || item.id,
            title: item.title,
            description: item.description || '',
            day: item.day || '15',
            month: item.month || 'AUG',
            time: item.time || '5:00 PM',
            location: item.location || 'Dhaka Flagship Store',
            category: item.category || 'Exhibition',
            remindersCount: item._count?.reminders || item.remindersCount || 0,
            isUpcoming: item.isUpcoming ?? true,
            image: item.image || '/images/events/sadid.jpg'
          }));
          setEvents(mapped);
        }
      })
      .catch(() => {
        setEvents([]);
      });
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      setEvents((prev) => prev.filter((e) => e.id !== id));
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
          <h1>Exhibitions & Olfactory Masterclasses</h1>
          <p>Manage upcoming luxury events, private scent workshops, and attendee reminder lists.</p>
        </div>
        <Link to="/events/new" className={styles.createBtn}>
          <Plus size={18} /> Add New Event
        </Link>
      </div>

      {/* Stat Summary Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Calendar size={22} />
          </div>
          <div className={styles.statInfo}>
            <h4>Total Events</h4>
            <p>{events.length}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ color: '#34D399', background: 'rgba(52, 211, 153, 0.08)' }}>
            <CheckCircle2 size={22} />
          </div>
          <div className={styles.statInfo}>
            <h4>Upcoming</h4>
            <p>{upcomingCount}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ color: '#A0A0A5', background: 'rgba(160, 160, 165, 0.08)' }}>
            <Clock size={22} />
          </div>
          <div className={styles.statInfo}>
            <h4>Past Exhibitions</h4>
            <p>{pastCount}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ color: '#C5A880', background: 'rgba(197, 168, 128, 0.08)' }}>
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
        <table className={styles.table}>
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
            {filteredEvents.length > 0 ? (
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
                          <MapPin size={12} style={{ color: '#C5A880' }} /> {evt.location}
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
                        href="http://localhost:3000/events"
                        target="_blank"
                        rel="noreferrer"
                        className={styles.actionBtn}
                        title="View Live Events Page"
                      >
                        <Eye size={15} />
                      </a>
                      <Link
                        to={`/events/edit/${evt.id}`}
                        className={styles.actionBtn}
                        title="Edit Event"
                      >
                        <Edit3 size={15} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(evt.id)}
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
                <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: '#A0A0A5' }}>
                  No events found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventList;
