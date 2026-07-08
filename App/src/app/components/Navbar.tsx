import Image from "next/image";
import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div className={styles.navbarWrapper}>
          <Image
            src="/images/navbar/navbar M.svg"
            alt="Murakkaz Navigation"
            width={1348}
            height={64}
            priority
            className={styles.navbarSvg}
          />
        </div>
      </nav>
    </header>
  );
}
