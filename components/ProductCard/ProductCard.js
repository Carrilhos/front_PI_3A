"use client";

import { useState } from "react";
import Link from "next/link";
import { useCarrinho } from "@/context/CarrinhoContext";
import styles from "./ProductCard.module.css";

export default function ProductCard({ produto }) {
  const { adicionarItem } = useCarrinho();
  const [adicionado, setAdicionado] = useState(false);
  const [favorito, setFavorito] = useState(false);

  const esgotado = produto.estoque <= 0;

  function handleAdicionar(e) {
    e.preventDefault();
    e.stopPropagation(); // Evita navegar ao clicar em "Adicionar"
    if (esgotado) return;
    
    adicionarItem({ ...produto, id: produto.id_anuncio, nome: produto.titulo });
    setAdicionado(true);
    // Feedback visual breve: volta ao estado normal após 1,5 s
    setTimeout(() => setAdicionado(false), 1500);
  }

  function handleFavorito(e) {
    e.preventDefault();
    e.stopPropagation(); // Evita navegar ao clicar no favorito
    setFavorito(!favorito);
  }

  const precoFormatado = Number(produto.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <Link href={`/hardwares/${produto.id_anuncio}`} className={styles.cardLink}>
      <div className={styles.card}>
        <div className={styles.imagemContainer}>
          {produto.imagem_principal ? (
            <img src={produto.imagem_principal} alt={produto.titulo} className={styles.imagem} />
          ) : (
            <div className={styles.placeholder}>
              <span>Sem Imagem</span>
            </div>
          )}
        </div>

        <div className={styles.info}>
          {produto.categoria && (
            <p className={styles.categoria}>{produto.categoria}</p>
          )}

          <h3 className={styles.nome} title={produto.titulo}>{produto.titulo}</h3>

          {/* Adicione atributos aqui se a API retornar, ex: marca, modelo */}

          <div className={styles.spacer}></div>

          <p className={styles.preco}>
            {precoFormatado}
          </p>

          <button
            className={`${styles.botao} ${adicionado ? styles.botaoAdicionado : ""} ${esgotado ? styles.botaoEsgotado : ""}`}
            onClick={handleAdicionar}
            disabled={adicionado || esgotado}
          >
            {esgotado ? "Esgotado" : adicionado ? "✓ Adicionado" : "Adicionar ao carrinho"}
          </button>
        </div>
      </div>
    </Link>
  );
}
