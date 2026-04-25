"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard/ProductCard";
import styles from "./page.module.css";

export default function HardwaresPage() {
  const [anuncios, setAnuncios] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [busca, setBusca] = useState("");
  const [buscaDebounced, setBuscaDebounced] = useState("");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("Todos");

  // Fetch initial data
  useEffect(() => {
    async function fetchData() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";
        
        const [resAnuncios, resCategorias] = await Promise.all([
          fetch(`${baseUrl}/anuncios`),
          fetch(`${baseUrl}/categorias`)
        ]);

        if (!resAnuncios.ok) throw new Error("Erro ao carregar os anúncios.");
        if (!resCategorias.ok) throw new Error("Erro ao carregar as categorias.");

        const [dataAnuncios, dataCategorias] = await Promise.all([
          resAnuncios.json(),
          resCategorias.json()
        ]);

        setAnuncios(dataAnuncios);
        setCategorias(dataCategorias);
      } catch (err) {
        console.error(err);
        setError("Não foi possível carregar os dados. Tente novamente mais tarde.");
        setTimeout(() => setError(null), 5000);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Debounce effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setBuscaDebounced(busca);
    }, 400); // 400ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [busca]);

  // Filtro combinado (local)
  const anunciosFiltrados = anuncios.filter((anuncio) => {
    // Verifica categoria
    // API das categorias tem `id`. Vamos assumir que o anúncio tenha `id_categoria`
    // Se a API tiver `id_categoria` no anuncio, checamos contra o id.
    const matchCategoria = 
      categoriaSelecionada === "Todos" || 
      anuncio.id_categoria === categoriaSelecionada;

    // Verifica busca (titulo | marca | modelo | descricao)
    const termo = buscaDebounced.toLowerCase();
    const matchBusca = termo === "" || [
      anuncio.titulo,
      anuncio.marca,
      anuncio.modelo,
      anuncio.descricao
    ].some((campo) => campo && String(campo).toLowerCase().includes(termo));

    return matchCategoria && matchBusca;
  });

  return (
    <div className={styles.container}>
      <h1 className={styles.titulo}>Todos os Hardwares</h1>

      <div className={styles.headerFiltros}>
        <input
          type="text"
          placeholder="Buscar por nome..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className={styles.busca}
        />

        <div className={styles.categoriasScroll}>
          <button
            onClick={() => setCategoriaSelecionada("Todos")}
            className={categoriaSelecionada === "Todos" ? styles.categoriaAtiva : styles.categoriaBtn}
          >
            Todos
          </button>
          
          {categorias.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoriaSelecionada(cat.id)}
              className={categoriaSelecionada === cat.id ? styles.categoriaAtiva : styles.categoriaBtn}
            >
              {cat.nome}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className={styles.toastError}>
          <span>{error}</span>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Carregando produtos...</p>
        </div>
      ) : anunciosFiltrados.length === 0 ? (
        <p className={styles.vazio}>Nenhum produto encontrado com os filtros atuais.</p>
      ) : (
        <div className={styles.grid}>
          {anunciosFiltrados.map((anuncio) => (
            <ProductCard key={anuncio.id_anuncio} produto={anuncio} />
          ))}
        </div>
      )}
    </div>
  );
}
