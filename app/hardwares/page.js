"use client";

import { useState, useEffect } from "react";
import { getAnunciosEnriquecidos, getCategorias } from "@/services/api";
import ProductCard from "@/components/ProductCard/ProductCard";
import styles from "./page.module.css";

export default function HardwaresPage() {
  const [anuncios, setAnuncios] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [filtro, setFiltro] = useState("Todos");
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregar() {
      try {
        const [dados, cats] = await Promise.all([
          getAnunciosEnriquecidos(),
          getCategorias(),
        ]);
        setAnuncios(dados);
        setCategorias(cats);
      } catch {
        setErro("Não foi possível carregar os produtos. Tente novamente.");
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, []);

  let filtrados = anuncios;

  if (filtro !== "Todos") {
    filtrados = filtrados.filter((a) => a.categoria_nome === filtro);
  }

  if (busca.trim() !== "") {
    filtrados = filtrados.filter((a) =>
      a.titulo.toLowerCase().includes(busca.toLowerCase())
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.titulo}>Todos os Hardwares</h1>

      <div className={styles.controles}>
        <input
          type="text"
          placeholder="Buscar por nome..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className={styles.busca}
        />

        <div className={styles.categorias}>
          <button
            onClick={() => setFiltro("Todos")}
            className={filtro === "Todos" ? styles.categoriaAtiva : styles.categoriaBtn}
          >
            Todos
          </button>
          {categorias.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFiltro(cat.nome)}
              className={filtro === cat.nome ? styles.categoriaAtiva : styles.categoriaBtn}
            >
              {cat.nome}
            </button>
          ))}
        </div>
      </div>

      {loading && <p className={styles.vazio}>Carregando produtos...</p>}
      {erro && <p className={styles.vazio}>{erro}</p>}

      {!loading && !erro && filtrados.length === 0 && (
        <p className={styles.vazio}>Nenhum produto encontrado.</p>
      )}

      {!loading && !erro && filtrados.length > 0 && (
        <div className={styles.grid}>
          {filtrados.map((anuncio) => (
            <ProductCard key={anuncio.id_anuncio} anuncio={anuncio} />
          ))}
        </div>
      )}
    </div>
  );
}
