"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useAuth } from "@/context/AuthContext";

const CarrinhoContext = createContext(null);

const CHAVE_BASE = "hs_carrinho";

function chaveCarrinho(usuario) {
  // Carrinho único por usuário: usa ID ou email; anônimo usa "anonimo"
  const id = usuario?.id || usuario?.email || "anonimo";
  return `${CHAVE_BASE}_${id}`;
}

function lerDoStorage(chave) {
  try {
    const raw = localStorage.getItem(chave);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function salvarNoStorage(chave, itens) {
  try {
    localStorage.setItem(chave, JSON.stringify(itens));
  } catch {
    // quota excedida — ignora silenciosamente
  }
}

export function CarrinhoProvider({ children }) {
  const { usuario } = useAuth();
  const [itens, setItens] = useState([]);
  const [chave, setChave] = useState(null);

  // Recarrega o carrinho quando o usuário muda (login/logout)
  useEffect(() => {
    const novaChave = chaveCarrinho(usuario);
    setChave(novaChave);
    setItens(lerDoStorage(novaChave));
  }, [usuario]);

  // Persiste sempre que os itens mudam
  useEffect(() => {
    if (chave !== null) {
      salvarNoStorage(chave, itens);
    }
  }, [itens, chave]);

  /**
   * Adiciona um produto ao carrinho.
   * Se já existir, incrementa a quantidade.
   * @param {object} produto
   * @param {number} [quantidade=1]
   */
  const adicionarItem = useCallback((produto, quantidade = 1) => {
    setItens((prev) => {
      const existente = prev.find((i) => i.id === produto.id);
      if (existente) {
        return prev.map((i) =>
          i.id === produto.id
            ? { ...i, quantidade: i.quantidade + quantidade }
            : i
        );
      }
      return [...prev, { ...produto, quantidade }];
    });
  }, []);

  /**
   * Remove um produto completamente do carrinho.
   * @param {number|string} produtoId
   */
  const removerItem = useCallback((produtoId) => {
    setItens((prev) => prev.filter((i) => i.id !== produtoId));
  }, []);

  /**
   * Define a quantidade de um item. Se <= 0, remove.
   * @param {number|string} produtoId
   * @param {number} quantidade
   */
  const alterarQuantidade = useCallback((produtoId, quantidade) => {
    if (quantidade <= 0) {
      setItens((prev) => prev.filter((i) => i.id !== produtoId));
    } else {
      setItens((prev) =>
        prev.map((i) => (i.id === produtoId ? { ...i, quantidade } : i))
      );
    }
  }, []);

  /** Esvazia o carrinho. */
  const limparCarrinho = useCallback(() => {
    setItens([]);
  }, []);

  const totalItens = itens.reduce((acc, i) => acc + i.quantidade, 0);
  const totalPreco = itens.reduce((acc, i) => acc + i.preco * i.quantidade, 0);

  return (
    <CarrinhoContext.Provider
      value={{
        itens,
        totalItens,
        totalPreco,
        adicionarItem,
        removerItem,
        alterarQuantidade,
        limparCarrinho,
      }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
}

/**
 * Hook para consumir o contexto de carrinho.
 */
export function useCarrinho() {
  const ctx = useContext(CarrinhoContext);
  if (!ctx) {
    throw new Error("useCarrinho deve ser usado dentro de <CarrinhoProvider>");
  }
  return ctx;
}
