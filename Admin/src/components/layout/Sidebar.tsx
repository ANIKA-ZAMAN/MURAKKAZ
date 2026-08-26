import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';
import { useTheme } from '../../context/ThemeContext';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingCart,
  FileText,
  Calendar,
  Star,
  Store,
  Users,
  Settings,
  LogOut,
  Diamond,
  X,
  Sun,
  Moon
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Products', path: '/products', icon: Package },
  { label: 'Collections', path: '/collections', icon: Layers },
  { label: 'Orders', path: '/orders', icon: ShoppingCart },
  { label: 'Blog', path: '/blog', icon: FileText },
  { label: 'Events', path: '/events', icon: Calendar },
  { label: 'Reviews', path: '/reviews', icon: Star },
  { label: 'Stores', path: '/stores', icon: Store },
  { label: 'Users', path: '/users', icon: Users },
  { label: 'Content CMS', path: '/cms', icon: FileText },
  { label: 'Settings', path: '/settings', icon: Settings },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose }) => {
  const { theme, setTheme } = useTheme();

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
      <div className={styles.brand}>
        <div className={styles.brandLeft}>
          <Diamond className={styles.logoIcon} size={24} />
          <span>MURAKKAZ</span>
        </div>
        {onClose && (
          <button className={styles.mobileCloseBtn} onClick={onClose} aria-label="Close menu">
            <X size={20} />
          </button>
        )}
      </div>

      <nav className={styles.nav}>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ''}`
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className={styles.footer}>
        <div className={styles.themeSection}>
          <div className={styles.themeSectionLabel}>Theme Mode</div>
          <div className={styles.themeSectionButtons}>
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`${styles.themeOptionBtn} ${theme === 'light' ? styles.themeOptionBtnActive : ''}`}
            >
              <Sun size={14} /> White
            </button>
            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`${styles.themeOptionBtn} ${theme === 'dark' ? styles.themeOptionBtnActive : ''}`}
            >
              <Moon size={14} /> Dark
            </button>
          </div>
        </div>

        <button className={styles.logoutBtn}>
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
};
