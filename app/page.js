import Link from "next/link";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <div className={styles.container}>
      <section className={styles.banner}>
        <h1 className={styles.titulo}>Bem vindo ao HardwareStore</h1>
        <p className={styles.subtitulo}>
          O marketplace brasileiro focado em peças de hardware.
          Compre e venda processadores, placas de vídeo, memórias e muito mais.
        </p>
      </section>

      <section className={styles.secoes}>
        <Link href="/hardwares" className={styles.cardSecao}>
          <h2>Ver todos os Hardwares</h2>
          <p>Navegue pelo catálogo completo de peças disponíveis.</p>
          <span className={styles.seta}>→</span>
        </Link>

        <Link href="/montar-pc" className={styles.cardSecao}>
          <h2>Monte o seu PC</h2>
          <p>
            Escolha cada peça e o sistema verifica se elas são compatíveis
            entre si (socket, memória, fonte, etc).
          </p>
          <span className={styles.seta}>→</span>
        </Link>
      </section>
    </div>
  );
}
