"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCarrinho } from "@/context/CarrinhoContext";
import styles from "./Header.module.css";

export default function Header() {
  const { estaAutenticado, usuario, logout, carregando } = useAuth();
  const { itens, totalItens, totalPreco, removerItem, alterarQuantidade } =
    useCarrinho();
  const pathname = usePathname();
  const router = useRouter();

  const [carrinhoAberto, setCarrinhoAberto] = useState(false);
  const dropdownRef = useRef(null);

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    function handleClickFora(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setCarrinhoAberto(false);
      }
    }
    document.addEventListener("mousedown", handleClickFora);
    return () => document.removeEventListener("mousedown", handleClickFora);
  }, []);

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          HardwareStore
        </Link>

        <nav className={styles.nav}>
          <Link href="/" className={styles.link}>
            Início
          </Link>
          <Link href="/hardwares" className={styles.link}>
            Ver Hardwares
          </Link>
          <Link href="/montar-pc" className={styles.link}>
            Monte seu PC
          </Link>

          {/* Carrinho */}
          <div className={styles.carrinhoWrapper} ref={dropdownRef}>
            <button
              id="btn-carrinho"
              className={styles.botaoCarrinho}
              onClick={() => setCarrinhoAberto((v) => !v)}
              aria-label="Abrir carrinho"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {totalItens > 0 && (
                <span className={styles.badge}>{totalItens}</span>
              )}
            </button>

            {carrinhoAberto && (
              <div className={styles.dropdown} role="dialog" aria-label="Carrinho de compras">
                <p className={styles.dropdownTitulo}>Carrinho</p>

                {itens.length === 0 ? (
                  <p className={styles.vazio}>Nenhum item no carrinho.</p>
                ) : (
                  <>
                    <ul className={styles.listaItens}>
                      {itens.map((item) => (
                        <li key={item.id} className={styles.itemCarrinho}>
                          <div className={styles.itemInfo}>
                            <span className={styles.itemNome}>{item.nome}</span>
                            <span className={styles.itemPreco}>
                              R${" "}
                              {(item.preco * item.quantidade)
                                .toFixed(2)
                                .replace(".", ",")}
                            </span>
                          </div>

                          <div className={styles.itemControles}>
                            <button
                              className={styles.btnQtd}
                              onClick={() =>
                                alterarQuantidade(item.id, item.quantidade - 1)
                              }
                              aria-label="Diminuir quantidade"
                            >
                              −
                            </button>
                            <span className={styles.quantidade}>
                              {item.quantidade}
                            </span>
                            <button
                              className={styles.btnQtd}
                              onClick={() =>
                                alterarQuantidade(item.id, item.quantidade + 1)
                              }
                              aria-label="Aumentar quantidade"
                            >
                              +
                            </button>
                            <button
                              className={styles.btnRemover}
                              onClick={() => removerItem(item.id)}
                              aria-label="Remover item"
                            >
                              ×
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>

                    <div className={styles.totalCarrinho}>
                      <span>Total</span>
                      <strong>
                        R$ {totalPreco.toFixed(2).replace(".", ",")}
                      </strong>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Área de autenticação — não renderiza enquanto carrega sessão */}
          {!carregando && (
            <>
              {estaAutenticado ? (
                <div className={styles.usuarioArea}>
                  <span className={styles.usuarioNome}>
                    {usuario?.nome || usuario?.email || "Minha conta"}
                  </span>
                  <button
                    onClick={handleLogout}
                    className={styles.botaoLogout}
                    id="btn-logout"
                  >
                    Sair
                  </button>
                </div>
              ) : (
                <Link
                  href={`/login?redirect=${encodeURIComponent(pathname)}`}
                  className={styles.linkLogin}
                  id="link-login"
                >
                  Entrar
                </Link>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
