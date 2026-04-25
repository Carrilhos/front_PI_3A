"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { getAnuncios, deletarAnuncio } from "@/services/api";
import styles from "./page.module.css";

export default function VendedorPage() {
  const { isLogado, isVendedor, user } = useAuth();
  const router = useRouter();
  const [anuncios, setAnuncios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletando, setDeletando] = useState(null);

  useEffect(() => {
    if (!isLogado || !isVendedor) {
      router.push("/login");
      return;
    }
    getAnuncios(user.id_usuario)
      .then(setAnuncios)
      .catch(() => setAnuncios([]))
      .finally(() => setLoading(false));
  }, [isLogado, isVendedor, user, router]);

  async function handleDeletar(id) {
    if (!confirm("Tem certeza que deseja excluir este anúncio?")) return;
    setDeletando(id);
    try {
      await deletarAnuncio(id);
      setAnuncios((prev) => prev.filter((a) => a.id_anuncio !== id));
    } catch {
      alert("Erro ao excluir anúncio.");
    } finally {
      setDeletando(null);
    }
  }

  if (loading) return <div className={styles.loading}>Carregando...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.titulo}>Área do Vendedor</h1>
        <Link href="/vendedor/novo-anuncio" className={styles.btnNovo}>
          + Novo Anúncio
        </Link>
      </div>

      {anuncios.length === 0 ? (
        <div className={styles.vazio}>
          <p>Você ainda não tem anúncios.</p>
          <Link href="/vendedor/novo-anuncio" className={styles.btnCriar}>
            Criar primeiro anúncio
          </Link>
        </div>
      ) : (
        <div className={styles.tabela}>
          <div className={styles.tabelaHeader}>
            <span>Produto</span>
            <span>Preço</span>
            <span>Estoque</span>
            <span>Ações</span>
          </div>
          {anuncios.map((anuncio) => (
            <div key={anuncio.id_anuncio} className={styles.tabelaRow}>
              <div className={styles.rowProduto}>
                {anuncio.imagem_principal && (
                  <img src={anuncio.imagem_principal} alt="" className={styles.rowImg} />
                )}
                <span className={styles.rowNome}>{anuncio.titulo}</span>
              </div>
              <span>R$ {parseFloat(anuncio.preco).toFixed(2).replace(".", ",")}</span>
              <span className={anuncio.estoque === 0 ? styles.semEstoque : ""}>
                {anuncio.estoque}
              </span>
              <div className={styles.acoes}>
                <Link href={`/vendedor/editar/${anuncio.id_anuncio}`} className={styles.btnEditar}>
                  Editar
                </Link>
                <button
                  className={styles.btnDeletar}
                  onClick={() => handleDeletar(anuncio.id_anuncio)}
                  disabled={deletando === anuncio.id_anuncio}
                >
                  {deletando === anuncio.id_anuncio ? "..." : "Excluir"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
