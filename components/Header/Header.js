import Link from "next/link";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          HardwareStore
        </Link>

        <nav className={styles.nav}>
          <Link href="/" className={styles.link}>Início</Link>
          <Link href="/hardwares" className={styles.link}>Ver Hardwares</Link>
          <Link href="/montar-pc" className={styles.link}>Monte seu PC</Link>
        </nav>
      </div>
    </header>
  );
}
