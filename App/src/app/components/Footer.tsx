import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.topSection}>
          <div className={styles.leftCol}>
            <div className={styles.logoRow}>
              <span className={styles.logoMark}></span>
              <h2 className={styles.logoText}>Murakkaz</h2>
            </div>
            <p className={styles.bio}>
              Crafted for individuality, Murakkaz is a luxury niche fragrance
              collection that bridges art and scent. Discover collections
              designed to evoke memory, witness the ordinary transform into the
              exceptional.
            </p>
          </div>

          <div className={styles.rightCol}>
            <ul className={styles.navLinks}>
              <li><a href="#home">Home</a></li>
              <li><a href="#story">Our Story</a></li>
              <li><a href="#shop">Shop</a></li>
              <li><a href="#scent">Scent</a></li>
              <li><a href="#discovery">Discovery</a></li>
              <li><a href="#community">Community</a></li>
            </ul>

            <ul className={styles.subLinks}>
              <li><a href="#trends">Trend Finder</a></li>
              <li><a href="#finder">Perfume Finder</a></li>
            </ul>

            <div className={styles.socials}>
              <a href="#instagram" className={styles.socialIcon} aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="#facebook" className={styles.socialIcon} aria-label="Facebook">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#youtube" className={styles.socialIcon} aria-label="YouTube">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"></path>
                  <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"></polygon>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className={styles.bottomSection}>
          <p className={styles.copyright}>&copy; 2026 Murakkaz. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
