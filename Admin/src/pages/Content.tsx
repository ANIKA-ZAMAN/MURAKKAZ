import React, { useState } from 'react';
import { 
  Layout, 
  Save, 
  Sparkles, 
  Award, 
  CheckCircle2, 
  BookOpen, 
  Sliders, 
  TrendingUp,
  Globe
} from 'lucide-react';
import styles from './Content.module.css';

const Content: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Brand Ticker');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // States
  const [tickerText, setTickerText] = useState(
    '100% Extrait de Parfum Concentration • Handcrafted in Dhaka • Free Express Delivery Over ৳3,000 • Complimentary Sample Vial with Every Order'
  );

  const [points, setPoints] = useState([
    { title: 'Artisanal Hydro-Distillation', desc: 'Preserving delicate floral oils in traditional copper alembic stills.' },
    { title: '12+ Hour Beast-Mode Longevity', desc: 'High oil concentration engineered for tropical heat and humidity.' },
    { title: 'Ethical Botanical Sourcing', desc: 'Supporting sustainable agarwood plantation farms across Sylhet.' },
    { title: '100% Satisfaction Guarantee', desc: 'Try sample vials risk-free before opening full-size bottles.' }
  ]);

  const [founderBio, setFounderBio] = useState(
    'Murakkaz was born out of a deep reverence for heritage perfumery and Eastern agarwood traditions. Founded in 2024 by Sadid Admin, our mission is to craft uncompromised Extrait de Parfum using rare botanical essences.'
  );

  const [stats, setStats] = useState([
    { label: 'Niche Fragrances', value: '50+' },
    { label: 'Collector Circle Members', value: '15,000+' },
    { label: 'Average Review Rating', value: '4.9★' },
    { label: 'Distillation Heritage', value: '3 Generations' }
  ]);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const tabs = ['Brand Ticker', 'Difference Points', 'Our Story', 'Storefront Stats'];

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h1>Storefront Content CMS & Block Editor</h1>
          <p>Update live website copy, ticker banners, value cards, and brand stats instantly.</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Editor Content Area */}
      <div className={styles.contentCard}>
        {activeTab === 'Brand Ticker' && (
          <div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: '#F5F1E8', marginBottom: '0.5rem' }}>
              Header Announcement Marquee Ticker
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#A0A0A5', marginBottom: '1.5rem' }}>
              This text continuously scrolls across the top banner of the storefront.
            </p>

            <div className={styles.formGroup} style={{ marginBottom: '1.5rem' }}>
              <label className={styles.label}>Marquee Content String</label>
              <textarea
                rows={4}
                value={tickerText}
                onChange={(e) => setTickerText(e.target.value)}
                className={styles.textarea}
              />
            </div>

            <button type="button" onClick={handleSave} className={styles.saveBtn}>
              <Save size={16} /> Save Marquee Ticker
            </button>
            {savedSuccess && <div className={styles.toastMsg}>✓ Marquee Ticker updated live on storefront!</div>}
          </div>
        )}

        {activeTab === 'Difference Points' && (
          <div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: '#F5F1E8', marginBottom: '0.5rem' }}>
              Homepage 4 Difference Cards
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#A0A0A5', marginBottom: '1.5rem' }}>
              Edit the core brand value propositions displayed on the homepage.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
              {points.map((p, idx) => (
                <div key={idx} className={styles.cardEditor}>
                  <h4>Card {idx + 1}</h4>
                  <input
                    type="text"
                    value={p.title}
                    onChange={(e) => {
                      const updated = [...points];
                      updated[idx].title = e.target.value;
                      setPoints(updated);
                    }}
                    placeholder="Title"
                    className={styles.input}
                  />
                  <textarea
                    rows={2}
                    value={p.desc}
                    onChange={(e) => {
                      const updated = [...points];
                      updated[idx].desc = e.target.value;
                      setPoints(updated);
                    }}
                    placeholder="Description"
                    className={styles.textarea}
                  />
                </div>
              ))}
            </div>

            <button type="button" onClick={handleSave} className={styles.saveBtn}>
              <Save size={16} /> Save Difference Cards
            </button>
            {savedSuccess && <div className={styles.toastMsg}>✓ Difference Cards updated live!</div>}
          </div>
        )}

        {activeTab === 'Our Story' && (
          <div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: '#F5F1E8', marginBottom: '0.5rem' }}>
              Our Story & Founder Philosophy
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#A0A0A5', marginBottom: '1.5rem' }}>
              Update the bio and mission statement featured on the `/our-story` page.
            </p>

            <div className={styles.formGroup} style={{ marginBottom: '1.5rem' }}>
              <label className={styles.label}>Founder Bio & Mission Statement</label>
              <textarea
                rows={6}
                value={founderBio}
                onChange={(e) => setFounderBio(e.target.value)}
                className={styles.textarea}
              />
            </div>

            <button type="button" onClick={handleSave} className={styles.saveBtn}>
              <Save size={16} /> Save Founder Story
            </button>
            {savedSuccess && <div className={styles.toastMsg}>✓ Founder Story updated live!</div>}
          </div>
        )}

        {activeTab === 'Storefront Stats' && (
          <div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: '#F5F1E8', marginBottom: '0.5rem' }}>
              Homepage Key Proof Statistics
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#A0A0A5', marginBottom: '1.5rem' }}>
              Edit the 4 key numerical statistics highlighted across the brand site.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
              {stats.map((st, idx) => (
                <div key={idx} className={styles.cardEditor}>
                  <h4>Statistic {idx + 1}</h4>
                  <input
                    type="text"
                    value={st.value}
                    onChange={(e) => {
                      const updated = [...stats];
                      updated[idx].value = e.target.value;
                      setStats(updated);
                    }}
                    placeholder="Value (e.g. 50+)"
                    className={styles.input}
                  />
                  <input
                    type="text"
                    value={st.label}
                    onChange={(e) => {
                      const updated = [...stats];
                      updated[idx].label = e.target.value;
                      setStats(updated);
                    }}
                    placeholder="Label (e.g. Niche Fragrances)"
                    className={styles.input}
                  />
                </div>
              ))}
            </div>

            <button type="button" onClick={handleSave} className={styles.saveBtn}>
              <Save size={16} /> Save Statistics
            </button>
            {savedSuccess && <div className={styles.toastMsg}>✓ Statistics updated live!</div>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Content;
