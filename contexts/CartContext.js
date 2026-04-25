"use client";

import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [itens, setItens] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("carrinho");
    if (stored) setItens(JSON.parse(stored));
  }, []);

  function salvar(novosItens) {
    setItens(novosItens);
    localStorage.setItem("carrinho", JSON.stringify(novosItens));
  }

  function addItem(anuncio) {
    setItens((prev) => {
      const existe = prev.find((i) => i.id_anuncio === anuncio.id_anuncio);
      let novos;
      if (existe) {
        novos = prev.map((i) =>
          i.id_anuncio === anuncio.id_anuncio
            ? { ...i, quantidade: i.quantidade + 1 }
            : i
        );
      } else {
        novos = [...prev, { ...anuncio, quantidade: 1 }];
      }
      localStorage.setItem("carrinho", JSON.stringify(novos));
      return novos;
    });
  }

  function removeItem(id_anuncio) {
    const novos = itens.filter((i) => i.id_anuncio !== id_anuncio);
    salvar(novos);
  }

  function setQuantidade(id_anuncio, quantidade) {
    if (quantidade < 1) {
      removeItem(id_anuncio);
      return;
    }
    const novos = itens.map((i) =>
      i.id_anuncio === id_anuncio ? { ...i, quantidade } : i
    );
    salvar(novos);
  }

  function clearCart() {
    salvar([]);
  }

  const total = itens.reduce((acc, i) => acc + i.preco * i.quantidade, 0);
  const totalItens = itens.reduce((acc, i) => acc + i.quantidade, 0);

  return (
    <CartContext.Provider value={{ itens, addItem, removeItem, setQuantidade, clearCart, total, totalItens }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
