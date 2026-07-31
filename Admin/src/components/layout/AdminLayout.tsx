import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import styles from './AdminLayout.module.css';

export const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className={styles.layout}>
      {/* Mobile Overlay Backdrop */}
      {isSidebarOpen && (
        <div className={styles.mobileBackdrop} onClick={closeSidebar} />
      )}

      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      <div className={styles.mainContent}>
        <TopBar onToggleSidebar={toggleSidebar} />
        <main className={styles.pageContainer}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
