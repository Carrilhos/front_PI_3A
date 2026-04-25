"use client";

import { useState } from "react";
import { todosProdutos } from "@/data/produtos";
import ProductCard from "@/components/ProductCard/ProductCard";
import styles from "./page.module.css";

export default function HardwaresPage() {
  const [filtro, setFiltro] = useState("Todos");
  const [busca, setBusca] = useState("");

  const categorias = [
    "Todos",
    "Processador",
    "Placa Mãe",
    "Memória RAM",
    "Placa de Vídeo",
    "Fonte",
    "Armazenamento",
  ];

  let produtosFiltrados = todosProdutos;

  if (filtro !== "Todos") {
    produtosFiltrados = produtosFiltrados.filter(
      (p) => p.categoria === filtro
    );
  }

  if (busca.trim() !== "") {
    produtosFiltrados = produtosFiltrados.filter((p) =>
      p.nome.toLowerCase().includes(busca.toLowerCase())
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
          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => setFiltro(cat)}
              className={
                filtro === cat ? styles.categoriaAtiva : styles.categoriaBtn
              }
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {produtosFiltrados.length === 0 ? (
        <p className={styles.vazio}>Nenhum produto encontrado.</p>
      ) : (
        <div className={styles.grid}>
          {produtosFiltrados.map((produto) => (
            <ProductCard key={produto.id} produto={produto} />
          ))}
        </div>
      )}
    </div>
  );
}
