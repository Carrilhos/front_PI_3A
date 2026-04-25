"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import styles from "./ProductCard.module.css";

export default function ProductCard({ anuncio }) {
  const { addItem } = useCart();
  const [adicionado, setAdicionado] = useState(false);

  function handleComprar() {
    addItem({
      id_anuncio: anuncio.id_anuncio,
      titulo: anuncio.titulo,
      preco: parseFloat(anuncio.preco),
      imagem: anuncio.imagem_principal,
    });
    setAdicionado(true);
    setTimeout(() => setAdicionado(false), 1500);
  }

  return (
    <div className={styles.card}>
      <Link href={`/anuncio/${anuncio.id_anuncio}`} className={styles.linkImagem}>
        <div className={styles.imagem}>
          {anuncio.imagem_principal ? (
            <img src={anuncio.imagem_principal} alt={anuncio.titulo} className={styles.img} />
          ) : (
            <span className={styles.semImagem}>Sem imagem</span>
          )}
        </div>
      </Link>

      <div className={styles.info}>
        <h3 className={styles.nome}>{anuncio.titulo}</h3>

        <p className={styles.preco}>
          R$ {parseFloat(anuncio.preco).toFixed(2).replace(".", ",")}
        </p>

        {anuncio.estoque === 0 ? (
          <p className={styles.semEstoque}>Sem estoque</p>
        ) : (
          <button
            className={adicionado ? styles.botaoOk : styles.botao}
            onClick={handleComprar}
            disabled={adicionado}
          >
            {adicionado ? "✓ Adicionado!" : "Comprar"}
          </button>
        )}
      </div>
    </div>
  );
}
