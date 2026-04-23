import styles from "./ProductCard.module.css";

export default function ProductCard({ produto }) {
  return (
    <div className={styles.card}>
      <div className={styles.imagem}>
        <span>{produto.categoria}</span>
      </div>

      <div className={styles.info}>
        <p className={styles.categoria}>{produto.categoria}</p>
        <h3 className={styles.nome}>{produto.nome}</h3>

        {produto.socket && (
          <p className={styles.detalhe}>Socket: {produto.socket}</p>
        )}
        {produto.tipoRam && (
          <p className={styles.detalhe}>Memória: {produto.tipoRam}</p>
        )}
        {produto.tipo && (
          <p className={styles.detalhe}>Tipo: {produto.tipo}</p>
        )}
        {produto.tdp && (
          <p className={styles.detalhe}>TDP: {produto.tdp}W</p>
        )}
        {produto.watts && produto.categoria === "Fonte" && (
          <p className={styles.detalhe}>Potência: {produto.watts}W</p>
        )}

        <p className={styles.preco}>
          R$ {produto.preco.toFixed(2).replace(".", ",")}
        </p>

        <button className={styles.botao}>Comprar</button>
      </div>
    </div>
  );
}
