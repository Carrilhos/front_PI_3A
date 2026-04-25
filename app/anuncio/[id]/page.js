"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getAnuncioDetalhes } from "@/services/api";
import { useCart } from "@/contexts/CartContext";
import styles from "./page.module.css";

export default function AnuncioPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const [anuncio, setAnuncio] = useState(null);
  const [imagemAtiva, setImagemAtiva] = useState(0);
  const [loading, setLoading] = useState(true);
  const [adicionado, setAdicionado] = useState(false);

  useEffect(() => {
    getAnuncioDetalhes(id)
      .then(setAnuncio)
      .catch(() => router.push("/hardwares"))
      .finally(() => setLoading(false));
  }, [id, router]);

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

  if (loading) return <div className={styles.loading}>Carregando...</div>;
  if (!anuncio) return null;

  const imagens = anuncio.imagens?.length ? anuncio.imagens : [];

  return (
    <div className={styles.container}>
      <button onClick={() => router.back()} className={styles.voltar}>
        ← Voltar
      </button>

      <div className={styles.grid}>
        <div className={styles.galeria}>
          <div className={styles.imagemPrincipal}>
            {imagens[imagemAtiva] ? (
              <img src={imagens[imagemAtiva]} alt={anuncio.titulo} className={styles.img} />
            ) : (
              <div className={styles.semImagem}>Sem imagem</div>
            )}
          </div>
          {imagens.length > 1 && (
            <div className={styles.thumbnails}>
              {imagens.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt=""
                  className={i === imagemAtiva ? styles.thumbAtiva : styles.thumb}
                  onClick={() => setImagemAtiva(i)}
                />
              ))}
            </div>
          )}
        </div>

        <div className={styles.detalhes}>
          <h1 className={styles.titulo}>{anuncio.titulo}</h1>

          {anuncio.produto && (
            <p className={styles.produto}>
              {anuncio.produto.marca} {anuncio.produto.modelo}
            </p>
          )}

          <p className={styles.preco}>
            R$ {parseFloat(anuncio.preco).toFixed(2).replace(".", ",")}
          </p>

          {anuncio.estoque > 0 ? (
            <p className={styles.estoque}>✓ {anuncio.estoque} em estoque</p>
          ) : (
            <p className={styles.semEstoque}>Sem estoque</p>
          )}

          {anuncio.descricao && (
            <p className={styles.descricao}>{anuncio.descricao}</p>
          )}

          {anuncio.atributos?.length > 0 && (
            <div className={styles.atributos}>
              <h3 className={styles.atributosTitle}>Especificações</h3>
              <table className={styles.tabela}>
                <tbody>
                  {anuncio.atributos.map((attr, i) => {
                    const [nome, valor] = Object.entries(attr)[0];
                    return (
                      <tr key={i}>
                        <td className={styles.tdNome}>{nome}</td>
                        <td className={styles.tdValor}>{String(valor)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {anuncio.estoque > 0 && (
            <button
              className={adicionado ? styles.btnOk : styles.btn}
              onClick={handleComprar}
              disabled={adicionado}
            >
              {adicionado ? "✓ Adicionado ao carrinho!" : "Adicionar ao Carrinho"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
