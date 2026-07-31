import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';
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
  Diamond
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

export const Sidebar: React.FC = () => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <Diamond className={styles.logoIcon} size={24} />
        <span>MURAKKAZ</span>
      </div>
      <nav className={styles.nav}>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
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
        <button className={styles.logoutBtn}>
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
};
