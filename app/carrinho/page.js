"use client";

import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import styles from "./page.module.css";

export default function CarrinhoPage() {
  const { itens, removeItem, setQuantidade, total } = useCart();

  if (itens.length === 0) {
    return (
      <div className={styles.container}>
        <h1 className={styles.titulo}>Carrinho</h1>
        <div className={styles.vazio}>
          <p>Seu carrinho está vazio.</p>
          <Link href="/hardwares" className={styles.btnContinuar}>
            Ver produtos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.titulo}>Carrinho</h1>

      <div className={styles.layout}>
        <div className={styles.itens}>
          {itens.map((item) => (
            <div key={item.id_anuncio} className={styles.item}>
              <div className={styles.itemImagem}>
                {item.imagem ? (
                  <img src={item.imagem} alt={item.titulo} className={styles.img} />
                ) : (
                  <div className={styles.semImg}>📦</div>
                )}
              </div>

              <div className={styles.itemInfo}>
                <Link href={`/anuncio/${item.id_anuncio}`} className={styles.itemNome}>
                  {item.titulo}
                </Link>
                <p className={styles.itemPreco}>
                  R$ {item.preco.toFixed(2).replace(".", ",")}
                </p>
              </div>

              <div className={styles.itemControles}>
                <button
                  className={styles.btnQtd}
                  onClick={() => setQuantidade(item.id_anuncio, item.quantidade - 1)}
                >
                  −
                </button>
                <span className={styles.qtd}>{item.quantidade}</span>
                <button
                  className={styles.btnQtd}
                  onClick={() => setQuantidade(item.id_anuncio, item.quantidade + 1)}
                >
                  +
                </button>
              </div>

              <p className={styles.itemTotal}>
                R$ {(item.preco * item.quantidade).toFixed(2).replace(".", ",")}
              </p>

              <button
                className={styles.btnRemover}
                onClick={() => removeItem(item.id_anuncio)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className={styles.resumo}>
          <h2 className={styles.resumoTitulo}>Resumo</h2>
          <div className={styles.resumoLinha}>
            <span>Subtotal</span>
            <span>R$ {total.toFixed(2).replace(".", ",")}</span>
          </div>
          <div className={styles.resumoTotal}>
            <span>Total</span>
            <span>R$ {total.toFixed(2).replace(".", ",")}</span>
          </div>
          <Link href="/checkout" className={styles.btnCheckout}>
            Finalizar Compra
          </Link>
          <Link href="/hardwares" className={styles.btnContinuarCompras}>
            Continuar Comprando
          </Link>
        </div>
      </div>
    </div>
  );
}
